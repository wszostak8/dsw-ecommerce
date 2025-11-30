import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken, isAdmin } from '@/lib/auth';
import {
    isUserPath,
    isAdminPath,
    isAuthPath,
    adminDashboard
} from '@/lib/routes';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('accessToken')?.value;

    const payload = await verifyAuthToken(token);

    // --- 1) Auth pages (login/register) ---
    if (isAuthPath(pathname) && payload) {
        return NextResponse.redirect(
            new URL(isAdmin(payload) ? adminDashboard : '/account', request.url)
        );
    }

    // --- 2) Admin section ---
    if (isAdminPath(pathname)) {

        // niezalogowany → login
        if (!payload) {
            const url = new URL('/login', request.url);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }

        // zalogowany, ale nie admin → account
        if (!isAdmin(payload)) {
            return NextResponse.redirect(new URL('/account', request.url));
        }
    }

    // --- 3) User pages ---
    if (isUserPath(pathname)) {

        if (payload && isAdmin(payload)) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        if (!payload) {
            const url = new URL('/login', request.url);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    // --- 4) /admin root redirect ---
    if (pathname === '/admin' && payload && isAdmin(payload)) {
        return NextResponse.redirect(new URL(adminDashboard, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};