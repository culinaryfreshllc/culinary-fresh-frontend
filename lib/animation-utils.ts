import gsap from 'gsap'

/**
 * Common animation configurations and utilities for GSAP
 */

// Easing presets
export const easings = {
    smooth: 'power2.out',
    elastic: 'elastic.out(1, 0.5)',
    bounce: 'bounce.out',
    smooth_in_out: 'power2.inOut',
    expo_out: 'expo.out',
}

// Duration presets (in seconds)
export const durations = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.6,
    verySlow: 1.0,
}

// Common animation configs
export const animations = {
    fadeIn: {
        from: { opacity: 0, y: 20 },
        to: { opacity: 1, y: 0, duration: durations.normal, ease: easings.smooth },
    },
    fadeInUp: {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0, duration: durations.slow, ease: easings.smooth },
    },
    scaleIn: {
        from: { scale: 0.9, opacity: 0 },
        to: { scale: 1, opacity: 1, duration: durations.normal, ease: easings.smooth },
    },
    slideInLeft: {
        from: { x: -50, opacity: 0 },
        to: { x: 0, opacity: 1, duration: durations.normal, ease: easings.smooth },
    },
    slideInRight: {
        from: { x: 50, opacity: 0 },
        to: { x: 0, opacity: 1, duration: durations.normal, ease: easings.smooth },
    },
}

/**
 * Create a stagger animation for multiple elements
 */
export function createStagger(
    elements: (HTMLElement | null)[],
    animationConfig: gsap.TweenVars,
    staggerDelay: number = 0.1
) {
    const validElements = elements.filter((el): el is HTMLElement => el !== null)

    return gsap.from(validElements, {
        ...animationConfig,
        stagger: staggerDelay,
    })
}

/**
 * Create a hover animation that can be easily reused
 */
export function createHoverAnimation(
    element: HTMLElement,
    hoverConfig: gsap.TweenVars,
    normalConfig: gsap.TweenVars = {}
) {
    const defaultNormal = { scale: 1, y: 0, duration: durations.fast }

    element.addEventListener('mouseenter', () => {
        gsap.to(element, { ...hoverConfig, duration: durations.fast, ease: easings.smooth })
    })

    element.addEventListener('mouseleave', () => {
        gsap.to(element, { ...defaultNormal, ...normalConfig, ease: easings.smooth })
    })
}

/**
 * Magnetic button effect - element follows cursor on hover
 */
export function createMagneticEffect(element: HTMLElement, strength: number = 0.3) {
    const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength

        gsap.to(element, {
            x: deltaX,
            y: deltaY,
            duration: durations.fast,
            ease: easings.smooth,
        })
    }

    const handleMouseLeave = () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: durations.normal,
            ease: easings.elastic,
        })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseleave', handleMouseLeave)
    }
}

/**
 * Parallax scroll effect
 */
export function createParallaxScroll(
    element: HTMLElement,
    speed: number = 0.5,
    direction: 'up' | 'down' = 'down'
) {
    const multiplier = direction === 'down' ? 1 : -1

    const handleScroll = () => {
        const scrolled = window.scrollY
        const yPos = scrolled * speed * multiplier

        gsap.to(element, {
            y: yPos,
            duration: 0,
            ease: 'none',
        })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
        window.removeEventListener('scroll', handleScroll)
    }
}

/**
 * Text reveal animation - animates text letter by letter or word by word
 */
export function createTextReveal(
    element: HTMLElement,
    mode: 'chars' | 'words' = 'words',
    staggerDelay: number = 0.03
) {
    const text = element.textContent || ''
    const items = mode === 'chars' ? text.split('') : text.split(' ')

    element.innerHTML = items
        .map(
            (item, i) =>
                `<span class="reveal-item" style="display: inline-block; opacity: 0;">${item === ' ' ? '&nbsp;' : item
                }${mode === 'words' && i < items.length - 1 ? '&nbsp;' : ''}</span>`
        )
        .join('')

    const spans = element.querySelectorAll('.reveal-item')

    return gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: durations.normal,
        stagger: staggerDelay,
        ease: easings.smooth,
    })
}
