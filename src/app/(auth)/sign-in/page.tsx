'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { signinSchema } from '@/schemas/signinSchema'
import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { password: '', identifier: '' },
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Authentication Failed',
          description: result.error,
          variant: 'destructive',
          duration: 3000,
        })
        setIsSubmitting(false)
        return
      }

      if (result?.ok) {
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in',
          className: 'bg-green-500 border-green-600',
          duration: 3000,
        })
        router.replace('/dashboard')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAFAF8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '26px',
                color: '#1A1A1A',
                letterSpacing: '-0.5px',
              }}
            >
              Quietly
            </span>
          </Link>
          <p style={{ fontSize: '12px', color: '#9A8F8A', marginTop: '6px' }}>
            anonymous feedback, honestly
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E0DC',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 16px rgba(26,26,26,0.06)',
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#A8412D',
                marginBottom: '8px',
              }}
            >
              Welcome back
            </span>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '22px',
                color: '#1A1A1A',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Sign in to Quietly
            </h1>
            <p style={{ fontSize: '12px', color: '#9A8F8A', marginTop: '6px' }}>
              Continue your anonymous journey
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#6B6460',
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      Email or Username
                    </FormLabel>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      name="identifier"
                      style={{
                        background: '#FAFAF8',
                        border: '1px solid #E8E0DC',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#1A1A1A',
                        fontFamily: "'Space Mono', monospace",
                        height: '40px',
                      }}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#D4674F]"
                    />
                    <FormMessage style={{ fontSize: '11px', color: '#C0504A', fontFamily: "'Space Mono', monospace" }} />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#6B6460',
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      Password
                    </FormLabel>
                    <Input
                      type="password"
                      {...field}
                      name="password"
                      style={{
                        background: '#FAFAF8',
                        border: '1px solid #E8E0DC',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#1A1A1A',
                        fontFamily: "'Space Mono', monospace",
                        height: '40px',
                      }}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#D4674F]"
                    />
                    <FormMessage style={{ fontSize: '11px', color: '#C0504A', fontFamily: "'Space Mono', monospace" }} />
                  </FormItem>
                )}
              />

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: '4px' }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    height: '42px',
                    background: isSubmitting ? '#E8A898' : '#D4674F',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    fontFamily: "'Space Mono', monospace",
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '24px 0 20px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#E8E0DC' }} />
            <span style={{ fontSize: '10px', color: '#B8AEA8', letterSpacing: '0.08em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#E8E0DC' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9A8F8A' }}>
            New here?{' '}
            <Link
              href="/sign-up"
              style={{
                color: '#D4674F',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Create an account
            </Link>
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            textAlign: 'center',
            fontSize: '11px',
            color: '#B8AEA8',
            marginTop: '20px',
          }}
        >
          Your messages are always anonymous and private.
        </motion.p>
      </motion.div>
    </div>
  )
}
