"use client"

import { useEffect, useState, useRef } from "react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import gsap from "gsap"

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 200)

        // Animate exit
        const hideTimer = setTimeout(() => {
            if (containerRef.current) {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 1.1,
                    filter: "blur(20px)",
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => setIsLoading(false),
                })
            }
        }, 3500)

        // Entrance animations
        if (logoRef.current && textRef.current) {
            gsap.from(logoRef.current, {
                scale: 0,
                rotation: -180,
                opacity: 0,
                duration: 1,
                ease: "elastic.out(1, 0.5)",
            })

            gsap.from(textRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.5,
                ease: "power3.out",
            })
        }

        return () => {
            clearTimeout(hideTimer)
            clearInterval(progressInterval)
        }
    }, [])

    if (!isLoading) {
        return null
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center glass-dark transition-all duration-500"
        >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-float opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Lottie Animation with glow */}
            <div ref={logoRef} className="relative w-60 h-60">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-3xl animate-pulse-gentle" />
                <DotLottieReact
                    src="/assets/lotties/loading.json"
                    loop
                    autoplay
                    className="relative z-10"
                />
            </div>

            {/* Brand Name with shimmer */}
            <h1
                ref={textRef}
                className="text-5xl font-black mt-8 text-shimmer"
            >
                Culinary Fresh
            </h1>

            {/* Loading bar */}
            <div className="w-64 h-2 bg-white/10 rounded-full mt-8 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Loading percentage */}
            <p className="text-white/60 mt-4 font-semibold">
                {Math.min(Math.round(progress), 100)}%
            </p>
        </div>
    )
}
