import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - assets (static files)
     * - logo.jpg, favicon.ico, etc. (static files)
     */
    '/((?!api|assets|dist|logo.jpg|favicon.ico|vite.svg).*)',
  ],
};

export function middleware(request) {
  const url = request.nextUrl.clone();
  // Force the request to go to our SEO server
  url.pathname = '/api/server';
  return NextResponse.rewrite(url);
}
