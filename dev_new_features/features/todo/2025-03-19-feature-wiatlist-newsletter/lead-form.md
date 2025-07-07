// packages/ui/src/components/leads/LeadCaptureForm.tsx
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadCaptureData, LeadType } from "../../hooks/useLeadCapture";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Custom field type definitions
export type FieldType = "text" | "email" | "phone" | "textarea" | "select" | "date";

export interface CustomField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

// Create a dynamic schema based on required fields and custom fields
function createLeadFormSchema(
  showPhoneField: boolean,
  showCompanyField: boolean,
  showMessageField: boolean,
  customFields: CustomField[] = []
) {
  const baseSchema = {
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
  };

  const optionalFields: Record<string, z.ZodType<any, any>> = {};

  if (showPhoneField) {
    optionalFields.phone = z.string().optional();
  }

  if (showCompanyField) {
    optionalFields.company = z.string().optional();
  }

  if (showMessageField) {
    optionalFields.message = z.string().optional();
  }

  // Add custom fields to schema
  for (const field of customFields) {
    if (field.required) {
      optionalFields[field.id] = z.string().min(1, `${field.label} is required`);
    } else {
      optionalFields[field.id] = z.string().optional();
    }
  }

  return z.object({ ...baseSchema, ...optionalFields });
}

export interface LeadCaptureFormProps {
  title: string;
  description: string;
  leadType: LeadType;
  source?: string;
  onSubmit: (data: LeadCaptureData) => Promise<any>;
  successMessage?: string;
  buttonText?: string;
  showPhoneField?: boolean;
  showCompanyField?: boolean;
  showMessageField?: boolean;
  customFields?: CustomField[];
  className?: string;
  metadata?: Record<string, unknown>;
}

export function LeadCaptureForm({
  title,
  description,
  leadType,
  source = "website",
  onSubmit,
  successMessage = "Form submitted successfully. We'll be in touch soon!",
  buttonText = "Submit",
  showPhoneField = false,
  showCompanyField = false,
  showMessageField = false,
  customFields = [],
  className,
  metadata = {},
}: LeadCaptureFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create schema based on form configuration
  const formSchema = createLeadFormSchema(
    showPhoneField,
    showCompanyField,
    showMessageField,
    customFields
  );

  // Initialize form with dynamic schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      ...(showPhoneField && { phone: "" }),
      ...(showCompanyField && { company: "" }),
      ...(showMessageField && { message: "" }),
      // Initialize custom fields with empty values
      ...customFields.reduce((acc, field) => ({ ...acc, [field.id]: "" }), {}),
    },
  });

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    // Extract custom field values for metadata
    const customFieldValues = customFields.reduce((acc, field) => {
      return {
        ...acc,
        [field.id]: values[field.id as keyof typeof values],
      };
    }, {});

    try {
      await onSubmit({
        name: values.name,
        email: values.email,
        phone: showPhoneField ? values.phone : undefined,
        company: showCompanyField ? values.company : undefined,
        message: showMessageField ? values.message : undefined,
        leadType,
        source,
        metadata: {
          ...metadata,
          ...customFieldValues,
        },
      });

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render form field based on field type
  const renderField = (field: CustomField) => {
    switch (field.type) {
      case "textarea":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "select":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "date":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {isSuccess ? (
          <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Name field (always required) */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email field (always required) */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your-email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional Phone field */}
              {showPhoneField && (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Optional Company field */}
              {showCompanyField && (
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Optional Message field */}
              {showMessageField && (
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help you?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Custom fields */}
              {customFields.map(renderField)}

              {/* Error message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}