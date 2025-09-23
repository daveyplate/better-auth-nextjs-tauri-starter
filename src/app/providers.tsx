"use client"

import { signInSocial } from "@daveyplate/better-auth-tauri"
import { useBetterAuthTauri } from "@daveyplate/better-auth-tauri/react"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { isTauri } from "@tauri-apps/api/core"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    useBetterAuthTauri({
        authClient,
        scheme: "bas",
        onSuccess: (callbackURL) =>
            router.push(`/auth/callback?redirectTo=${callbackURL}`),
        debugLogs: false
    })

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthUIProvider
                authClient={authClient}
                navigate={router.push}
                replace={router.replace}
                onSessionChange={() => {
                    // Clear router cache (protected routes)
                    router.refresh()
                }}
                baseURL={isTauri() ? "bas://" : undefined}
                social={{
                    providers: ["google"],
                    signIn: (params) => signInSocial({ ...params, authClient })
                }}
                Link={Link}
            >
                {children}

                <Toaster />
            </AuthUIProvider>
        </ThemeProvider>
    )
}
