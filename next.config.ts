import type { NextConfig } from "next"
import { isExport } from "@/lib/utils"

const nextConfig: NextConfig = {
    images: {
        unoptimized: isExport
    },
    output: isExport ? "export" : undefined,
    pageExtensions: isExport ? ["jsx", "tsx"] : undefined
}

export default nextConfig
