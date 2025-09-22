import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const isExport = process.env.NEXT_PUBLIC_EXPORT === "true"
export const baseURL = isExport ? process.env.NEXT_PUBLIC_BASE_URL! : undefined
