"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import gsap from "gsap"

export function MagneticCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const cursorDotRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)
    const prefersReducedMotion = useReducedMotion()

    // Position tracking
    const mousePos = useRef({ x: 0, y: 0 })
    const lastMousePos = useRef({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isMagnetic, setIsMagnetic] = useState(false)
    const magneticTarget = useRef<HTMLElement | null>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined" || !isMounted) return

        const cursor = cursorRef.current
        const cursorDot = cursorDotRef.current
        if (!cursor || !cursorDot) return

        // Set initial state
        gsap.set([cursor, cursorDot], { xPercent: -50, yPercent: -50 })

        // quickTo for high performance
        const xToDot = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3.out" })
        const yToDot = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3.out" })

        const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "soft" })
        const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "soft" })

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a, button, .magnetic") as HTMLElement

            if (target && !target.classList.contains('not-magnetic')) {
                setIsHovering(true)

                if (target.classList.contains('magnetic')) {
                    setIsMagnetic(true)
                    magneticTarget.current = target
                }
            } else {
                setIsHovering(false)
                setIsMagnetic(false)
                magneticTarget.current = null
            }
        }

        const update = () => {
            // Calculate velocity for inertia feel
            const vx = mousePos.current.x - lastMousePos.current.x
            const vy = mousePos.current.y - lastMousePos.current.y

            // Limit velocity for subtle effect
            const speed = Math.sqrt(vx * vx + vy * vy)
            const angle = Math.atan2(vy, vx) * (180 / Math.PI)

            // Dot follows mouse directly with tiny delay
            xToDot(mousePos.current.x)
            yToDot(mousePos.current.y)

            if (isMagnetic && magneticTarget.current) {
                const rect = magneticTarget.current.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2

                // Pull ring towards center of target
                xToCursor(centerX + (mousePos.current.x - centerX) * 0.2)
                yToCursor(centerY + (mousePos.current.y - centerY) * 0.2)

                // No scale on hover, just slight elongation
                gsap.to(cursor, {
                    scaleX: 1.2,
                    scaleY: 0.8,
                    rotate: angle,
                    duration: 0.4,
                    overwrite: "auto"
                })
            } else {
                // Regular following with inertia skew
                xToCursor(mousePos.current.x)
                yToCursor(mousePos.current.y)

                // No hover scale, only velocity-based stretching
                gsap.to(cursor, {
                    scaleX: 1 + Math.min(speed / 100, 0.3),
                    scaleY: 1 - Math.min(speed / 100, 0.2),
                    rotate: speed > 1 ? angle : 0,
                    duration: 0.4,
                    overwrite: "auto"
                })
            }

            lastMousePos.current = { ...mousePos.current }
        }

        gsap.ticker.add(update)
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseover", handleMouseOver)

        return () => {
            gsap.ticker.remove(update)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseover", handleMouseOver)
        }
    }, [prefersReducedMotion, isMounted, isHovering, isMagnetic])

    if (prefersReducedMotion || !isMounted) return null

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
            >
                <div className="w-full h-full rounded-full border-2 border-white transition-colors" />
            </div>
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
            />
        </>
    )
}
