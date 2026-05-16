'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { motion, AnimatePresence } from 'framer-motion';
import suggestionsPool from '@/data/suggestions.json';

const getRandomSuggestions = (count = 3): string[] => {
  const shuffled = [...suggestionsPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isNotAccepting, setIsNotAccepting] = useState(false);

  useEffect(() => {
    setSuggestedMessages(getRandomSuggestions());
  }, []);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });
      toast({ title: response.data.message, variant: 'default' });
      form.reset({ ...form.getValues(), content: '' });
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2800);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const msg = axiosError.response?.data.message ?? '';
      if (msg === 'User is not accepting messages') {
        setIsNotAccepting(true);
      } else {
        toast({
          title: 'Error',
          description: msg || 'Failed to sent message',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleSuggestions = () => {
    setIsSuggestLoading(true);
    setTimeout(() => {
      setSuggestedMessages(getRandomSuggestions());
      setIsSuggestLoading(false);
    }, 300);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EC', fontFamily: "'Space Mono', monospace" }}>

      <section style={{ padding: '36px 20px 56px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '21px', color: '#1C1410', letterSpacing: '-0.3px' }}>
                Quietly
              </span>
            </Link>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#A89890', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <Lock style={{ width: '9px', height: '9px' }} />
              anonymous
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            style={{ marginBottom: '32px' }}
          >
            <p style={{ fontSize: '12px', color: '#A8412D', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 14px', fontWeight: 700 }}>
              anonymous message
            </p>
            <h1 style={{ margin: '0 0 10px', lineHeight: 1.05 }}>
              <span style={{ display: 'block', fontSize: '13px', color: '#8A7A74', marginBottom: '4px', fontWeight: 400 }}>
                sending to
              </span>
              <span style={{
                fontSize: 'clamp(30px, 7vw, 46px)',
                color: '#1C1410',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                letterSpacing: '-1px',
              }}>
                @{username}
              </span>
            </h1>
            <p style={{ fontSize: '13px', color: '#7A6A64', margin: '10px 0 0', lineHeight: 1.6, fontWeight: 400 }}>
              They&apos;ll never know it was you — no account needed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.13 }}
            style={{
              background: '#FFFFFF',
              border: `1.5px solid ${isNotAccepting ? '#DDD5CE' : (isFocused ? '#D4674F' : '#DDD5CE')}`,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: isFocused
                ? '0 8px 32px rgba(212,103,79,0.12)'
                : '0 2px 20px rgba(28,20,16,0.07)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              marginBottom: '20px',
            }}
          >
            <Form {...form}>
              {isNotAccepting ? (
                <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>🔒</div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1410', margin: '0 0 6px' }}>
                    Not accepting messages
                  </p>
                  <p style={{ fontSize: '12px', color: '#8A7A74', margin: 0, lineHeight: 1.6 }}>
                    @{username} has turned off anonymous messages for now.
                  </p>
                </div>
              ) : (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write something honest, curious, or kind..."
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '0',
                            fontSize: '14px',
                            color: '#1C1410',
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: 500,
                            padding: '20px 20px 0',
                            minHeight: '130px',
                            resize: 'none',
                            lineHeight: '1.75',
                            boxShadow: 'none',
                          }}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#C0B4AE] placeholder:font-normal"
                          maxLength={500}
                          rows={6}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          onKeyDown={(e) => {
                            const value = e.currentTarget.value;
                            if (value.length >= 500 && e.key !== 'Backspace' && e.key !== 'Delete' && !e.metaKey && !e.ctrlKey) {
                              e.preventDefault();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage style={{ fontSize: '11px', color: '#C0504A', fontFamily: "'Space Mono', monospace", padding: '0 20px 8px' }} />
                    </FormItem>
                  )}
                />

                <div style={{ padding: '12px 20px', borderTop: '1px solid #F0E8E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Lock style={{ width: '10px', height: '10px', color: '#B0A49E', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: '#9A8880' }}>
                      {username} can&apos;t see who sent this
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: (messageContent?.length ?? 0) >= 480 ? '#C0504A' : '#B0A49E',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  }}>
                    {messageContent?.length ?? 0}/500
                  </span>
                </div>

                <div style={{ padding: '0 16px 16px' }}>
                  <AnimatePresence mode="wait">
                    {sendSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          height: '46px',
                          background: '#EDF7F1',
                          border: '1px solid #B8DEC8',
                          borderRadius: '10px',
                        }}
                      >
                        <CheckCircle2 style={{ width: '14px', height: '14px', color: '#2E7D50' }} />
                        <span style={{ fontSize: '13px', color: '#2E7D50', letterSpacing: '0.04em' }}>Sent. They&apos;ll never know.</span>
                      </motion.div>
                    ) : (
                      <motion.div key="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isLoading || !messageContent}
                          style={{
                            width: '100%',
                            height: '46px',
                            background: isLoading || !messageContent ? '#EAD8D2' : '#D4674F',
                            color: isLoading || !messageContent ? '#B89088' : '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            letterSpacing: '0.07em',
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: 700,
                            cursor: isLoading || !messageContent ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s, color 0.2s',
                          }}
                        >
                          {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            'Send anonymously →'
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
              )}
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles style={{ width: '11px', height: '11px', color: '#A8412D' }} />
                <span style={{ fontSize: '10px', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#A8412D', fontWeight: 700 }}>
                  Need a nudge?
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={shuffleSuggestions}
                disabled={isSuggestLoading}
                style={{
                  background: 'transparent',
                  border: '1px solid #DDD5CE',
                  borderRadius: '6px',
                  padding: '4px 11px',
                  fontSize: '11px',
                  color: '#7A6A64',
                  fontFamily: "'Space Mono', monospace",
                  cursor: isSuggestLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  opacity: isSuggestLoading ? 0.5 : 1,
                  letterSpacing: '0.04em',
                }}
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 style={{ width: '10px', height: '10px' }} className="animate-spin" />
                    shuffling...
                  </>
                ) : (
                  'shuffle'
                )}
              </motion.button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <AnimatePresence mode="popLayout">
                {suggestedMessages.map((message, index) => (
                  <motion.button
                    key={message}
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.22 }}
                    whileHover={{ scale: 1.03, backgroundColor: '#D4674F', color: '#FFFFFF', borderColor: '#D4674F' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMessageClick(message)}
                    style={{
                      background: '#FFF8F5',
                      border: '1px solid #EDD8D0',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      color: '#6B3D34',
                      fontFamily: "'Space Mono', monospace",
                      cursor: 'pointer',
                      textAlign: 'left',
                      lineHeight: '1.5',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      userSelect: 'none',
                      display: 'inline-block',
                      fontWeight: 500,
                    }}
                  >
                    {message}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </section>

      <section style={{ borderTop: '1px solid #E8DDD8', padding: '24px 20px' }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: '#7A6A64', margin: 0 }}>
            Want your own Quietly page?
          </p>
          <Link
            href="/sign-up"
            style={{
              fontSize: '12px',
              color: '#FFFFFF',
              background: '#D4674F',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 700,
            }}
          >
            Get your free link →
          </Link>
        </div>
      </section>
    </div>
  );
}
