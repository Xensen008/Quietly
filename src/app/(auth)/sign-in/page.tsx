'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, MessageSquare } from 'lucide-react'
import { signinSchema } from '@/schemas/signinSchema'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      password: '',
      identifier: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Authentication Failed",
          description: result.error,
          variant: "destructive",
          duration: 3000,
        });
        setIsSubmitting(false);
        return;
      }

      if (result?.ok) {
        toast({
          title: "Welcome back! 👋",
          description: "Successfully logged in",
          className: "bg-green-500 border-green-600",
          duration: 3000,
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base text-gray-300">
                Sign in to continue your anonymous journey
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Email/Username</FormLabel>
                      <Input 
                        placeholder="Enter your username or email" 
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                        {...field} 
                        name="identifier" 
                      />
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
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                        {...field} 
                        name="password" 
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
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="text-center pt-2">
              <p className="text-gray-300 text-sm">
                New here?{' '}
                <Link 
                  href="/sign-up" 
                  className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

