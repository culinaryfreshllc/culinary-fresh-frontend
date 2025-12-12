"use client"

import { useRef, useEffect } from "react"
import { Star, ShoppingCart } from "lucide-react"
import gsap from "gsap"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import type { Product } from "@/lib/product-data"

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef(null)
  const hoverOverlay = useRef(null)
  const imageRef = useRef(null)
  const badgeRef = useRef(null)
  const starsRef = useRef<(HTMLDivElement | null)[]>([])
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Initial reveal animation
      gsap.set(card, { opacity: 0, y: 30, rotateX: 10 })
      gsap.to(card, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
      })
    })

    return () => ctx.revert()
  }, [index, prefersReducedMotion])

  // Pulse animation for badge
  useEffect(() => {
    if (!badgeRef.current || prefersReducedMotion) return

    gsap.to(badgeRef.current, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }, [prefersReducedMotion])

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return

    const isMobile = window.innerWidth < 768

    // Card lift with 3D tilt
    gsap.to(cardRef.current, {
      y: -12,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
    })

    // Image zoom
    gsap.to(imageRef.current, {
      scale: 1.15,
      duration: 0.6,
      ease: "power2.out",
    })

    // Overlay fade in
    gsap.to(hoverOverlay.current, {
      opacity: 1,
      duration: 0.3,
      pointerEvents: "auto",
    })

    // Sequential star animation
    if (!isMobile) {
      starsRef.current.forEach((star, i) => {
        if (star && i < Math.floor(product.rating)) {
          gsap.fromTo(
            star,
            { scale: 1 },
            {
              scale: 1.2,
              duration: 0.2,
              delay: i * 0.05,
              yoyo: true,
              repeat: 1,
              ease: "back.out(3)",
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
      rotateY: 0,
      rotateX: 0,
      duration: 0.4,
      ease: "power2.out",
    })

    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    })

    gsap.to(hoverOverlay.current, {
      opacity: 0,
      duration: 0.3,
      pointerEvents: "none",
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || window.innerWidth < 768) return

    const card = cardRef.current as HTMLElement | null
    if (!card) return

    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)

    gsap.to(card, {
      rotateY: deltaX * 8,
      rotateX: -deltaY * 8,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-300 cursor-pointer group"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-muted">
        <img
          ref={imageRef}
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span
            ref={badgeRef}
            className="px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full shadow-lg"
          >
            {product.tag}
          </span>
        </div>

        {/* Hover Overlay */}
        <div
          ref={hoverOverlay}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity pointer-events-none"
        >
          <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-all transform hover:scale-110 shadow-xl">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2 font-medium">
          {product.category}
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        {/* Weight */}
        <p className="text-xs text-muted-foreground mb-3 font-medium">Weight: {product.weight}</p>
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  starsRef.current[i] = el
                }}
              >
                <Star
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${i < Math.floor(product.rating)
                      ? "fill-secondary text-secondary"
                      : "text-muted"
                    }`}
                />
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="text-2xl sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ${product.price}
          </span>
          <button className="hidden sm:flex px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-all hover:scale-110">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}