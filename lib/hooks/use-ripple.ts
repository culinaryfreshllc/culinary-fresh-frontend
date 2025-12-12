import { useCallback } from 'react'

interface RippleEvent {
    clientX: number
    clientY: number
    currentTarget: HTMLElement
}

/**
 * Custom hook for creating ripple effect on click
 * Returns a function to be called on click events
 */
export function useRipple() {
    const createRipple = useCallback((event: RippleEvent | React.MouseEvent<HTMLElement>) => {
        const button = event.currentTarget
        const ripple = document.createElement('span')
        const diameter = Math.max(button.clientWidth, button.clientHeight)
        const radius = diameter / 2

        // Get button position
        const rect = button.getBoundingClientRect()

        ripple.style.width = ripple.style.height = `${diameter}px`
        ripple.style.left = `${event.clientX - rect.left - radius}px`
        ripple.style.top = `${event.clientY - rect.top - radius}px`
        ripple.classList.add('ripple')

        // Remove existing ripples
        const existingRipple = button.getElementsByClassName('ripple')[0]
        if (existingRipple) {
            existingRipple.remove()
        }

        button.appendChild(ripple)

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove()
        }, 600)
    }, [])

    return createRipple
}
