"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"

export function ScrollProgress() {
    const [progress, setProgress] = useState(0)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollTop = window.scrollY

            const totalScroll = documentHeight - windowHeight
            const scrollProgress = (scrollTop / totalScroll) * 100

            setProgress(scrollProgress)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll() // Initial calculation

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
            <div
                className={`h-full bg-gradient-to-r from-primary via-secondary to-primary ${prefersReducedMotion ? '' : 'transition-all duration-150'
                    }`}
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
