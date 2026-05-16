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

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/', redirect: true })
    }

    if (status === 'loading') {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#FAFAF8' }}>
                <div className="container mx-auto px-6 h-14 flex items-center justify-center">
                    <Loader2 className="animate-spin w-4 h-4" style={{ color: '#D4674F' }} />
                </div>
            </nav>
        )
    }

    return (
        <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
            style={{
                background: isScrolled ? 'rgba(250, 250, 248, 0.95)' : '#FAFAF8',
                borderBottom: isScrolled ? '1px solid #E8E6E1' : '1px solid transparent',
                backdropFilter: isScrolled ? 'blur(8px)' : 'none',
                fontFamily: "'Space Mono', monospace",
            }}
        >
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-14">
                    <Link href="/" className="flex items-center gap-2">
                        <MessageCircle style={{ width: 18, height: 18, color: '#D4674F' }} />
                        <span
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#1A1A1A',
                                fontFamily: "'DM Serif Display', serif",
                                letterSpacing: '-0.2px',
                            }}
                        >
                            Quietly
                        </span>
                    </Link>

                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-md"
                            style={{ color: '#4B5563' }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X style={{ width: 16, height: 16 }} /> : <Menu style={{ width: 16, height: 16 }} />}
                        </Button>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {status === 'authenticated' && session?.user ? (
                            <>
                                <div
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md"
                                    style={{ background: '#FAEDEA' }}
                                >
                                    <User style={{ width: 13, height: 13, color: '#D4674F' }} />
                                    <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 500 }}>
                                        {session.user.username || session.user.email}
                                    </span>
                                </div>
                                <Link href="/dashboard">
                                    <Button
                                        style={{
                                            fontSize: '13px',
                                            height: '32px',
                                            padding: '0 14px',
                                            background: '#1A1A1A',
                                            color: '#FAFAF8',
                                            border: 'none',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleSignOut}
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 rounded-md"
                                    style={{ color: '#9CA3AF' }}
                                >
                                    <LogOut style={{ width: 14, height: 14 }} />
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button
                                    style={{
                                        fontSize: '13px',
                                        height: '32px',
                                        padding: '0 16px',
                                        background: '#1A1A1A',
                                        color: '#FAFAF8',
                                        border: 'none',
                                        borderRadius: '6px',
                                    }}
                                >
                                    Get started
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div
                                className="flex flex-col gap-2 pb-4 pt-2"
                                style={{ borderTop: '1px solid #E8E6E1' }}
                            >
                                {status === 'authenticated' && session?.user ? (
                                    <>
                                        <div
                                            className="flex items-center gap-2 px-3 py-2 rounded-md"
                                            style={{ background: '#FAEDEA' }}
                                        >
                                            <User style={{ width: 13, height: 13, color: '#D4674F' }} />
                                            <span style={{ fontSize: '13px', color: '#1A1A1A' }}>
                                                {session.user.username || session.user.email}
                                            </span>
                                        </div>
                                        <Link href="/dashboard" className="w-full">
                                            <Button
                                                className="w-full"
                                                style={{
                                                    fontSize: '13px',
                                                    background: '#1A1A1A',
                                                    color: '#FAFAF8',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                }}
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={handleSignOut}
                                            variant="ghost"
                                            className="w-full"
                                            style={{ fontSize: '13px', color: '#6B7280' }}
                                        >
                                            Sign out
                                        </Button>
                                    </>
                                ) : (
                                    <Link href="/sign-in" className="w-full">
                                        <Button
                                            className="w-full"
                                            style={{
                                                fontSize: '13px',
                                                background: '#1A1A1A',
                                                color: '#FAFAF8',
                                                border: 'none',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            Get started
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}

export default Navbar