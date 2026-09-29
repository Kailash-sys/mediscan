import { useMemo, useState } from 'react'
import { BookOpen, Search, X } from 'lucide-react'
import { BlogCard } from '../components/blog/BlogCard'
import { EmptyState } from '../components/ui/EmptyState'
import { BLOG_CATEGORIES, getAllPosts } from '../api/blogApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Blogs() {
  useDocumentTitle('Health Blog')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')

  const allPosts = useMemo(() => getAllPosts(), [])
  const featured = allPosts.find((p) => p.featured) ?? allPosts[0]
  const regular = allPosts.filter((p) => p.slug !== featured?.slug)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return regular.filter((post) => {
      const matchesCategory = category === 'All' || post.category === category
      const matchesQuery =
        q.length === 0 ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [regular, category, query])

  const showFeatured =
    (category === 'All' && query.trim().length === 0) ||
    (featured !== undefined &&
      (featured.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        featured.tags.some((t) => t.toLowerCase().includes(query.trim().toLowerCase()))) &&
      (category === 'All' || featured.category === category))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-widest text-sky-600 uppercase">Health Library</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Practical guides for safer medication use
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Plain-language articles on interactions, reading labels, generics, and getting the most
          from your pharmacist — written to complement, never replace, professional advice.
        </p>
      </div>

      {/* Search + categories */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, topics, tags…"
            aria-label="Search articles"
            className="focus-ring w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="focus-ring absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === c
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-10 space-y-10">
        {showFeatured && featured && (
          <section aria-label="Featured article">
            <BlogCard post={featured} featured />
          </section>
        )}

        {filtered.length > 0 ? (
          <section aria-label="All articles">
            <h2 className="text-sm font-semibold text-slate-900">
              {category === 'All' ? 'Latest articles' : category}
              <span className="ml-2 font-normal text-slate-400">
                ({filtered.length} {filtered.length === 1 ? 'article' : 'articles'})
              </span>
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ) : (
          !showFeatured && (
            <EmptyState
              icon={BookOpen}
              title="No articles match your search"
              description="Try a different keyword or category — or clear the filters to browse everything."
            />
          )
        )}
      </div>
    </div>
  )
}
