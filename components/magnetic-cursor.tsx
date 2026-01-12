"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import gsap from "gsap"

export function MagneticCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const cursorDotRef = useRef<HTMLDivElement>(null)
    const [isPointer, setIsPointer] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const prefersReducedMotion = useReducedMotion()

    // Track when component is mounted on client
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined" || !isMounted) return

        const cursor = cursorRef.current
        const cursorDot = cursorDotRef.current
        if (!cursor || !cursorDot) return

        let mouseX = 0
        let mouseY = 0

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY

            // Outer ring follows slowly for smooth trailing effect
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0.6,
                ease: "power3.out",
            })

            // Inner dot follows instantly
            gsap.to(cursorDot, {
                x: mouseX,
                y: mouseY,
                duration: 0,
            })

            // Check if hovering over interactive element
            const target = e.target as HTMLElement
            const isInteractive =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("magnetic")

            setIsPointer(!!isInteractive)
        }

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.currentTarget as HTMLElement
            const rect = target.getBoundingClientRect()
            const relX = e.clientX - rect.left - rect.width / 2
            const relY = e.clientY - rect.top - rect.height / 2

            gsap.to(target, {
                x: relX * 0.3,
                y: relY * 0.3,
                duration: 0.3,
                ease: "power2.out",
            })
        }

        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.currentTarget as HTMLElement
            gsap.to(target, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
            })
        }

        const magneticElements = document.querySelectorAll("a:not(.not-magnetic), button:not(.not-magnetic), .magnetic:not(.not-magnetic)")
        magneticElements.forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnter as EventListener)
            el.addEventListener("mousemove", handleMouseEnter as EventListener)
            el.addEventListener("mouseleave", handleMouseLeave as EventListener)
        })

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            magneticElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter as EventListener)
                el.removeEventListener("mousemove", handleMouseEnter as EventListener)
                el.removeEventListener("mouseleave", handleMouseLeave as EventListener)
            })
        }
    }, [prefersReducedMotion, isMounted])

    if (prefersReducedMotion || !isMounted) return null

    return (
        <>
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ${isPointer ? "scale-150" : "scale-100"
                    }`}
                style={{
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div className="w-full h-full rounded-full border-2 border-white opacity-50" />
            </div>
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    transform: "translate(-50%, -50%)",
                }}
            />
        </>
    )
}
