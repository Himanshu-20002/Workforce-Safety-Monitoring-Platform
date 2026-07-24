import { type NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for Better Auth - session management and protected routes
 * Better Auth handles most of the authentication logic, we just redirect unauthenticated users
 */

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/api/auth'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if user has valid session cookie (set by Better Auth)
  const hasSessionCookie = request.cookies.has('better-auth.session_token');

  // Immediately bypass middleware for static assets (icons, images, public folder assets)
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Allow public landing page (root path)
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Allow public and auth API routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // Redirect authenticated users away from sign-in/sign-up
    if (hasSessionCookie && (pathname === '/sign-in' || pathname === '/sign-up')) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!hasSessionCookie) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/sign-in';
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
