"use client"

import { useTransition } from "react"

interface Category {
  id: string
  name: string
}

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function ProductFilters({ categories, selectedCategory, onCategoryChange }: ProductFiltersProps) {
  const [isPending, startTransition] = useTransition()

  const handleCategoryClick = (categoryId: string | null) => {
    startTransition(() => {
      onCategoryChange(categoryId)
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Category Filter */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <h3 className="font-bold text-lg mb-4 text-foreground">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryClick(null)}
            disabled={isPending}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${selectedCategory === null
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-foreground hover:bg-primary/10"
              } disabled:opacity-50`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              disabled={isPending}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${selectedCategory === category.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-foreground hover:bg-primary/10"
                } disabled:opacity-50`}
            >
              {category.name}
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