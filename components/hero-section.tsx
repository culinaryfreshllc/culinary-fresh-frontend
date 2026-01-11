"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, Clock, Award } from "lucide-react"

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



      // Animate background gradient with more intensity
      if (!isMobile) {
        gsap.to(backgroundRef.current, {
          backgroundPosition: "100% 100%",
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }

      // Split title into words for advanced animation
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(".word")
        tl.from(words, {
          opacity: 0,
          y: 100,
          rotationX: -90,
          transformOrigin: "top center",
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
        })
      }

      // Animate subtitle with blur effect
      tl.from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
          filter: "blur(10px)",
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8",
      )

      // Animate CTA with elastic bounce
      tl.from(
        ctaRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.6",
      )



      // Scroll-triggered stats animation with counter
      if (statsRef.current) {
        const statElements = statsRef.current.querySelectorAll(".stat-item")
        gsap.from(statElements, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          scale: 0.8,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(2)",
        })
      }

      // Enhanced parallax effect on scroll
      if (!isMobile) {
        gsap.to(titleRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
          y: -80,
          opacity: 0.5,
          scale: 0.95,
        })



        gsap.to(backgroundRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          opacity: 0.3,
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-32 pb-12  md:pb-16 overflow-hidden"
    >
      {/* Animated background with morphing gradient */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-secondary/20 -z-10 animate-morph-gradient"
        style={{
          backgroundSize: "400% 400%",
          backgroundPosition: "0% 0%",
        }}
      />



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div ref={titleRef} className="space-y-4">
              <div className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold ${prefersReducedMotion ? '' : 'hover-lift'}`}>
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-shimmer">Premium Quality Guaranteed</span>
              </div>
              <h1 className="hero-title text-foreground">
                <div className="word inline-block mr-3">Fresh</div>
                <div className="word inline-block mr-3">Premium</div>
                <div className="block mt-2">
                  <span className="word inline-block mr-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-shimmer">
                    Fish
                  </span>
                  <span className="word inline-block mr-3 text-foreground/90">&</span>
                  <span className="word inline-block bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent text-shimmer">
                    Meat
                  </span>
                </div>
              </h1>
            </div>

            <div ref={subtitleRef} className="hero-subtitle text-foreground/70 leading-relaxed">
              Discover the finest selection of premium fresh fish and meat delivered directly to your door. Sourced from
              trusted suppliers with uncompromising quality standards.
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="w-full sm:w-auto magnetic">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold group relative overflow-hidden spotlight"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Explore Products
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto magnetic">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full glass border-2 border-primary/30 text-foreground hover:bg-primary/10 backdrop-blur-xl group"
                >
                  <span className="flex items-center justify-center">
                    Learn More
                  </span>
                </Button>
              </Link>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[
                { number: "500+", label: "Happy Customers", Icon: Users },
                { number: "24/7", label: "Fresh Guarantee", Icon: Clock },
                { number: "100%", label: "Premium Quality", Icon: Award },
              ].map((stat, index) => (
                <div key={index} className="stat-item text-center md:text-left  cursor-default glass rounded-xl p-4 hover-lift">
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    <stat.Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-foreground/60 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image with enhanced effects */}
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
