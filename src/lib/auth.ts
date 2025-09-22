import { tauri } from "@daveyplate/better-auth-tauri/plugin"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/database/db"
import * as schema from "@/database/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
    trustedOrigins: [
        process.env.NEXT_PUBLIC_BASE_URL!,
        "bas://",
        "http://localhost:3000",
        "tauri://localhost",
        "http://tauri.localhost",
        "https://leaked.ngrok.dev",
        "null*"
    ],
    advanced: {
        defaultCookieAttributes:
            process.env.NODE_ENV === "production"
                ? {
                      sameSite: "none",
                      secure: true
                  }
                : undefined
    },
    plugins: [
        tauri({
            scheme: "bas"
        })
    ]
})
