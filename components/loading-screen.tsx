"use client"

import { useEffect, useState } from "react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Auto-hide after animation completes
        const hideTimer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        return () => {
            clearTimeout(hideTimer)
        }
    }, [])

    if (!isLoading) {
        return null
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 dark:bg-black/30 transition-opacity duration-500 ${!isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            {/* Lottie Animation */}
            <div className="w-60 h-60">
                <DotLottieReact
                    src="/assets/lotties/loading.json"
                    loop
                    autoplay
                />
            </div>

            {/* Brand Name */}
            <h1 className="text-4xl font-bold mt-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Culinary Fresh
            </h1>
        </div>
    )
}
