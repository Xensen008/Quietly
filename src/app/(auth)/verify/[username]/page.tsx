'use client'
import { Form, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useRef, KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { motion } from 'framer-motion'
import Link from 'next/link'

const VerifyAccount = () => {
  const router = useRouter()
  const param = useParams<{ username: string }>()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [otp, setOtp] = React.useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
  })

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    form.setValue('code', newOtp.join(''))
    if (value !== '' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const pastedArray = pastedData.slice(0, 6).split('')
    const newOtp = [...otp]
    pastedArray.forEach((value, index) => { if (index < 6) newOtp[index] = value })
    setOtp(newOtp)
    form.setValue('code', newOtp.join(''))
    const lastFilledIndex = newOtp.findLastIndex(val => val !== '')
    if (lastFilledIndex < 5) inputRefs.current[lastFilledIndex + 1]?.focus()
  }

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code
      })
      toast({ title: 'Account Verified', description: response.data.message })
      router.replace('/sign-in')
    } catch (error) {
      console.error("Error in verification page", error)
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response?.status === 400) {
        toast({
          title: 'Error in verifying account',
          description: axiosError?.response?.data.message,
          variant: 'destructive'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EC', fontFamily: "'Space Mono', monospace", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '28px' }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '21px', color: '#1C1410', letterSpacing: '-0.3px' }}>
              Quietly
            </span>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212,103,79,0.10)', border: '1px solid rgba(212,103,79,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck style={{ width: '22px', height: '22px', color: '#D4674F' }} />
            </div>
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1410', margin: '0 0 8px', fontFamily: "'Space Mono', monospace" }}>
            Verify your account
          </h1>
          <p style={{ fontSize: '13px', color: '#8A7A74', margin: 0, lineHeight: 1.6 }}>
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #DDD5CE', borderRadius: '16px', padding: '32px 28px', boxShadow: '0 2px 20px rgba(28,20,16,0.07)' }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="code"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A8412D', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
                      Verification Code
                    </FormLabel>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px', marginBottom: '6px' }}>
                      {otp.map((digit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: index * 0.05 }}
                        >
                          <input
                            ref={(el) => { inputRefs.current[index] = el; return undefined; }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            style={{
                              width: '44px',
                              height: '52px',
                              textAlign: 'center',
                              fontSize: '18px',
                              fontWeight: 700,
                              fontFamily: "'Space Mono', monospace",
                              color: '#1C1410',
                              background: digit ? 'rgba(212,103,79,0.06)' : '#F5F0EC',
                              border: digit ? '1.5px solid rgba(212,103,79,0.50)' : '1.5px solid #DDD5CE',
                              borderRadius: '10px',
                              outline: 'none',
                              transition: 'border-color 0.15s, background 0.15s',
                              caretColor: '#D4674F',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#D4674F'; e.target.style.boxShadow = '0 0 0 3px rgba(212,103,79,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = digit ? 'rgba(212,103,79,0.50)' : '#DDD5CE'; e.target.style.boxShadow = 'none'; }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <FormMessage style={{ fontSize: '12px', color: '#C0504A', textAlign: 'center', marginTop: '8px', fontFamily: "'Space Mono', monospace" }} />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isSubmitting || otp.some(digit => !digit)}
                style={{
                  width: '100%',
                  height: '42px',
                  marginTop: '24px',
                  background: (isSubmitting || otp.some(d => !d)) ? '#E8DDD8' : '#D4674F',
                  color: (isSubmitting || otp.some(d => !d)) ? '#A8A09A' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: '0.04em',
                  cursor: (isSubmitting || otp.some(d => !d)) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isSubmitting ? (
                  <><Loader2 style={{ width: '15px', height: '15px' }} className="animate-spin" /> Verifying...</>
                ) : 'Verify Account'}
              </button>
            </form>
          </Form>

          <p style={{ fontSize: '12px', color: '#8A7A74', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
            Didn&apos;t receive the code?{' '}
            <button
              onClick={() => router.push('/sign-up')}
              style={{ background: 'none', border: 'none', padding: 0, fontSize: '12px', color: '#D4674F', fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono', monospace" }}
            >
              Try signing up again
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyAccount