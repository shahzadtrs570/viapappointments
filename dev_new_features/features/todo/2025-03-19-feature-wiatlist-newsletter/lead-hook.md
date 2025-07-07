// packages/ui/src/hooks/useLeadCapture.ts
import { useState } from "react";
import { api } from "@package/api";

// Define lead types as constants for consistency and type safety
export const LEAD_TYPES = {
  MEETING: 'meeting',
  WORKSHOP: 'workshop',
  SERVICE: 'service',
  CONSULTATION: 'consultation',
  OTHER: 'other',
} as const;

// Use TypeScript utility to create a union type from the object values
export type LeadType = typeof LEAD_TYPES[keyof typeof LEAD_TYPES] | string;

export interface LeadCaptureData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  leadType: LeadType;
  source?: string;
  metadata?: Record<string, unknown>; // Better type for metadata
}

export interface LeadCaptureResponse {
  leadId: string;
}

export function useLeadCapture() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  
  // Get the leads.submit mutation from tRPC
  const submitLeadMutation = api.leads.submit.useMutation({
    onSuccess: (data) => {
      setSuccess(true);
      setError(null);
      if (data?.leadId) {
        setLeadId(data.leadId);
      }
    },
    onError: (err) => {
      setError(err.message || "Failed to submit your information. Please try again.");
      setSuccess(false);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  
  const submitLead = async (data: LeadCaptureData): Promise<LeadCaptureResponse | undefined> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setLeadId(null);
    
    try {
      const result = await submitLeadMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
        leadType: data.leadType,
        source: data.source,
        metadata: data.metadata,
      });
      
      return result;
    } catch (err) {
      // Error is handled by the mutation's onError callback
      console.error("Lead submission error:", err);
      return undefined;
    }
  };
  
  return {
    submitLead,
    isLoading,
    error,
    success,
    leadId,
    reset: () => {
      setError(null);
      setSuccess(false);
      setLeadId(null);
    },
  };
}
