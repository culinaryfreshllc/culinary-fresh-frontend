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
      // Initial reveal animation with 3D rotation
      gsap.set(card, { opacity: 0, y: 50, rotateX: 15, scale: 0.9 })
      gsap.to(card, {
        opacity: 1,
        y: 0,
        rotateX: 0,
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

    // Card lift with enhanced 3D tilt and glow
    gsap.to(cardRef.current, {
      y: -20,
      scale: 1.05,
      duration: 0.5,
      ease: "power3.out",
    })

    // Image zoom with rotation
    gsap.to(imageRef.current, {
      scale: 1.2,
      rotation: 2,
      duration: 0.8,
      ease: "power2.out",
    })

    // Glow effect
    gsap.to(glowRef.current, {
      opacity: 0.8,
      scale: 1.1,
      duration: 0.5,
      ease: "power2.out",
    })



    // Sequential star animation with bounce
    if (!isMobile) {
      starsRef.current.forEach((star, i) => {
        if (star && i < Math.floor(product.rating)) {
          gsap.fromTo(
            star,
            { scale: 1, rotation: 0 },
            {
              scale: 1.3,
              rotation: 360,
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
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    })

    gsap.to(imageRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.7,
      ease: "power2.out",
    })

    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
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
      rotateY: deltaX * 12,
      rotateX: -deltaY * 12,
      duration: 0.4,
      ease: "power2.out",
    })

    // Move glow with cursor
    gsap.to(glowRef.current, {
      x: deltaX * 20,
      y: deltaY * 20,
      duration: 0.3,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="glass border-2 border-white/10 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-500 cursor-pointer group relative"
      style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50 rounded-2xl blur-xl opacity-0 -z-10"
      />

      {/* Image Container */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
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
      <div className="p-5 sm:p-6 bg-gradient-to-b from-card/80 to-card backdrop-blur-sm">
        <p className="text-xs sm:text-sm text-secondary uppercase tracking-wider mb-2 font-bold">
          {product.category}
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all duration-300">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>



        {/* Rating with enhanced stars */}
        <div className="flex items-center gap-2 mb-5">
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


      </div>
    </div>
  )
}