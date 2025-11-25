"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import gsap from "gsap"
import { Leaf, Fish, Beef } from "lucide-react"

export function AnimatedBackground() {
    const containerRef = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (prefersReducedMotion || !containerRef.current) return

        const elements = containerRef.current.querySelectorAll(".floating-element")

        elements.forEach((element, index) => {
            // Random starting positions
            gsap.set(element, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotation: Math.random() * 360,
            })

            // Gentle floating animation
            gsap.to(element, {
                x: "+=" + (Math.random() * 200 - 100),
                y: "+=" + (Math.random() * 200 - 100),
                rotation: "+=" + (Math.random() * 180 - 90),
                duration: 20 + Math.random() * 10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.5,
            })

            // Fade in/out
            gsap.to(element, {
                opacity: 0.15,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            })
        })
    }, [prefersReducedMotion])

    if (prefersReducedMotion) return null

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
            aria-hidden="true"
        >
            {/* Floating food elements */}
            <div className="floating-element absolute opacity-5 text-primary">
                <Leaf className="w-16 h-16 md:w-24 md:h-24" />
            </div>
            <div className="floating-element absolute opacity-5 text-secondary">
                <Fish className="w-20 h-20 md:w-28 md:h-28" />
            </div>
            <div className="floating-element absolute opacity-5 text-primary">
                <Beef className="w-18 h-18 md:w-24 md:h-24" />
            </div>
            <div className="floating-element absolute opacity-5 text-secondary">
                <Leaf className="w-14 h-14 md:w-20 md:h-20" />
            </div>
            <div className="floating-element absolute opacity-5 text-primary">
                <Fish className="w-16 h-16 md:w-22 md:h-22" />
            </div>
        </div>
    )
}
