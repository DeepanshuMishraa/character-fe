'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from '@/lib/auth-client';
import { Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isStreaming?: boolean;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const session = useSession();
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!session?.isPending && !session?.data?.user) {
      router.push(`${process.env.NEXT_PUBLIC_URL}`);
    }
  }, [session?.isPending, session?.data?.user, router]);

  const { data: character, isError: characterError } = useQuery<Character>({
    queryKey: ['character', id],
    queryFn: async () => {
      const response = await api.get(`/character/${id}`);
      return response.data.character;
    },
    enabled: !!session?.data?.user && !!id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['messages', id],
    queryFn: async () => {
      const response = await api.get(`/chat/${id}/messages`);
      return response.data.messages;
    },
    enabled: !!session?.data?.user && !!id,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user'
      };

      queryClient.setQueryData(['messages', id], (oldMessages: Message[] = []) => {
        return [...oldMessages, userMessage];
      });

      // Create a placeholder for the assistant's streaming message
      const streamingId = Date.now().toString() + '-streaming';
      queryClient.setQueryData(['messages', id], (oldMessages: Message[] = []) => {
        return [...oldMessages, {
          id: streamingId,
          content: '',
          role: 'assistant',
          isStreaming: true
        }];
      });

      setIsStreaming(true);
      setStreamingMessage('');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${id}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const decoder = new TextDecoder();
        let accumulatedMessage = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Process the chunk immediately
          const chunk = decoder.decode(value, { stream: true });
          accumulatedMessage += chunk;

          // Update the streaming message immediately
          queryClient.setQueryData(['messages', id], (oldMessages: Message[] = []) => {
            return oldMessages.map(msg =>
              msg.id === streamingId
                ? { ...msg, content: accumulatedMessage }
                : msg
            );
          });

          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
          }
        }

        queryClient.setQueryData(['messages', id], (oldMessages: Message[] = []) => {
          return oldMessages.map(msg =>
            msg.id === streamingId
              ? {
                id: Date.now().toString(),
                content: accumulatedMessage,
                role: 'assistant',
                isStreaming: false
              }
              : msg
          );
        });

      } catch (error) {
        console.error('Error:', error);
        // Remove the streaming message on error
        queryClient.setQueryData(['messages', id], (oldMessages: Message[] = []) => {
          return oldMessages.filter(msg => msg.id !== streamingId);
        });
      } finally {
        setIsStreaming(false);
        setStreamingMessage('');
      }
    },
    onSuccess: () => {
      setMessage('');
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current && (isFirstLoad || sendMessage.isSuccess)) {
      const scrollArea = scrollAreaRef.current;
      setTimeout(() => {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }, 100);
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad, sendMessage.isSuccess]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isPending) return;
    sendMessage.mutate(message);
  };

  if (characterError) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Character not found</h2>
          <p className="text-muted-foreground mb-4">This character doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  if (session?.isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Chat Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href="/dashboard" className="mr-4 hover:opacity-70 transition">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarImage src={character?.avatar} alt={character?.name} />
              <AvatarFallback>{character?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <h2 className="text-sm font-semibold truncate">{character?.name}</h2>
              <p className="text-xs text-muted-foreground truncate">{character?.personality}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-hidden pt-16 pb-20">
        <div className="container h-full mx-auto px-4">
          <div
            ref={scrollAreaRef}
            className="h-full overflow-y-auto py-4 space-y-4"
          >
            {messagesLoading ? (
              <div className="flex justify-center pt-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
                <div className="p-4 rounded-full bg-muted">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={character?.avatar} alt={character?.name} />
                    <AvatarFallback>{character?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl">Chat with {character?.name}</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Start a conversation with {character?.name}. They will respond based on their unique personality.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mb-1">
                      <AvatarImage src={character?.avatar} alt={character?.name} />
                      <AvatarFallback>{character?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`
                      px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-[75%] break-words
                      ${msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                      }
                      ${msg.isStreaming ? 'animate-pulse' : ''}
                    `}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <Avatar className="h-8 w-8 mb-1">
                      <AvatarImage src={session.data?.user?.image} alt={session.data?.user?.name || 'User'} />
                      <AvatarFallback>{session.data?.user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSend} className="flex gap-2 items-center">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendMessage.isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (message.trim() && !sendMessage.isPending) {
                    sendMessage.mutate(message);
                  }
                }
              }}
            />
            <Button
              type="submit"
              disabled={sendMessage.isPending || !message.trim()}
              className="h-10 px-4"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
} 
