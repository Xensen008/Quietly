'use client'

import React, { useRef, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2, Download, Copy, MessageCircle, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@/models/User.model';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const messageCardRef = useRef<HTMLDivElement>(null);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-messages/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const downloadCard = useCallback(async () => {
    if (!messageCardRef.current) return;

    try {
      toast({
        title: 'Preparing download...',
        description: 'Capturing your message',
      });

      const canvas = await html2canvas(messageCardRef.current, {
        backgroundColor: '#000',
        scale: 3,
        logging: false,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-message-card]');
          if (clonedElement) {
            clonedElement.classList.add('screenshot-mode');
          }
        }
      });

      const link = document.createElement('a');
      link.download = 'quietly-message.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      toast({
        title: 'Downloaded!',
        description: 'Your message has been saved as an image.',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: 'Copied!',
        description: 'Message copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy message.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card 
        ref={messageCardRef}
        data-message-card
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/90 backdrop-blur-xl border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-purple-500/10 transition-all duration-300 ring-1 ring-purple-300/10"
      >
        {/* Fun decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.15),rgba(0,0,0,0))]" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl" />
        
        <div className="relative p-5 sm:p-6 space-y-5">
          {/* Brand and Message Content */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-full pl-2.5 pr-3.5 py-1.5 border border-purple-500/20 shadow-sm">
                <MessageCircle className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-medium text-white">
                  Quietly
                </span>
              </div>
              <div className="text-xs text-purple-100/90 bg-white/5 rounded-full px-3.5 py-1.5 border border-purple-500/20 shadow-sm">
                ✨ Send messages at quietly.vercel.app
              </div>
            </div>
            <div className="flex justify-between items-start gap-4 bg-black/20 rounded-xl p-4 border border-purple-500/10">
              <div className="flex-grow min-w-0">
                <p className="text-base sm:text-lg text-white font-normal leading-relaxed break-all whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          </div>

          {/* Actions and Timestamp */}
          <div className="flex items-center justify-between border-t border-purple-500/20 pt-4">
            <time className="text-sm text-purple-100/70 bg-white/5 rounded-full px-3 py-1 border border-purple-500/20">
              {dayjs(message.createdAt).format('MMM D, YYYY [at] h:mm A')}
            </time>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="h-9 w-9 bg-white/5 text-purple-100 hover:bg-purple-500/20 hover:text-white hover:scale-105 active:scale-95 transition-all duration-150 border border-purple-500/20"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadCard}
                className="h-9 w-9 bg-white/5 text-purple-100 hover:bg-purple-500/20 hover:text-white hover:scale-105 active:scale-95 transition-all duration-150 border border-purple-500/20"
              >
                <Download className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 bg-white/5 text-purple-100 hover:bg-red-500/20 hover:text-red-100 hover:scale-105 active:scale-95 transition-all duration-150 border border-purple-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-to-br from-slate-950 to-purple-950/90 border border-purple-500/30 backdrop-blur-xl max-w-[90%] w-full sm:max-w-lg mx-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg text-white">Delete Message?</AlertDialogTitle>
                    <AlertDialogDescription className="text-purple-100/80 text-base">
                      This action cannot be undone. This message will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:space-x-2">
                    <AlertDialogCancel className="bg-white/5 text-purple-100 border-purple-500/20 hover:bg-purple-500/20 hover:text-white text-base font-normal">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteConfirm}
                      className="bg-red-500/10 text-red-100 hover:bg-red-500/20 border border-red-500/20 text-base font-normal"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}