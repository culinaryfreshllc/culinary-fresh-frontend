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
            // Strategic placement for 8 elements
            const positions = [
                // Top area
                { x: 0.15, y: 0.18 },
                { x: 0.82, y: 0.15 },

                // Upper-middle area
                { x: 0.35, y: 0.35 },
                { x: 0.70, y: 0.38 },

                // Middle area
                { x: 0.22, y: 0.52 },
                { x: 0.75, y: 0.55 },

                // Bottom area
                { x: 0.18, y: 0.85 },
                { x: 0.78, y: 0.88 },
            ]

            const position = positions[index % positions.length]

            // Calculate actual pixel positions based on viewport
            const xPos = position.x * window.innerWidth
            const yPos = position.y * window.innerHeight

            // Set starting positions distributed across screen
            gsap.set(element, {
                x: xPos,
                y: yPos,
                rotation: Math.random() * 360,
            })

            // Gentle floating animation with constrained movement
            gsap.to(element, {
                x: xPos + (Math.random() * 140 - 70),
                y: yPos + (Math.random() * 140 - 70),
                rotation: `+=${Math.random() * 180 - 90}`,
                duration: 28 + Math.random() * 18,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.6,
            })

            // Fade in/out
            gsap.to(element, {
                opacity: 0.08,
                duration: 4.5 + Math.random() * 2.5,
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
            {/* Top area */}
            <div className="floating-element absolute opacity-5 text-primary">
                <Leaf className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div className="floating-element absolute opacity-5 text-secondary">
                <Fish className="w-14 h-14 md:w-20 md:h-20" />
            </div>

            {/* Upper-middle area */}
            <div className="floating-element absolute opacity-5 text-primary">
                <Beef className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div className="floating-element absolute opacity-5 text-secondary">
                <Leaf className="w-14 h-14 md:w-18 md:h-18" />
            </div>

            {/* Middle area */}
            <div className="floating-element absolute opacity-5 text-primary">
                <Fish className="w-14 h-14 md:w-18 md:h-18" />
            </div>
            <div className="floating-element absolute opacity-5 text-secondary">
                <Beef className="w-12 h-12 md:w-16 md:h-16" />
            </div>

            {/* Bottom area */}
            <div className="floating-element absolute opacity-5 text-primary">
                <Fish className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div className="floating-element absolute opacity-5 text-secondary">
                <Beef className="w-14 h-14 md:w-18 md:h-18" />
            </div>
        </div>
    )
}
