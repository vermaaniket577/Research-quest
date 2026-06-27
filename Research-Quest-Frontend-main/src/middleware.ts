import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper to decode JWT payload in Edge runtime (Next.js middleware)
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode base64 to string in Edge runtime environment
    const rawPayload = atob(base64);
    return JSON.parse(rawPayload);
  } catch (e) {
    return null;
  }
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  const isAuthRoute = 
    path === '/login' || 
    path === '/register' || 
    path === '/forgot-password' || 
    path === '/reset-password';

  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    path.startsWith('/papers');

  const isAdminRoute = 
    path.startsWith('/dashboard/admin') || 
    path.startsWith('/admin');

  // If user has a token and tries to access auth pages, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user has no token and tries to access protected page, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-Based Access Control (RBAC) redirect in Next.js middleware
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = decodeJwt(token);
    if (!decoded || decoded.role !== 'admin') {
      // If not admin, redirect back to dashboard
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// Matching routes configured to exclude static assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};