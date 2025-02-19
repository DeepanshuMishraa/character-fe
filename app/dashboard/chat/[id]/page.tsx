'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from '@/lib/auth-client';
import { Loader2, ArrowLeft, SendHorizontal } from 'lucide-react';
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

const ChatMessage = React.memo(({
  message,
  character,
  userAvatar
}: {
  message: Message;
  character?: Character;
  userAvatar?: string | null;
}) => (
  <div className="flex items-start gap-3 px-2 animate-in fade-in slide-in-from-bottom-2">
    {message.role === 'assistant' ? (
      <Avatar className="h-8 w-8 shrink-0 select-none ring-2 ring-border/40">
        <AvatarImage src={character?.avatar} alt={character?.name} />
        <AvatarFallback>{character?.name?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
    ) : (
      <div className="ml-auto" />
    )}
    <div
      className={`
        px-4 py-2.5 rounded-2xl max-w-[80%] break-words
        ${message.role === 'user'
          ? 'ml-auto bg-primary text-primary-foreground'
          : 'bg-muted/50'
        }
        ${message.isStreaming ? 'animate-pulse' : ''}
      `}
    >
      <p className="text-sm whitespace-pre-wrap leading-relaxed">
        {message.content}
      </p>
    </div>
    {message.role === 'user' ? (
      <Avatar className="h-8 w-8 shrink-0 select-none ring-2 ring-border/40">
        <AvatarImage src={userAvatar || undefined} alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    ) : (
      <div className="mr-auto" />
    )}
  </div>
));

ChatMessage.displayName = 'ChatMessage';

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const session = useSession();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);

  // Optimized scrolling function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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
    staleTime: 1000, // Prevent unnecessary refetches
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

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${id}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

          accumulatedMessage += decoder.decode(value, { stream: true });
          queryClient.setQueryData(['messages', id], (oldMessages: Message[] = []) => {
            return oldMessages.map(msg =>
              msg.id === streamingId
                ? { ...msg, content: accumulatedMessage }
                : msg
            );
          });
          scrollToBottom();
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
        queryClient.setQueryData(['messages', id], (oldMessages: Message[] = []) => {
          return oldMessages.filter(msg => msg.id !== streamingId);
        });
      } finally {
        setIsStreaming(false);
      }
    },
    onSuccess: () => {
      setMessage('');
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isPending) return;
    sendMessage.mutate(message);
  };

  if (characterError) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 text-center space-y-4 bg-card/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-destructive">Character not found</h2>
          <p className="text-muted-foreground">
            This character doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
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
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container max-w-3xl mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link
              href="/dashboard"
              className="mr-4 rounded-lg hover:bg-muted transition-colors"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Avatar className="h-8 w-8 ring-2 ring-border/40">
              <AvatarImage src={character?.avatar} alt={character?.name} />
              <AvatarFallback>{character?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <h2 className="text-sm font-medium leading-none">
                {character?.name}
              </h2>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {character?.personality}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto pt-16 pb-[76px] scroll-smooth">
        <div className="container max-w-3xl mx-auto">
          <div className="flex flex-col gap-4 p-4">
            {messagesLoading ? (
              <div className="flex justify-center pt-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4 space-y-4">
                <div className="p-4 rounded-full bg-muted">
                  <Avatar className="h-12 w-12 ring-2 ring-border/40">
                    <AvatarImage src={character?.avatar} alt={character?.name} />
                    <AvatarFallback>
                      {character?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="font-medium text-xl">
                    Chat with {character?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with {character?.name}. They will respond based on
                    their unique personality and backstory.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  character={character}
                  userAvatar={session.data?.user?.image}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
        <div className="container max-w-3xl mx-auto p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${character?.name || ''}...`}
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
              size="icon"
              disabled={sendMessage.isPending || !message.trim()}
              className="h-10 w-10"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
