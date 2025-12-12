"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const isMobile = window.innerWidth < 768

    const ctx = gsap.context(() => {
      // Timeline for smooth animations
      const tl = gsap.timeline()

      // Animate background gradient
      if (!isMobile) {
        gsap.to(backgroundRef.current, {
          backgroundPosition: "100% 100%",
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }

      // Animate title with stagger
      tl.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      })

      // Animate subtitle
      tl.from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        "-=0.5",
      )

      // Animate CTA with bounce
      tl.from(
        ctaRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        "-=0.4",
      )

      // Animate image with 3D effect
      if (!isMobile) {
        tl.from(
          imageRef.current,
          {
            opacity: 0,
            scale: 0.9,
            rotationY: 15,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6",
        )

        // Floating animation for image
        gsap.to(imageRef.current, {
          y: 15,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })

        // 3D tilt effect on mouse move
        const imageElement = imageRef.current
        if (imageElement) {
          const handleMouseMove = (e: MouseEvent) => {
            const rect = imageElement.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const deltaX = (e.clientX - centerX) / (rect.width / 2)
            const deltaY = (e.clientY - centerY) / (rect.height / 2)

            gsap.to(imageElement, {
              rotationY: deltaX * 5,
              rotationX: -deltaY * 5,
              duration: 0.3,
              ease: "power2.out",
            })
          }

          const handleMouseLeave = () => {
            gsap.to(imageElement, {
              rotationY: 0,
              rotationX: 0,
              duration: 0.6,
              ease: "power2.out",
            })
          }

          imageElement.addEventListener("mousemove", handleMouseMove)
          imageElement.addEventListener("mouseleave", handleMouseLeave)

          return () => {
            imageElement.removeEventListener("mousemove", handleMouseMove)
            imageElement.removeEventListener("mouseleave", handleMouseLeave)
          }
        }
      }

      // Scroll-triggered stats animation
      if (statsRef.current) {
        const statElements = statsRef.current.querySelectorAll(".stat-item")
        gsap.from(statElements, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          scale: 0.9,
          stagger: 0.15,
          duration: 0.6,
          ease: "back.out(1.5)",
        })
      }

      // Parallax effect on scroll
      if (!isMobile) {
        gsap.to(titleRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: -50,
          opacity: 0.8,
        })

        gsap.to(imageRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: -100,
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden"
    >
      {/* Animated background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 -z-10"
        style={{
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 0%",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div ref={titleRef} className="space-y-4">
              <div className={`inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold ${prefersReducedMotion ? '' : 'animate-pulse-gentle'}`}>
                Premium Quality Guaranteed
              </div>
              <h1 className="hero-title text-foreground">
                Fresh Premium
                <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto]">
                  Fish & Meat
                </span>
              </h1>
            </div>

            <div ref={subtitleRef} className="hero-subtitle text-foreground/70">
              Discover the finest selection of premium fresh fish and meat delivered directly to your door. Sourced from
              trusted suppliers with uncompromising quality standards.
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-8">
              {[
                { number: "500+", label: "Happy Customers" },
                { number: "24/7", label: "Fresh Guarantee" },
                { number: "100%", label: "Premium Quality" },
              ].map((stat, index) => (
                <div key={index} className="stat-item text-center md:text-left group cursor-default">
                  <div className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm text-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div
            ref={imageRef}
            className="relative h-96 md:h-full min-h-[400px] hidden md:flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent rounded-3xl blur-2xl opacity-50" />
            <div className="relative w-full h-full flex items-center justify-center transform-gpu">
              <img
                src="/fresh-fish-and-meat-premium-quality.jpg"
                alt="Fresh Premium Fish and Meat"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
