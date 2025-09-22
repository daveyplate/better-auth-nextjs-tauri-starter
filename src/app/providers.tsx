"use client"

import { signInSocial } from "@daveyplate/better-auth-tauri"
import { useBetterAuthTauri } from "@daveyplate/better-auth-tauri/react"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { platform } from "@tauri-apps/plugin-os"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { authClient } from "@/lib/auth-client"
import { isProduction } from "@/lib/utils"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    useBetterAuthTauri({
        authClient,
        scheme: "bas",
        debugLogs: true,
        onSuccess: () => router.push("/auth/callback")
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
                baseURL={
                    typeof window !== "undefined" &&
                    platform() === "macos" &&
                    isProduction
                        ? `bas://`
                        : undefined
                }
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
