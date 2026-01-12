"use client"

import { useEffect, useRef } from "react"
import { Star } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { products } from "@/lib/product-data"
import type { Product } from "@/lib/product-data"

gsap.registerPlugin(ScrollTrigger)

// Select first 4 products as featured
const featuredProducts = products.slice(0, 4)

export function FeaturedProducts() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            scrub: 1,
            markers: false,
          },
          opacity: 0,
          y: 40,
          duration: 0.6,
        })

        // Hover animation setup
        gsap.set(card, { transformOrigin: "center center" })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleMouseEnter = (index: number) => {
    if (!cardsRef.current[index]) return
    gsap.to(cardsRef.current[index], {
      y: -10,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleMouseLeave = (index: number) => {
    if (!cardsRef.current[index]) return
    gsap.to(cardsRef.current[index], {
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  return (
    <section
      ref={containerRef}
      className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-primary/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Featured Products
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections of our finest fish and meat, curated for quality and freshness
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el as HTMLDivElement
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full">
                    {product.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 line-clamp-2">{product.name}</h3>
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                          ? "fill-secondary text-secondary"
                          : "text-muted"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>


              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-16">
          <a
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}