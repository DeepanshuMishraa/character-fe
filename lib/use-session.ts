import { useEffect, useState } from "react";
import axios from "axios";

export interface User {
  id: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

// Create axios instance with better defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // Important for cookies
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    async function fetchUser() {
      try {
        console.log('Fetching user session...');
        console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

        setError(null);
        const { data } = await api.get<{ user: User }>('/api/auth/me');

        if (isMounted) {
          if (data?.user) {
            setUser(data.user);
            setRetryCount(0); // Reset retry count on success
            console.log('User set:', data.user);
          } else {
            console.warn('No user data in response:', data);
            setUser(null);
            // If no user data but response is successful, retry a few times
            if (retryCount < 3) {
              retryTimeout = setTimeout(() => {
                setRetryCount(prev => prev + 1);
              }, 1000); // Retry after 1 second
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          if (axios.isAxiosError(error)) {
            console.log('Axios error:', {
              status: error.response?.status,
              data: error.response?.data,
              headers: error.response?.headers,
              message: error.message
            });

            if (error.response?.status === 401) {
              console.log('User not authenticated (401)');
              setUser(null);
            } else {
              const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch user data';
              console.error('Session error:', errorMsg);
              setError(errorMsg);
              // Retry on network errors or 5xx errors
              if (!error.response || error.response.status >= 500) {
                if (retryCount < 3) {
                  retryTimeout = setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                  }, 1000); // Retry after 1 second
                }
              }
            }
          } else {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred');
          }
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryCount]); // Add retryCount as a dependency

  const sessionState = {
    user,
    loading,
    error,
    isAuthenticated: !!user
  };

  console.log('useSession hook state:', sessionState);
  return sessionState;
}
