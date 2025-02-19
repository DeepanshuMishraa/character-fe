'use client'

import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateCharacterButton } from '@/components/create-character-button';
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Plus } from 'lucide-react';
import axios from 'axios';
import { useSession } from '@/lib/auth-client';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
}

export default function Dashboard() {
  const session = useSession();
  const { data: charactersData, isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const response = await api.get('/character/bulk');
      return response.data.character as Character[];
    },
    enabled: !!session?.data?.user,
  });

  if (session?.isPending) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card-background mt-20">
      <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 fade-in">
          <div>
            <h1 className="text-3xl font-medium tracking-tight">Characters</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your AI companions
            </p>
          </div>
          <CreateCharacterButton />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl" />
            ))}
          </div>
        ) : !charactersData || charactersData.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 rounded-xl bg-card fade-in">
            <div className="w-16 h-16 mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Plus className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No characters yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first character to get started
            </p>
            <CreateCharacterButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {charactersData.map((character, index) => (
              <Card
                key={character.id}
                className="character-card bg-card/80 border-0 p-6 hover:bg-card"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="card-content">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-14 w-14 rounded-xl ring-2 ring-border">
                      <AvatarImage
                        src={character.avatar}
                        alt={character.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-xl bg-secondary text-secondary-foreground">
                        {character.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">
                        {character.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {character.personality}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/80 line-clamp-3 mb-6 h-[4.5em]">
                    {character.description}
                  </p>

                  <Button
                    className="w-full bg-primary/90 hover:bg-primary text-primary-foreground"
                    onClick={() => window.location.href = `/dashboard/chat/${character.id}`}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
