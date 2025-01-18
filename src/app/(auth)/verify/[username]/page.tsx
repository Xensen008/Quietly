'use client'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

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
    if (value.length > 1) {
      value = value[0]
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Update form value
    form.setValue('code', newOtp.join(''))

    // Auto focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const pastedArray = pastedData.slice(0, 6).split('')
    
    const newOtp = [...otp]
    pastedArray.forEach((value, index) => {
      if (index < 6) {
        newOtp[index] = value
      }
    })
    setOtp(newOtp)
    form.setValue('code', newOtp.join(''))

    // Focus last filled input or first empty input
    const lastFilledIndex = newOtp.findLastIndex(val => val !== '')
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus()
    }
  }

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code
      })

      toast({
        title: 'Account Verified',
        description: response.data.message,
      })

      router.replace('/sign-in')
    } catch (error) {
      console.error("Error in verification page", error)
      const axiosError = error as AxiosError<ApiResponse>;
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
                  <ShieldCheck className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">
                Verify Your Account
              </h1>
              <p className="text-sm sm:text-base text-gray-300">
                Enter the verification code sent to your email
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Verification Code</FormLabel>
                      <div className="flex gap-2 sm:gap-3 justify-center mt-2">
                        {otp.map((digit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Input
                              ref={(el) => {
                                inputRefs.current[index] = el;
                                return undefined;
                              }}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              onPaste={handlePaste}
                              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold bg-black/20 border-white/20 text-white focus:border-purple-500/50 focus:ring-purple-500/50 transition-all duration-200"
                            />
                          </motion.div>
                        ))}
                      </div>
                      <FormMessage className="text-pink-200 text-center mt-2" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 hover:from-purple-500/40 hover:via-pink-500/40 hover:to-purple-500/40 text-white border border-white/20 hover:border-white/30 transition-all duration-300 text-sm shadow-md h-10"
                  disabled={isSubmitting || otp.some(digit => !digit)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Account'
                  )}
                </Button>
              </form>
            </Form>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Didn't receive the code?{' '}
                <button 
                  onClick={() => router.push('/sign-up')}
                  className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
                >
                  Try signing up again
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default VerifyAccount