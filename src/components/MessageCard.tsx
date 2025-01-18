'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
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

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-black/50 transition-all duration-300">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Message Content */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow min-w-0">
              <p className="text-base sm:text-lg text-white font-normal leading-relaxed break-all whitespace-pre-wrap line-clamp-[12] hover:line-clamp-none transition-all duration-300">
                {message.content}
              </p>
            </div>
            <div className="flex-shrink-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 h-8 w-8 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-300 hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-black/95 border border-white/10 backdrop-blur-xl max-w-[90%] w-full sm:max-w-lg mx-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg text-white">Delete Message?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-200 text-base">
                      This action cannot be undone. This message will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:space-x-2">
                    <AlertDialogCancel className="bg-white/5 text-white border-white/10 text-base font-normal">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteConfirm}
                      className="bg-red-500/10 text-red-200 hover:bg-red-500/20 border border-red-500/20 text-base font-normal"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <time className="text-sm text-gray-300">
              {dayjs(message.createdAt).format('MMM D, YYYY [at] h:mm A')}
            </time>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}