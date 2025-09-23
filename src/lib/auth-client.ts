import { isTauri } from "@tauri-apps/api/core"
import { fetch as tauriFetch } from "@tauri-apps/plugin-http"
import { platform } from "@tauri-apps/plugin-os"
import { createAuthClient } from "better-auth/react"

import { baseURL, isProduction } from "./utils"

export const authClient = createAuthClient({
    baseURL,
    fetchOptions: {
        customFetchImpl: (...params) =>
            isTauri() &&
            ((platform() === "macos" && isProduction) ||
                platform() === "windows")
                ? tauriFetch(...params)
                : fetch(...params)
    }
})
