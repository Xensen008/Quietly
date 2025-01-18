'use client'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/schemas/signupSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, MessageSquare, CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const [debouncedUsername] = useDebounceValue(username, 600)
  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      password: '',
      email: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get('/api/check-username-unique', {
            params: { username: debouncedUsername }
          });
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          if (axiosError.response?.status === 400) {
            setUsernameMessage(axiosError.response.data.message)
          }
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: 'Success',
        description: response?.data?.message
      })
      router.push(`/verify/${data.username}`)
    } catch (error: unknown) {
      console.error("Error in Signup page", error)
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 400) {
        toast({
          title: 'Error in Signup',
          description: axiosError?.response?.data.message,
          variant: 'destructive'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-purple-400/10 to-transparent pointer-events-none"></div>
      
      <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md"
        >
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-xl p-6 sm:p-8 space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/20">
                  <MessageSquare className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">
                Join Quietly
              </h1>
              <p className="text-sm sm:text-base text-gray-300">
                Sign up to start your anonymous journey
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Username</FormLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 pr-10"
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                        />
                        {isCheckingUsername && (
                          <div className="absolute right-3 top-2.5">
                            <Loader2 className="w-5 h-5 animate-spin text-purple-300" />
                          </div>
                        )}
                        {!isCheckingUsername && usernameMessage && (
                          <div className="absolute right-3 top-2.5">
                            {usernameMessage === 'Username is available' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                      {!isCheckingUsername && usernameMessage && (
                        <p className={`text-sm mt-1 ${
                          usernameMessage === 'Username is available'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {usernameMessage}
                        </p>
                      )}
                      <FormMessage className="text-pink-200" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Email</FormLabel>
                      <Input 
                        {...field} 
                        name="email"
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                      />
                      <p className="text-sm text-gray-400">We will send you a verification code</p>
                      <FormMessage className="text-pink-200" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Password</FormLabel>
                      <Input 
                        type="password" 
                        {...field} 
                        name="password"
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                      />
                      <FormMessage className="text-pink-200" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 hover:from-purple-500/40 hover:via-pink-500/40 hover:to-purple-500/40 text-white border border-white/20 hover:border-white/30 transition-all duration-300 text-sm shadow-md h-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="text-center pt-2">
              <p className="text-gray-300 text-sm">
                Already a member?{' '}
                <Link 
                  href="/sign-in" 
                  className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// export default page