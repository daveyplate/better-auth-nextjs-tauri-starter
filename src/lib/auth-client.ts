import { createAuthClient } from "better-auth/react"
import { baseURL } from "./utils"

export const authClient = createAuthClient({ baseURL })
