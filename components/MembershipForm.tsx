"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2, Mail, Phone, User, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Validation schema (includes honeypot field)
const membershipFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits",
    }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(200, { message: "Subject must not exceed 200 characters" }),
  message: z
    .string()
    .optional()
    .refine((value) => value === undefined || value.length <= 1000, {
      message: "Message must not exceed 1000 characters",
    }),
  // Honeypot field - should always be empty
  website: z.string().max(0).optional(),
});

type MembershipFormValues = z.infer<typeof membershipFormSchema>;

// Client-side rate limiting
const RATE_LIMIT_KEY = "membership_submissions";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

interface SubmissionRecord {
  timestamp: number;
}

export default function MembershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingSubmissions, setRemainingSubmissions] = useState<number>(RATE_LIMIT_MAX);
  const { toast } = useToast();

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "", // Honeypot field
    },
  });

  // Check client-side rate limit on mount
  useEffect(() => {
    checkRateLimit();
  }, []);

  const checkRateLimit = () => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) {
        setRemainingSubmissions(RATE_LIMIT_MAX);
        return true;
      }

      const submissions: SubmissionRecord[] = JSON.parse(stored);
      const now = Date.now();

      // Filter out old submissions
      const recentSubmissions = submissions.filter(
        (sub) => now - sub.timestamp < RATE_LIMIT_WINDOW
      );

      const remaining = RATE_LIMIT_MAX - recentSubmissions.length;
      setRemainingSubmissions(remaining);

      if (remaining <= 0) {
        return false;
      }

      // Update localStorage with filtered submissions
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
      return true;
    } catch (error) {
      console.error("Error checking rate limit:", error);
      return true; // Allow submission if localStorage fails
    }
  };

  const recordSubmission = () => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      const submissions: SubmissionRecord[] = stored ? JSON.parse(stored) : [];
      submissions.push({ timestamp: Date.now() });
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
      checkRateLimit();
    } catch (error) {
      console.error("Error recording submission:", error);
    }
  };

  const onSubmit = async (data: MembershipFormValues) => {
    // Honeypot check - if website field is filled, it's a bot
    if (data.website && data.website.length > 0) {
      console.warn("Spam detected: honeypot field filled");
      // Pretend success to fool bots
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest.",
      });
      form.reset();
      return;
    }

    // Client-side rate limit check
    if (!checkRateLimit()) {
      const errorMsg = "You've reached the submission limit. Please try again in an hour.";
      setErrorMessage(errorMsg);
      toast({
        variant: "destructive",
        title: "Submission Limit Reached",
        description: errorMsg,
      });
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrorMessage(null);

    try {
      // Call API route to send email
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle network errors
      if (!response) {
        throw new Error("Network error. Please check your connection and try again.");
      }

      const result = await response.json();

      if (!response.ok) {
        // Handle different error types
        if (response.status === 429) {
          const errorMsg = "Too many submissions. Please try again in an hour.";
          toast({
            variant: "destructive",
            title: "Rate Limit Exceeded",
            description: errorMsg,
          });
          throw new Error(errorMsg);
        } else if (response.status === 400) {
          const errorMsg = "Please check your form data and try again.";
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: errorMsg,
          });
          throw new Error(errorMsg);
        } else if (response.status === 500) {
          const errorMsg = "Server error. Please try again later.";
          toast({
            variant: "destructive",
            title: "Server Error",
            description: errorMsg,
          });
          throw new Error(errorMsg);
        } else {
          throw new Error(result.error || "Failed to submit application. Please try again.");
        }
      }

      // Record successful submission for rate limiting
      recordSubmission();

      // Show success message
      setIsSuccess(true);
      toast({
        title: "✅ Application Submitted Successfully!",
        description: "We'll review your application and get back to you soon.",
        duration: 5000,
      });

      // Reset form after successful submission
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = "Network error. Please check your internet connection.";
        setErrorMessage(networkError);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: networkError,
        });
      } else {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: errorMsg,
        });
      }

      // Hide error message after 8 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111184' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary-800 sm:text-4xl lg:text-5xl">
            Membership Application
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join the Asansol Coalfield Diabetes Association and be part of our mission to provide
            quality diabetes care and awareness in our community.
          </p>
          {remainingSubmissions < RATE_LIMIT_MAX && remainingSubmissions > 0 && (
            <p className="mt-4 text-sm text-gray-500">
              {remainingSubmissions} {remainingSubmissions === 1 ? "submission" : "submissions"}{" "}
              remaining this hour
            </p>
          )}
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Application Submitted Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Thank you for your interest. We will review your application and get back to you
                  soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Submission Failed</h3>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl lg:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-primary-800">
                      Full Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Enter your full name"
                          className="pl-10 focus:border-primary focus:ring-primary"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Honeypot Field - Hidden from users, visible to bots */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="hidden" aria-hidden="true">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Leave this field empty"
                        tabIndex={-1}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-primary-800">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10 focus:border-primary focus:ring-primary"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-primary-800">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="1234567890"
                          className="pl-10 focus:border-primary focus:ring-primary"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm text-gray-500">
                      Enter 10-digit phone number without spaces or dashes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject Field */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-primary-800">
                      Subject <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="e.g., Membership Application"
                          className="pl-10 focus:border-primary focus:ring-primary"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-primary-800">
                      Message <span className="text-gray-400">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us why you want to join and how you can contribute to our mission..."
                        className="min-h-[150px] resize-none focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={true}
                  className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Submit Application
                    </>
                  )}
                </Button>
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Membership Applications Temporarily Closed
                      </p>
                      <p className="mt-1 text-sm text-amber-700">
                        We are not currently accepting new membership applications. Please check
                        back later or contact us for more information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
