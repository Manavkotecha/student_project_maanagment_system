import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (path.startsWith('/faculty') && token?.role?.toString().toLowerCase() !== 'faculty') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (path.startsWith('/student') && token?.role?.toString().toLowerCase() !== 'student') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/faculty/:path*',
    '/student/:path*',
  ],
};