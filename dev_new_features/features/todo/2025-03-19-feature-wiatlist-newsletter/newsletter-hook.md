// packages/ui/src/hooks/useNewsletterSignup.ts
import { useState } from "react";
import { api } from "@package/api";

export interface NewsletterSignupData {
  email: string;
  name?: string;
  source?: string;
  tags?: string[];
}

export interface NewsletterSignupResponse {
  subscriberId: string;
}

export function useNewsletterSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [subscriberId, setSubscriberId] = useState<string | null>(null);
  
  // Get the newsletter.subscribe mutation from tRPC
  const subscribeMutation = api.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setSuccess(true);
      setError(null);
      if (data?.subscriberId) {
        setSubscriberId(data.subscriberId);
      }
    },
    onError: (err) => {
      setError(err.message || "Failed to subscribe to the newsletter. Please try again.");
      setSuccess(false);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  
  const subscribe = async (data: NewsletterSignupData): Promise<NewsletterSignupResponse | undefined> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setSubscriberId(null);
    
    try {
      const result = await subscribeMutation.mutateAsync({
        email: data.email,
        name: data.name,
        source: data.source,
        tags: data.tags,
      });
      
      return result;
    } catch (err) {
      // Error is handled by the mutation's onError callback
      console.error("Newsletter signup error:", err);
      return undefined;
    }
  };
  
  return {
    subscribe,
    isLoading,
    error,
    success,
    subscriberId,
    reset: () => {
      setError(null);
      setSuccess(false);
      setSubscriberId(null);
    },
  };
}
