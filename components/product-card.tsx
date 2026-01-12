"use client"

import { useRef, useEffect } from "react"
import { Star } from "lucide-react"
import gsap from "gsap"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import type { Product } from "@/lib/product-data"

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const badgeRef = useRef(null)
  const starsRef = useRef<(HTMLDivElement | null)[]>([])
  const glowRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Initial reveal animation
      gsap.set(card, { opacity: 0, y: 50, scale: 0.9 })
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        delay: index * 0.15,
        ease: "power3.out",
      })
    })

    return () => ctx.revert()
  }, [index, prefersReducedMotion])

  // Continuous pulse animation for badge
  useEffect(() => {
    if (!badgeRef.current || prefersReducedMotion) return

    gsap.to(badgeRef.current, {
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }, [prefersReducedMotion])

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return

    const isMobile = window.innerWidth < 768

    // Card lift
    gsap.to(cardRef.current, {
      y: -20,
      scale: 1.05,
      duration: 0.5,
      ease: "power3.out",
    })

    // Image zoom
    gsap.to(imageRef.current, {
      scale: 1.2,
      duration: 0.8,
      ease: "power2.out",
    })

    // Deep, soft glow visibility
    gsap.to(glowRef.current, {
      opacity: 0.9,
      scaleX: 1.1,
      scaleY: 1.2,
      duration: 0.6,
      ease: "power2.out",
    })

    // Sequential star animation with bounce
    if (!isMobile) {
      starsRef.current.forEach((star, i) => {
        if (star && i < Math.floor(product.rating)) {
          gsap.fromTo(
            star,
            { scale: 1 },
            {
              scale: 1.3,
              duration: 0.4,
              delay: i * 0.06,
              yoyo: true,
              repeat: 1,
              ease: "back.out(4)",
            }
          )
        }
      })
    }
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion) return

    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    })

    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.7,
      ease: "power2.out",
    })

    // Hide glow
    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  const handleMouseMove = () => {
    // Disabled moving animation
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="glass border-2 border-white/10 rounded-2xl hover:border-secondary/50 transition-all duration-500 cursor-pointer group relative hover:z-10 h-full flex flex-col"
    >
      {/* Background Glow Effect - Deeper and wider spread at bottom */}
      <div
        ref={glowRef}
        className="absolute bottom-[-10%] left-[-5%] right-[-5%] h-2/3 bg-gradient-to-t from-primary/40 via-secondary/30 to-transparent rounded-full blur-[60px] opacity-0 -z-10 pointer-events-none"
      />

      {/* Image Container */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-muted to-muted/50 rounded-t-2xl flex-shrink-0">
        <img
          ref={imageRef}
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Tag with glassmorphism */}
        <div className="absolute top-3 right-3 z-10">
          <span
            ref={badgeRef}
            className="px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full"
          >
            {product.tag}
          </span>
        </div>
      </div>

      {/* Content with enhanced styling */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-card/80 to-card backdrop-blur-sm rounded-b-2xl relative flex-grow flex flex-col">
        <p className="text-xs sm:text-sm text-secondary uppercase tracking-wider mb-2 font-bold">
          {product.category}
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all duration-300">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        {/* Rating with enhanced stars */}
        <div className="flex items-center gap-2 mb-5 mt-auto">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  starsRef.current[i] = el
                }}
              >
                <Star
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${i < Math.floor(product.rating)
                    ? "fill-secondary text-secondary drop-shadow-lg"
                    : "text-muted"
                    }`}
                />
              </div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Large, soft gradient portion at the bottom - matches the reference image */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-b-2xl opacity-50 group-hover:opacity-80 transition-all duration-700 blur-2xl pointer-events-none" />

        {/* Decorative gradient square at bottom right */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-primary via-secondary to-accent dark:from-primary dark:via-primary dark:to-secondary rounded-tl-2xl rounded-br-2xl opacity-80 group-hover:opacity-100 transition-all duration-300 z-20" />
      </div>
    </div>
  )
}