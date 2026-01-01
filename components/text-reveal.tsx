"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import gsap from "gsap"

interface TextRevealProps {
    children: string
    className?: string
    delay?: number
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
    const textRef = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (prefersReducedMotion || !textRef.current) return

        const text = textRef.current
        const words = children.split(" ")

        // Clear and rebuild with spans
        text.innerHTML = ""
        words.forEach((word, i) => {
            const wordSpan = document.createElement("span")
            wordSpan.style.display = "inline-block"
            wordSpan.style.overflow = "hidden"
            wordSpan.style.marginRight = "0.3em"

            const innerSpan = document.createElement("span")
            innerSpan.textContent = word
            innerSpan.style.display = "inline-block"

            wordSpan.appendChild(innerSpan)
            text.appendChild(wordSpan)
        })

        const innerSpans = text.querySelectorAll("span span")

        gsap.set(innerSpans, { yPercent: 100, opacity: 0 })

        gsap.to(innerSpans, {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            delay,
            ease: "power3.out",
        })
    }, [children, delay, prefersReducedMotion])

    return (
        <div ref={textRef} className={className}>
            {children}
        </div>
    )
}
