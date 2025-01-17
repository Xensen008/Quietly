'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Loader2, MessageCircle, User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
    const { data: session, status } = useSession()

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
                    <div className="container mx-auto py-8">
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
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
            <div className="relative">
                <div className="container mx-auto py-8">
                    <div className="flex justify-between items-center px-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="flex items-center gap-3"
                        >
                            <MessageCircle className="w-9 h-9 text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-pink-200 to-indigo-200 stroke-[1.5]" />
                            <Link 
                                href="/" 
                                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-100 via-pink-200 to-indigo-200"
                            >
                                Quietly
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="flex items-center gap-8"
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
                                        className="relative overflow-hidden group bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white border-0 transition-all duration-300 text-base px-8 py-6 h-auto shadow-xl shadow-indigo-500/20 hover:scale-[1.02]"
                                    >
                                        <span className="relative z-10 font-medium tracking-wide">Get Started</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar