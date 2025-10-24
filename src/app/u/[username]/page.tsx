"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { messageSchema } from "@/schemas/messageSchema";
import axios from "axios";
import { toast } from "sonner";

interface PageProps {
  params: {
    username: string;
  };
}

export default function UserPage({ params }: PageProps) {
  const { username } = params;

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  // Generate AI suggestions using /api/chat
  useEffect(() => {
    const generateSuggestions = async () => {
      setIsLoadingSuggestions(true);

      const prompt =
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

      try {
        const { data } = await axios.post("/api/chat", {
          prompt, // ✅ send this key, not messages[]
        });

        // Extract the assistant's message
        const content = data?.text || data?.content || data?.message || JSON.stringify(data);

        // Split suggestions by "||"
        const suggestions = content
          .split("||")
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        if (suggestions.length > 0) {
          setSuggestedMessages(suggestions);
        } else {
          setSuggestedMessages(["What's a hobby you've recently started?", "If you could have dinner with any historical figure, who would it be?", "What's a simple thing that makes you happy?"]);
        }
      } catch (error) {
        console.error("Error generating suggestions:", error);
        // Fallback suggestions
        setSuggestedMessages(["What's a hobby you've recently started?", "If you could have dinner with any historical figure, who would it be?", "What's a simple thing that makes you happy?"]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    generateSuggestions();
  }, []);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmittingForm(true);
    try {
      const content = data.content;

      console.log("Sending message:", data.content);
      const response = await axios.post("/api/send-message", { content, username });
      toast("Message Send!!!");
      form.setValue("content", "");
      // Add your message sending logic here
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("content", suggestion);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-[1000px] p-8 space-y-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Public Profile Link</h1>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send message to @{username}</FormLabel>
                  <Textarea {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmittingForm}
            >
              {isSubmittingForm ? "Sending...." : "Send it"}
            </Button>
          </form>
        </Form>

        <div className="w-full space-y-8 p-4 pl-2 rounded-lg shadow-md">
          <p className="mb-4">Click on any message below to select the message:</p>
          {isLoadingSuggestions ? (
            <div className="w-full space-y-8 p-2 rounded-lg shadow-sm">
              <span className="text-gray-500">Generating suggestions...</span>
            </div>
          ) : (
            suggestedMessages.map((suggestion, index) => (
              <div
                className="w-full space-y-8 p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span>{suggestion}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
