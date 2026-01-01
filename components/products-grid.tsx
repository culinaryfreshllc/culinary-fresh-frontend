"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    id: 1,
    name: "Atlantic Salmon",
    category: "Fish",
    price: 24.99,
    rating: 4.8,
    reviews: 124,
    tag: "Fresh",
    image: "/fresh-atlantic-salmon-fillet.jpg",
    description: "Premium fresh Atlantic salmon fillet",
  },
  {
    id: 2,
    name: "Wild Caught Tuna",
    category: "Fish",
    price: 29.99,
    rating: 4.9,
    reviews: 98,
    tag: "Wild",
    image: "/wild-caught-tuna-premium.jpg",
    description: "Premium wild-caught yellowfin tuna",
  },
  {
    id: 3,
    name: "Grass-Fed Beef",
    category: "Meat",
    price: 34.99,
    rating: 4.7,
    reviews: 156,
    tag: "Premium",
    image: "/grass-fed-beef-steak-premium.jpg",
    description: "Premium grass-fed beef ribeye steak",
  },
  {
    id: 4,
    name: "Organic Chicken",
    category: "Meat",
    price: 18.99,
    rating: 4.6,
    reviews: 203,
    tag: "Organic",
    image: "/organic-free-range-chicken-breast.jpg",
    description: "Organic free-range chicken breast",
  },
  {
    id: 5,
    name: "Sea Bream",
    category: "Fish",
    price: 22.99,
    rating: 4.7,
    reviews: 87,
    tag: "Fresh",
    image: "/fresh-sea-bream-whole-fish.jpg",
    description: "Fresh whole sea bream",
  },
  {
    id: 6,
    name: "Lamb Chops",
    category: "Meat",
    price: 32.99,
    rating: 4.8,
    reviews: 142,
    tag: "Premium",
    image: "/premium-lamb-chops-fresh.jpg",
    description: "Premium lamb chops",
  },
  {
    id: 7,
    name: "Shrimp Selection",
    category: "Fish",
    price: 26.99,
    rating: 4.9,
    reviews: 176,
    tag: "Fresh",
    image: "/fresh-large-shrimp-prawns.jpg",
    description: "Fresh large tiger shrimp",
  },
  {
    id: 8,
    name: "Duck Breast",
    category: "Meat",
    price: 28.99,
    rating: 4.8,
    reviews: 91,
    tag: "Premium",
    image: "/premium-duck-breast-fresh.jpg",
    description: "Premium duck breast",
  },
]

export function ProductsGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: (index % 4) * 0.1,
        })
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
    <section ref={containerRef} className="py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
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
    </section>
  )
}
