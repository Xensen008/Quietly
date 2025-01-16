'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

const Navbar = () => {
    const { data: session, status } = useSession()

    const handleSignOut = async () => {
        await signOut({ 
            callbackUrl: '/',
            redirect: true
        })
    }
    console.log(session)
    if (status === "loading") {
        return (
            <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
                <div className="flex justify-center">
                    <Loader2 className="animate-spin"/>
                </div>
            </nav>
        )
    }

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
                    Quietly
                </Link>
                {status === "authenticated" && session?.user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm">
                            Welcome, {session.user.username || session.user.email}
                        </span>
                        <Link href="/dashboard">
                            <Button>Dashboard</Button>
                        </Link>
                        <Button 
                            onClick={handleSignOut} 
                            variant="outline"
                            className="bg-slate-100 text-black"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/sign-in">
                        <Button 
                            variant="outline"
                            className="bg-slate-100 text-black"
                        >
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar