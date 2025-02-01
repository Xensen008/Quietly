'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Loader2, MessageCircle, User, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const { data: session, status } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            // Calculate scroll percentage for the first 60px (reduced from 100px for faster response)
            const newScrollProgress = Math.min(window.scrollY / 60, 1)
            setScrollProgress(newScrollProgress)
            setIsScrolled(window.scrollY > 10)  // Reduced threshold for faster response
        }

        window.addEventListener('scroll', handleScroll, { passive: true })  // Added passive for better performance
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSignOut = async () => {
        await signOut({ 
            callbackUrl: '/',
            redirect: true
        })
    }

    if (status === "loading") {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                <div className="relative">
                    <div className="container mx-auto py-6">
                        <div className="flex justify-center">
                            <Loader2 className="animate-spin text-purple-200 w-6 h-6" />
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
            style={{
                background: `rgba(15, 23, 42, ${scrollProgress * 0.95})`,
                backdropFilter: `blur(${scrollProgress * 8}px)`,
                boxShadow: `0 ${scrollProgress * 8}px ${scrollProgress * 12}px -${scrollProgress * 4}px rgba(0, 0, 0, ${scrollProgress * 0.2})`
            }}
        >
            <div 
                className="absolute inset-0 transition-opacity duration-200"
                style={{
                    opacity: 1 - scrollProgress,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
                }}
            ></div>
            <div className="relative">
                <div className="container mx-auto py-4 md:py-5">
                    <div className="flex justify-between items-center px-4 h-[40px] md:h-[48px]">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="flex items-center gap-2 md:gap-3"
                        >
                            <MessageCircle className="w-7 h-7 md:w-9 md:h-9 text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-pink-200 to-indigo-200 stroke-[1.5]" />
                            <Link 
                                href="/" 
                                className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-100 via-pink-200 to-indigo-200"
                            >
                                Quietly
                            </Link>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative group p-2 hover:bg-white/5 rounded-full transition-all duration-300"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6 text-white/90" />
                                ) : (
                                    <Menu className="w-6 h-6 text-white/90" />
                                )}
                            </Button>
                        </div>

                        {/* Desktop Menu */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="hidden md:flex items-center gap-8"
                        >
                            {status === "authenticated" && session?.user ? (
                                <>
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 px-5 py-2.5 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/10">
                                        <User className="w-4 h-4 text-purple-200" />
                                        <span className="text-base font-medium text-white">
                                            {session.user.username || session.user.email}
                                        </span>
                                    </div>
                                    <Link href="/dashboard">
                                        <Button 
                                            className="relative overflow-hidden group bg-white/10 hover:bg-white/15 text-white border-0 backdrop-blur-sm transition-all duration-300 text-base px-6 shadow-lg shadow-black/10"
                                        >
                                            <span className="relative z-10">Dashboard</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/30 to-pink-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Button>
                                    </Link>
                                    <Button 
                                        onClick={handleSignOut} 
                                        variant="ghost"
                                        className="relative group p-2.5 hover:bg-white/5 rounded-full transition-all duration-300"
                                    >
                                        <LogOut className="w-5 h-5 text-white/80 group-hover:text-purple-200 transition-colors duration-300" />
                                    </Button>
                                </>
                            ) : (
                                <Link href="/sign-in">
                                    <Button 
                                        className="relative overflow-hidden group text-white border-0 transition-all duration-300 text-base px-8 py-6 h-auto bg-white/10 hover:bg-white/15 backdrop-blur-sm"
                                    >
                                        <span className="relative z-10 font-medium tracking-wide">
                                            Get Started
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                                        <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-white/20 transition-colors duration-300"></div>
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="md:hidden px-4 pt-4 pb-6"
                            >
                                <div className="bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl p-4 flex flex-col gap-4 border border-white/10">
                                    {status === "authenticated" && session?.user ? (
                                        <>
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl">
                                                <User className="w-4 h-4 text-purple-200" />
                                                <span className="text-sm font-medium text-white">
                                                    {session.user.username || session.user.email}
                                                </span>
                                            </div>
                                            <Link href="/dashboard" className="w-full">
                                                <Button 
                                                    className="w-full relative bg-white/10 hover:bg-white/15 text-white border-0 transition-all duration-300"
                                                >
                                                    Dashboard
                                                </Button>
                                            </Link>
                                            <Button 
                                                onClick={handleSignOut} 
                                                variant="ghost"
                                                className="w-full text-white/80 hover:text-white hover:bg-white/5"
                                            >
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <Link href="/sign-in" className="w-full">
                                            <Button 
                                                className="w-full relative bg-white/10 hover:bg-white/15 text-white border-0 transition-all duration-300 py-6"
                                            >
                                                <span className="relative z-10 font-medium">Get Started</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                                                <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-white/20 transition-colors duration-300"></div>
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar   