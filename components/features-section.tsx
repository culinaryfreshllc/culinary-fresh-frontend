"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import { Truck, Leaf, Award, Zap } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery available in selected areas. Your freshness is our priority.",
  },
  {
    icon: Leaf,
    title: "Fresh & Natural",
    description: "100% natural products with no preservatives or additives. Pure quality.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Carefully selected and quality-checked by our expert team.",
  },
  {
    icon: Zap,
    title: "Cold Chain",
    description: "Maintained at optimal temperature throughout delivery process.",
  },
]

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const iconsRef = useRef<(HTMLDivElement | null)[]>([])
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return

        // Initial reveal animation with 3D flip
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 40,
          rotateX: -15,
          scale: 0.95,
          duration: 0.8,
          delay: index * 0.15,
          ease: "back.out(1.5)",
        })

        // Hover interactions
        const icon = iconsRef.current[index]

        card.addEventListener("mouseenter", () => {
          // Card lift
          gsap.to(card, {
            y: -12,
            scale: 1.03,
            duration: 0.4,
            ease: "power2.out",
          })

          // Icon bounce and rotate
          if (icon) {
            gsap.to(icon, {
              rotate: 360,
              scale: 1.15,
              duration: 0.6,
              ease: "back.out(2)",
            })
          }
        })

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          })

          if (icon) {
            gsap.to(icon, {
              rotate: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            })
          }
        })
      })


    }, containerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Why Choose
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto]">
              Culinary Fresh?
            </span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            We're committed to delivering the freshest premium fish and meat with exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
                className="bg-card rounded-lg p-6 md:p-8 border border-border hover:border-secondary/50 transition-colors group cursor-pointer relative overflow-hidden"
                style={{ perspective: "1000px" }}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div
                  ref={(el) => {
                    iconsRef.current[index] = el
                  }}
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors relative overflow-hidden"
                >
                  {/* Static background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 -z-10" />
                  <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors relative z-10" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/60">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
