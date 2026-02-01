"use client"

import { useEffect, useState, useRef } from "react"
import gsap from "gsap"

interface Particle {
    left: string
    top: string
    animationDelay: string
    animationDuration: string
}

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [isMounted, setIsMounted] = useState(false)
    const [particles, setParticles] = useState<Particle[]>([])
    const containerRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLHeadingElement>(null)

    // Generate particles on client-side only
    useEffect(() => {
        setIsMounted(true)
        const generatedParticles: Particle[] = Array.from({ length: 20 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
        }))
        setParticles(generatedParticles)
    }, [])

    useEffect(() => {
        if (!isMounted) return

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
                // Add pointer-events-none immediately to prevent blocking
                containerRef.current.style.pointerEvents = 'none'

                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 1.1,
                    filter: "blur(20px)",
                    duration: 0.6,
                    ease: "power2.inOut",
                    onComplete: () => setIsLoading(false),
                })
            }
        }, 2500)

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
    }, [isMounted])

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
                {isMounted && particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-float opacity-30"
                        style={particle}
                    />
                ))}
            </div>

            {/* Logo with glow */}
            <div ref={logoRef} className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-2xl animate-pulse-gentle" />
                <div className="relative z-10 w-full h-full bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-2xl">CF</span>
                </div>
            </div>

            {/* Brand Name with shimmer */}
            <h1
                ref={textRef}
                className="text-2xl font-black mt-4 text-shimmer"
            >
                Culinary Fresh
            </h1>

            {/* Loading bar */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Loading percentage */}
            <p className="text-white/60 mt-2 font-semibold text-sm">
                {Math.min(Math.round(progress), 100)}%
            </p>
        </div>
    )
}
