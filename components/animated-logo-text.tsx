"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedLogoText() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!containerRef.current || !isMounted || hasAnimated) return

        const letters = containerRef.current.querySelectorAll('.letter')

        if (letters.length === 0) return
        const totalWidth = containerRef.current.offsetWidth

        // Set initial state
        letters.forEach((letter) => {
            const element = letter as HTMLElement
            const offsetLeft = element.offsetLeft

            // Align gradient
            element.style.backgroundSize = `${totalWidth}px 100%`
            element.style.backgroundPosition = `-${offsetLeft}px 0`

            element.style.opacity = '0'
            element.style.transform = 'scale(0) rotate(-10deg)'
        })

        // Use requestAnimationFrame to ensure Chrome applies initial state
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                letters.forEach((letter, index) => {
                    const element = letter as HTMLElement

                    setTimeout(() => {
                        element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        element.style.opacity = '1'
                        element.style.transform = 'scale(1) rotate(0deg)'
                    }, 100 + index * 80)
                })
            })
        })

        setHasAnimated(true)
    }, [isMounted, hasAnimated])

    if (!isMounted) {
        return null
    }

    const text = "Culinary Fresh"

    return (
        <div
            ref={containerRef}
            className="relative inline-flex items-center gap-0 font-black text-xl"
            style={{
                fontWeight: 900,
                letterSpacing: '-0.02em',
            }}
        >
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className="letter inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    style={{
                        opacity: 0,
                        transform: 'scale(0) rotate(-10deg)',
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    )
}
