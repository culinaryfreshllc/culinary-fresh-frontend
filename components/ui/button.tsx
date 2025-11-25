'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { useRipple } from '@/lib/hooks/use-ripple'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-95",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:border-primary/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button(
  {
    className,
    variant,
    size,
    asChild = false,
    onClick,
    children,
    ...props
  }: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
) {
  const Comp = asChild ? Slot : 'button'
  const createRipple = useRipple()
  const prefersReducedMotion = useReducedMotion()
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!prefersReducedMotion && variant !== 'link') {
      createRipple(e)
    }
    onClick?.(e)
  }

  // Magnetic effect on hover
  React.useEffect(() => {
    if (prefersReducedMotion || variant === 'link' || !buttonRef.current) return

    const button = buttonRef.current
    let isHovering = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return

      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * 0.15
      const deltaY = (e.clientY - centerY) * 0.15

      button.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    }

    const handleMouseEnter = () => {
      isHovering = true
    }

    const handleMouseLeave = () => {
      isHovering = false
      button.style.transform = 'translate(0, 0)'
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseenter', handleMouseEnter)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseenter', handleMouseEnter)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [prefersReducedMotion, variant])

  return (
    <Comp
      ref={buttonRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
