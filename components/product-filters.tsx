"use client"

import { useTransition } from "react"
import { categories } from "@/lib/product-data"

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function ProductFilters({ selectedCategory, onCategoryChange }: ProductFiltersProps) {
  const [isPending, startTransition] = useTransition()

  const handleCategoryClick = (category: string) => {
    startTransition(() => {
      onCategoryChange(category)
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Category Filter */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <h3 className="font-bold text-lg mb-4 text-foreground">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              disabled={isPending}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${selectedCategory === category
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-foreground hover:bg-primary/10"
                } disabled:opacity-50`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <h3 className="font-bold text-lg mb-4 text-foreground">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={rating >= 4}
                className="w-4 h-4 rounded border-primary cursor-pointer"
              />
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-secondary rounded-full" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">& up</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}