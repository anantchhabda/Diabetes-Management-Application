import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Base64URL → Base64 + padding
function b64urlToB64(s: string) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (b64.length % 4)) % 4;
  return b64 + '='.repeat(padLen);
}

function parseJwt(token?: string | null): { exp?: number; role?: string } | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadB64 = b64urlToB64(parts[1]);
    // Edge runtime has atob
    const json = atob(payloadB64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isJwtValid(token?: string | null): { valid: boolean; role?: string } {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') return { valid: false };
  const valid = Date.now() < payload.exp * 1000;
  return { valid, role: payload.role as string | undefined };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only intercept your entry routes
  if (pathname === '/' || pathname === '/welcome') {
    const token =
      req.cookies.get('authToken')?.value ??
      req.cookies.get('token')?.value ?? // optional fallback
      null;

    const { valid, role } = isJwtValid(token);

    if (valid) {
      const url = req.nextUrl.clone();
      if (role === 'Doctor') url.pathname = '/doctor-homepage';
      else if (role === 'Family Member') url.pathname = '/family-homepage';
      else url.pathname = '/patient-homepage'; // default: Patient
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/welcome'],
};
