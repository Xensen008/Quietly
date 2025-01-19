'use client'
import { MessageCard } from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string) =>{
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session, status } = useSession()
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
      const response = await axios.get<ApiResponse>('/api/get-messages', {
        withCredentials: true
      })
      setMessages(response?.data?.messages || [])
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
  }, [setIsLoading, setMessages, toast])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue ,fetchAcceptMessage, fetchMessages])


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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-300 mb-6">
            Please sign in to access your dashboard
          </p>
          <Link href="/sign-in">
            <Button 
              className="relative overflow-hidden group bg-white/10 hover:bg-white/15 text-white border-0 transition-all duration-300 text-base px-8 py-6 h-auto"
            >
              <span className="relative z-10 font-medium">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
              <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-white/20 transition-colors duration-300"></div>
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
        // For HTTPS or localhost
        await navigator.clipboard.writeText(profileUrl);
      } else {
        // Fallback for HTTP
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.3);
        }
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-purple-400/10 to-transparent pointer-events-none"></div>
      
      <div className="min-h-screen flex items-center justify-center py-16 sm:py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full relative px-3 sm:px-6 lg:px-8 max-w-[90rem] mx-auto"
        >
          {/* Header Section */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-6 sm:mb-8 lg:mb-10"
          >
            <div className="max-w-2xl mx-auto lg:mx-0">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white mb-2">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">{username}</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-200">
                Manage your messages and settings here
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:gap-6">
            {/* First Row - Profile Link and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 xl:gap-6">
              {/* Profile Link Card */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div className="h-full p-3 sm:p-4 xl:p-6 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 rounded-md bg-purple-500/20">
                      <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
                    </div>
                    <h2 className="text-sm sm:text-base font-medium text-white">Share Your Link</h2>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="p-2 sm:p-3 bg-black/20 rounded-md font-mono text-[11px] sm:text-sm text-purple-100 break-all border border-white/20">
                      {profileUrl}
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      className="w-full h-8 sm:h-10 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 hover:from-purple-500/40 hover:via-pink-500/40 hover:to-purple-500/40 text-white border border-white/20 hover:border-white/30 transition-all duration-300 text-xs sm:text-sm shadow-md"
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Settings Card */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div className="h-full p-3 sm:p-4 xl:p-6 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 rounded-md bg-purple-500/20">
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
                    </div>
                    <h2 className="text-sm sm:text-base font-medium text-white">Message Settings</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className="text-xs sm:text-sm text-gray-100">Accept Messages</label>
                        <Switch
                          {...register('acceptMessages')}
                          checked={acceptMessage}
                          onCheckedChange={handleSwitchChange}
                          disabled={isSwitchLoading}
                          className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-white/20 scale-90 sm:scale-100"
                        />
                      </div>
                      <p className="text-[11px] sm:text-sm text-gray-300">
                        {acceptMessage 
                          ? 'Your feedback link is active' 
                          : 'Your feedback link is disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Second Row - Messages */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="h-full"
            >
              <div className="h-[calc(100vh-12rem)] p-3 sm:p-4 xl:p-6 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-md bg-purple-500/20">
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-medium text-white">Messages</h2>
                      {messages.length > 0 && (
                        <p className="text-[11px] sm:text-sm text-gray-300 mt-0.5">
                          {messages.length} message{messages.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      fetchMessages(true);
                    }}
                    className="p-1.5 sm:p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </div>

                <div className="h-[calc(100%-4rem)] overflow-y-auto pr-2 space-y-0 sm:space-y-0 scrollbar-thin scrollbar-thumb-purple-300/20 hover:scrollbar-thumb-purple-300/30 scrollbar-track-white/5 hover:scrollbar-track-white/10 transition-colors">
                  {messages.length > 0 ? (
                    <motion.div 
                      variants={fadeIn}
                      initial="initial"
                      animate="animate"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full"
                    >
                      {messages.map((message) => (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="w-full min-w-0"
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
                      className="flex flex-col items-center justify-center h-full py-6 sm:py-8 xl:py-12 px-4"
                    >
                      <div className="p-2 sm:p-3 rounded-md bg-purple-500/20 mb-3 sm:mb-4">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-purple-200" />
                      </div>
                      <h3 className="text-sm sm:text-base font-medium text-white mb-1">No messages yet</h3>
                      <p className="text-[11px] sm:text-sm text-gray-300 text-center max-w-sm">
                        Share your link to receive anonymous feedback
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


// export default page