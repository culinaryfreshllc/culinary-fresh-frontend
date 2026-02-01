"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ChevronDown, Loader2 } from "lucide-react"
import axiosInstance from "@/lib/axios"

interface Category {
  id: string
  name: string
}

interface ApiProduct {
  id: string
  name: string
  views: number
  status: string
  featured: boolean
  categoryIds: string[]
  imageUrl: string
  rating: number | null
  reviews: number | null
  tag: string | null
  description: string | null
  categories: Category[]
}

interface DisplayProduct {
  id: number
  name: string
  category: string
  price: number
  image: string
  rating: number
  reviews: number
  tag: string
  description: string
  weight: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
]

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState("featured")
  const [products, setProducts] = useState<DisplayProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const observerTarget = useRef<HTMLDivElement>(null)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories")
        if (response.data && response.data.data) {
          setCategories(response.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Map API product to display product
  const mapProduct = (item: ApiProduct): DisplayProduct => ({
    id: parseInt(item.id, 16) || Math.random(),
    name: item.name,
    category: item.categories?.[0]?.name || "Uncategorized",
    price: 24.99, // Default price since API doesn't provide it
    image: item.imageUrl,
    rating: item.rating || 4.5,
    reviews: item.reviews || 0,
    tag: item.tag || (item.featured ? "Featured" : item.categories?.[0]?.name || "Fresh"),
    description: item.description || `Premium quality ${item.name.toLowerCase()}, fresh and ready to cook.`,
    weight: "1 lb",
  })

  // Fetch products
  const fetchProducts = useCallback(async (page: number, categoryId?: string | null, append = false) => {
    try {
      if (!append) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const params: any = {
        page,
        limit: 12,
      }

      if (categoryId) {
        params.categoryId = categoryId
      }

      const response = await axiosInstance.get("/products", { params })

      if (response.data && response.data.data) {
        const mappedProducts = response.data.data.map(mapProduct)

        if (append) {
          setProducts(prev => [...prev, ...mappedProducts])
        } else {
          setProducts(mappedProducts)
        }

        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Initial load and category change
  useEffect(() => {
    setCurrentPage(1)
    fetchProducts(1, selectedCategory, false)
  }, [selectedCategory, fetchProducts])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.hasNextPage && !loadingMore) {
          const nextPage = currentPage + 1
          setCurrentPage(nextPage)
          fetchProducts(nextPage, selectedCategory, true)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [pagination, loadingMore, currentPage, selectedCategory, fetchProducts])

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (selectedSort) {
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Category Filter */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4 text-foreground">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${selectedCategory === null
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-foreground hover:bg-primary/10"
                        }`}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${selectedCategory === category.id
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-muted text-foreground hover:bg-primary/10"
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4 text-foreground">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer">
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
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort Controls */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{products.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{pagination?.total || 0}</span> products
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

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">Loading products...</p>
                  </div>
                </div>
              ) : sortedProducts.length > 0 ? (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                    {sortedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {/* Infinite Scroll Trigger */}
                  <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
                    {loadingMore && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-muted-foreground text-sm">Loading more products...</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">No products found</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
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
        </div>
      </main>
      <Footer />
    </>
  )
}