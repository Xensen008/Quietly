'use client'
import { MessageCard } from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/models/User.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw, Link2, Copy, MessageSquare } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] =useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMessages, setTotalMessages] = useState(0)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string) =>{
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register , watch, setValue} = form;
  const acceptMessage = watch('acceptMessage')

  const fetchAcceptMessage = useCallback(async ()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message')
      setValue('acceptMessage', response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||"Failed to fetch accept message status",
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])

  const fetchMessages = useCallback( async(refresh: boolean = false )=>{
    setIsLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>(`/api/get-messages?page=${currentPage}&limit=9`, {
        withCredentials: true
      })
      setMessages(response?.data?.messages || [])
      setCurrentPage(response.data.currentPage ?? 1)
      setTotalPages(response.data.totalPages ?? 1)
      setTotalMessages(response.data.totalMessages ?? 0)
      if(refresh){
        toast({
          title: 'refreshed',
          description: 'Messages refreshed'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error in getting message',
        description: axiosError.response?.data.message ||"Failed to fetch messages",
        variant: 'destructive'
      })
    } finally {{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
    }
  }, [currentPage, setIsLoading, setMessages, toast])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue ,fetchAcceptMessage, fetchMessages, currentPage])


  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessages: !acceptMessage
      })
      setValue('acceptMessage', !acceptMessage)
      toast({
        title: "Updated",
        description: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||"Failed to update accept message status",
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  if(!session || !session.user){
    return (
      <div style={{ minHeight: '100vh', background: '#F5F0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDD5CE',
            borderRadius: '16px',
            boxShadow: '0 2px 20px rgba(28,20,16,0.07)',
            padding: '48px 40px',
            textAlign: 'center',
            maxWidth: '380px',
            width: '100%',
            margin: '0 20px',
          }}
        >
          <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A8412D', fontWeight: 700, margin: '0 0 16px' }}>
            Access Required
          </p>
          <h2 style={{ fontSize: '18px', color: '#1C1410', fontWeight: 700, margin: '0 0 10px' }}>
            Sign in to continue
          </h2>
          <p style={{ fontSize: '13px', color: '#8A7A74', margin: '0 0 28px', lineHeight: 1.6 }}>
            Please sign in to access your dashboard
          </p>
          <Link href="/sign-in" style={{ textDecoration: 'none' }}>
            <Button
              style={{
                width: '100%',
                height: '44px',
                background: '#D4674F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              Sign In →
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(profileUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = profileUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          textArea.remove();
        } catch (error) {
          console.error('Failed to copy text:', error);
          throw new Error('Copy failed');
        }
      }
      toast({
        title: 'URL Copied!',
        description: 'Profile URL has been copied to clipboard.',
      });
    } catch (_) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy URL to clipboard.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EC', fontFamily: "'Space Mono', monospace" }}>
      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #E8DDD8; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: #D4674F; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #C05A42; }
        .msg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 900px) { .msg-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .msg-grid { grid-template-columns: 1fr; } }
      `}</style>

      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E8DDD8',
        padding: '0 20px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '21px', color: '#1C1410', letterSpacing: '-0.3px' }}>
            Quietly
          </span>
        </Link>
        <span style={{ fontSize: '11px', color: '#8A7A74', letterSpacing: '0.06em' }}>
          @{username}
        </span>
      </nav>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 20px' }}>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          style={{ marginBottom: '32px' }}
        >
          <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A8412D', fontWeight: 700, margin: '0 0 10px' }}>
            Your Dashboard
          </p>
          <h1 style={{ fontSize: '18px', color: '#1C1410', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            Welcome back, <span style={{ color: '#D4674F' }}>@{username}</span>
          </h1>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #DDD5CE',
                borderRadius: '16px',
                boxShadow: '0 2px 20px rgba(28,20,16,0.07)',
                padding: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link2 style={{ width: '15px', height: '15px', color: '#D4674F' }} />
                  </div>
                  <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
                    Share Your Link
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    padding: '10px 14px',
                    background: '#FAF5F2',
                    border: '1px solid #E8DDD8',
                    borderRadius: '8px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '12px',
                    color: '#5A4A44',
                    wordBreak: 'break-all',
                    lineHeight: 1.5,
                  }}>
                    {profileUrl}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    style={{
                      width: '100%',
                      height: '42px',
                      background: '#D4674F',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                    }}
                  >
                    <Copy style={{ width: '13px', height: '13px' }} />
                    Copy Link
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #DDD5CE',
                borderRadius: '16px',
                boxShadow: '0 2px 20px rgba(28,20,16,0.07)',
                padding: '24px',
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare style={{ width: '15px', height: '15px', color: '#D4674F' }} />
                  </div>
                  <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
                    Message Settings
                  </h2>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', color: '#1C1410', fontWeight: 500 }}>
                      Accept Messages
                    </label>
                    <Switch
                      {...register('acceptMessages')}
                      checked={acceptMessage}
                      onCheckedChange={handleSwitchChange}
                      disabled={isSwitchLoading}
                      className="data-[state=checked]:bg-[#D4674F] data-[state=unchecked]:bg-[#DDD5CE]"
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: '#8A7A74', margin: 0 }}>
                    {acceptMessage
                      ? 'Your feedback link is active'
                      : 'Your feedback link is disabled'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #DDD5CE',
              borderRadius: '16px',
              boxShadow: '0 2px 20px rgba(28,20,16,0.07)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              height: '860px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare style={{ width: '15px', height: '15px', color: '#D4674F' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
                      Messages
                    </h2>
                    {totalMessages > 0 && (
                      <p style={{ fontSize: '11px', color: '#8A7A74', margin: '2px 0 0' }}>
                        {totalMessages} message{totalMessages !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  {totalMessages > 0 && (
                    <span style={{
                      background: '#FFF0EC',
                      border: '1px solid #EDD8D0',
                      borderRadius: '999px',
                      padding: '2px 10px',
                      fontSize: '11px',
                      color: '#D4674F',
                      fontWeight: 700,
                    }}>
                      {totalMessages}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                  }}
                  style={{
                    width: '34px',
                    height: '34px',
                    background: '#FFF0EC',
                    border: '1px solid #EDD8D0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#D4674F',
                    flexShrink: 0,
                  }}
                >
                  {isLoading ? (
                    <Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" />
                  ) : (
                    <RefreshCcw style={{ width: '14px', height: '14px' }} />
                  )}
                </Button>
              </div>

              <div style={{ overflowY: 'auto', flex: 1 }}>
                {messages.length > 0 ? (
                  <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    className="msg-grid"
                    style={{}}
                  >
                    {messages.map((message) => (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ width: '100%', minWidth: 0 }}
                      >
                        <MessageCard
                          message={message}
                          onMessageDelete={handleDeleteMessage}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', textAlign: 'center' }}
                  >
                    <div style={{ padding: '14px', borderRadius: '12px', background: '#FFF0EC', marginBottom: '14px', display: 'inline-flex' }}>
                      <MessageSquare style={{ width: '22px', height: '22px', color: '#D4674F' }} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1410', margin: '0 0 6px' }}>
                      No messages yet
                    </h3>
                    <p style={{ fontSize: '13px', color: '#8A7A74', margin: 0, lineHeight: 1.6, maxWidth: '300px' }}>
                      Share your link to receive anonymous feedback
                    </p>
                  </motion.div>
                )}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', paddingTop: '20px', borderTop: '1px solid #F0E8E4', marginTop: '16px' }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      height: '34px',
                      padding: '0 14px',
                      background: currentPage === 1 ? '#F5F0EC' : '#D4674F',
                      color: currentPage === 1 ? '#8A7A74' : '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontSize: '12px', color: '#5A4A44', fontFamily: "'Space Mono', monospace" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      height: '34px',
                      padding: '0 14px',
                      background: currentPage === totalPages ? '#F5F0EC' : '#D4674F',
                      color: currentPage === totalPages ? '#8A7A74' : '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
