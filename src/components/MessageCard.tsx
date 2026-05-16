'use client'

import React, { useRef, useCallback, useState, useEffect } from 'react';
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
  const [hovered, setHovered] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);
  const [downloadHovered, setDownloadHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight + 1);
    }
  }, [message.content]);

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
    >
      <style>{`
        [data-message-card] .blob { display: none; }
        [data-message-card].screenshot-mode .blob { display: block; }
      `}</style>
      <div
        ref={messageCardRef}
        data-message-card
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'linear-gradient(145deg, #FDF6F2 0%, #F8EDE7 50%, #F5E4DC 100%)',
          border: hovered ? '1.5px solid rgba(212,103,79,0.55)' : '1.5px solid rgba(212,103,79,0.25)',
          borderRadius: '14px',
          boxShadow: hovered
            ? '0 8px 28px rgba(212,103,79,0.20)'
            : '0 3px 14px rgba(212,103,79,0.10)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          padding: '24px',
          fontFamily: "'Space Mono', monospace",
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '180px',
        }}
      >
        <div
          className="blob"
          style={{
            top: '-30px',
            right: '-20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: '#D4674F',
            filter: 'blur(50px)',
            opacity: 0.22,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        />
        <div
          className="blob"
          style={{
            bottom: '-20px',
            left: '-10px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#F0A882',
            filter: 'blur(35px)',
            opacity: 0.15,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '16px',
            fontSize: '56px',
            lineHeight: 1,
            color: 'rgba(212,103,79,0.40)',
            fontFamily: "'DM Serif Display', serif",
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {'\u201C'}
        </div>
        <span
          style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#A8412D',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
          }}
        >
          <span style={{ color: '#D4674F', marginRight: '4px' }}>·</span>Quietly
        </span>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p
            ref={textRef}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.75,
              color: '#1C1410',
              fontFamily: "'Space Mono', monospace",
              margin: 0,
              wordBreak: 'break-word',
              overflow: expanded ? 'visible' : 'hidden',
              display: expanded ? 'block' : '-webkit-box',
              WebkitLineClamp: expanded ? undefined : 2,
              WebkitBoxOrient: expanded ? undefined : 'vertical',
            } as React.CSSProperties}
          >
            {message.content}
          </p>

          {isOverflowing && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '11px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                color: '#D4674F',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                alignSelf: 'flex-start',
              }}
            >
              {expanded ? 'see less ↑' : 'see more ↓'}
            </button>
          )}
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(212,103,79,0.15)',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <time
            style={{
              fontSize: '11px',
              color: '#C47A62',
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {dayjs(message.createdAt).format('MMM D, YYYY [at] h:mm A')}
          </time>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={copyToClipboard}
              onMouseEnter={() => setCopyHovered(true)}
              onMouseLeave={() => setCopyHovered(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: copyHovered ? '#D4674F' : 'rgba(212,103,79,0.10)',
                color: copyHovered ? '#FFFFFF' : '#8A7A74',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                flexShrink: 0,
              }}
            >
              <Copy style={{ width: '14px', height: '14px' }} />
            </button>

            <button
              onClick={downloadCard}
              onMouseEnter={() => setDownloadHovered(true)}
              onMouseLeave={() => setDownloadHovered(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: downloadHovered ? '#D4674F' : 'rgba(212,103,79,0.10)',
                color: downloadHovered ? '#FFFFFF' : '#8A7A74',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                flexShrink: 0,
              }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  onMouseEnter={() => setDeleteHovered(true)}
                  onMouseLeave={() => setDeleteHovered(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: deleteHovered ? '#FFF0EE' : 'rgba(212,103,79,0.10)',
                    color: deleteHovered ? '#C0504A' : '#8A7A74',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8DDD8',
                  borderRadius: '14px',
                  fontFamily: "'Space Mono', monospace",
                  maxWidth: '420px',
                  width: '90%',
                }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle
                    style={{
                      fontSize: '16px',
                      color: '#1C1410',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                    }}
                  >
                    Delete Message?
                  </AlertDialogTitle>
                  <AlertDialogDescription
                    style={{
                      fontSize: '13px',
                      color: '#8A7A74',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    This action cannot be undone. This message will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    style={{
                      backgroundColor: '#F5F0EC',
                      color: '#1C1410',
                      border: '1px solid #DDD5CE',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '13px',
                      borderRadius: '8px',
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    style={{
                      backgroundColor: '#FFF0EE',
                      color: '#C0504A',
                      border: '1px solid #F0C8C4',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '13px',
                      borderRadius: '8px',
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
