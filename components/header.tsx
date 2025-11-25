"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"
import gsap from "gsap"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const cartRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initial animations
  useEffect(() => {
    if (prefersReducedMotion || !headerRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in from top
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      })

      // Stagger menu items
      gsap.from(navItemsRef.current.filter((el): el is HTMLAnchorElement => el !== null), {
        opacity: 0,
        y: -10,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      })
    }, headerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  // Logo pulse animation
  useEffect(() => {
    if (prefersReducedMotion || !logoRef.current) return

    const logo = logoRef.current

    const handleMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.05,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(2)",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    logo.addEventListener("mouseenter", handleMouseEnter)
    logo.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      logo.removeEventListener("mouseenter", handleMouseEnter)
      logo.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [prefersReducedMotion])

  // Cart bounce effect
  useEffect(() => {
    if (prefersReducedMotion || !cartRef.current) return

    const cart = cartRef.current

    const handleMouseEnter = () => {
      gsap.to(cart.querySelector("svg"), {
        y: -3,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      })
    }

    cart.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      cart.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [prefersReducedMotion])

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border" : "bg-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div ref={logoRef} className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-all">
            <span className="text-white font-bold text-lg">CF</span>
          </div>
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            Culinary Fresh
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                navItemsRef.current[index] = el
              }}
              className="text-foreground/70 hover:text-primary font-medium transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500 ease-out" />
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button
            ref={cartRef}
            className="p-2 hover:bg-secondary/10 rounded-lg transition-all hidden sm:block group"
          >
            <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-secondary transition-colors" />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border animate-slide-in-up">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
