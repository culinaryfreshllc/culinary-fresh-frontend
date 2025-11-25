"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import { Fish, Beef } from "lucide-react"

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                // Random increment for more natural feel
                return prev + Math.random() * 15
            })
        }, 150)

        // Auto-hide after minimum time
        const hideTimer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => {
            clearInterval(progressInterval)
            clearTimeout(hideTimer)
        }
    }, [])

    if (!isLoading) {
        return null
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 transition-opacity duration-500 ${progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            {/* Animated Logo */}
            <div className="relative mb-8">
                <div
                    className={`w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-2xl ${prefersReducedMotion ? '' : 'animate-scale-in'
                        }`}
                >
                    <span className="text-white font-bold text-4xl">CF</span>
                </div>

                {/* Floating icons */}
                {!prefersReducedMotion && (
                    <>
                        <div className="absolute -top-8 -left-8 text-primary/40 animate-float" style={{ animationDelay: "0s" }}>
                            <Fish className="w-12 h-12" />
                        </div>
                        <div className="absolute -bottom-8 -right-8 text-secondary/40 animate-float" style={{ animationDelay: "0.5s" }}>
                            <Beef className="w-12 h-12" />
                        </div>
                    </>
                )}
            </div>

            {/* Brand Name */}
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8 ${prefersReducedMotion ? '' : 'animate-fade-in'
                }`}>
                Culinary Fresh
            </h1>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ${prefersReducedMotion ? '' : 'shimmer'
                        }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Loading Text */}
            <p className="mt-4 text-sm text-muted-foreground">
                Loading premium quality...
            </p>
        </div>
    )
}
