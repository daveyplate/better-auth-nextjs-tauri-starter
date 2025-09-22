import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

const allowedOrigins = ["http://tauri.localhost", "http://localhost:3000"]

const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Platform",
    "Access-Control-Allow-Credentials": "true"
}

const protectedRoutes = ["/account/settings"]

export async function middleware(request: NextRequest) {
    // Check cookie for optimistic redirects for protected routes
    // Use getSession in your RSC to protect a route via SSR or useAuthenticate client side
    if (protectedRoutes.includes(request.nextUrl.pathname)) {
        const sessionCookie = getSessionCookie(request)

        if (!sessionCookie) {
            const redirectTo = request.nextUrl.pathname + request.nextUrl.search
            return NextResponse.redirect(
                new URL(`/auth/sign-in?redirectTo=${redirectTo}`, request.url)
            )
        }
    }

    // Check the origin from the request
    const origin = request.headers.get("origin") ?? ""
    const isAllowedOrigin = allowedOrigins.includes(origin)

    // Handle preflighted requests
    const isPreflight = request.method === "OPTIONS"

    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
            ...corsOptions
        }

        return NextResponse.json({}, { headers: preflightHeaders })
    }

    // Handle simple requests
    const response = NextResponse.next()

    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin)
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    return response
}

export const config = {
    // Protected routes
    matcher: "/((?!_next|_vercel|.*\\..*).*)"
}
