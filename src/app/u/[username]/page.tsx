'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { motion } from 'framer-motion';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [suggestedMessages, setSuggestedMessages] = useState<string>(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
      });
      const text = await response.text();
      setSuggestedMessages(text);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch suggested messages',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-purple-400/10 to-transparent pointer-events-none"></div>
      
      <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 lg:py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full relative px-3 sm:px-6 lg:px-8 max-w-2xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-6 sm:space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
                Send Message to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">@{username}</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-300">
                Your message will be completely anonymous
              </p>
            </div>

            {/* Message Form */}
            <div className="p-3 sm:p-4 xl:p-6 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm sm:text-base text-gray-200">Your Message</FormLabel>
                          <span className="text-xs text-gray-400">{field.value?.length || 0}/500</span>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here..."
                            className="min-h-[200px] bg-black/20 border-white/20 text-gray-100 placeholder:text-gray-400 resize-none focus-visible:ring-purple-500 h-auto"
                            maxLength={500}
                            rows={8}
                            onKeyDown={(e) => {
                              const value = e.currentTarget.value;
                              if (value.length >= 500 && e.key !== 'Backspace' && e.key !== 'Delete' && !e.metaKey && !e.ctrlKey) {
                                e.preventDefault();
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-pink-200" />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading || !messageContent}
                      className="bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 hover:from-purple-500/40 hover:via-pink-500/40 hover:to-purple-500/40 text-white border border-white/20 hover:border-white/30 transition-all duration-300 text-sm shadow-md h-9 sm:h-10"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Suggested Messages */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-medium text-white">Message Ideas</h2>
                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 h-9 sm:h-10 px-4 sm:px-5 text-sm"
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Get New Ideas'
                  )}
                </Button>
              </div>

              <div className="p-4 sm:p-5 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {parseStringMessages(suggestedMessages).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => handleMessageClick(message)}
                      className="w-full justify-start text-left text-gray-200 hover:text-white hover:bg-white/10 py-3 px-4 text-sm sm:text-base whitespace-normal break-words leading-relaxed"
                    >
                      {message}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-center space-y-3"
            >
              <Separator className="bg-white/10" />
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Want to receive anonymous messages?</p>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 hover:from-purple-500/40 hover:via-pink-500/40 hover:to-purple-500/40 text-white border border-white/20 hover:border-white/30 transition-all duration-300 text-sm shadow-md h-9 sm:h-10">
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}