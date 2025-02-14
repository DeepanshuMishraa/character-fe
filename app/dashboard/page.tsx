'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateCharacterButton } from '@/components/create-character-button';
import { Skeleton } from "@/components/ui/skeleton";
import axios from 'axios';
import { useSession } from '@/lib/auth-client';
const api = axios.create({
  baseURL: '/api',
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
  story: string;
  personality: string;
}

export default function Dashboard() {
  const session = useSession();
  const { data: charactersData, isLoading, error } = useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const response = await api.get('/character/bulk');
      return response.data.character as Character[];
    },
    // Only fetch if authenticated
    enabled: !!session?.data?.user,
  });

  if (session?.isPending) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Failed to load characters</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Characters</h1>
        <CreateCharacterButton />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !charactersData || charactersData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-xl text-muted-foreground mb-4">No characters found</p>
          <p className="text-sm text-muted-foreground mb-6">Create your first character to get started</p>
          <CreateCharacterButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charactersData.map((character) => (
            <Card key={character.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={character.avatar} alt={character.name} />
                    <AvatarFallback>{character.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{character.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{character.personality}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{character.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = `/dashboard/chat/${character.id}`}
                >
                  Chat
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
