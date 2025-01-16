import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.SECRET
  });
  
  const url = request.nextUrl;

  // Protected routes require authentication
  if (url.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Public routes - no redirection needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*'
  ],
};