"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/product-filters"
import { ProductCard } from "@/components/product-card"
import { products, categories, sortOptions } from "@/lib/product-data"
import { ChevronDown } from "lucide-react"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSort, setSelectedSort] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Sort
    switch (selectedSort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.reverse()
        break
      default:
        // featured (default order)
        break
    }

    return result
  }, [selectedCategory, selectedSort])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Premium Selection</h1>
            <p className="text-foreground/60 max-w-2xl">
              Handpicked premium fish and meat from trusted suppliers. All products are fresh, quality-checked, and
              delivered with our freshness guarantee.
            </p>
          </div>

          {/* Products Section with Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <ProductFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {/* Sort Controls */}
                <div className="flex items-center justify-between mb-8">
                  <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                  </p>

                  <div className="relative">
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-card border border-border rounded-lg text-foreground cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground mb-4">No products found</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("All")
                        setSelectedSort("featured")
                      }}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Simple Products Grid (when filters are hidden) */}
          {!showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
              {products.slice(0, 4).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          {/* Show Filters Button */}
          {!showFilters && (
            <div className="text-center mb-8">
              <button
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mt-20"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}