import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, CalendarDays, ScanLine, User } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { BlogCard } from '../components/blog/BlogCard'
import { getPostBySlug, getRelatedPosts } from '../api/blogApi'
import { formatDate } from '../utils/format'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function BlogDetails() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  // Set the tab title from the post (hook rules are satisfied because this
  // component does not conditionally skip hooks).
  useDocumentTitle(post ? post.title : 'Article not found')
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Article not found</h1>
        <p className="mt-3 text-slate-600">
          The article you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/blogs" className="focus-ring mt-6 inline-block rounded-xl">
          <Button variant="secondary">
            <ArrowLeft className="size-4" aria-hidden />
            Back to all articles
          </Button>
        </Link>
      </div>
    )
  }

  const related = getRelatedPosts(post)

  return (
    <article className="bg-white">
      {/* Cover */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <img src={post.coverImage} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8 sm:px-6">
          <Badge className="bg-white/95 text-sky-700 ring-1 ring-white/50">{post.category}</Badge>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-100 pb-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-sky-50 text-sky-700">
              <User className="size-4" aria-hidden />
            </span>
            <span>
              <span className="font-semibold text-slate-900">{post.author}</span>
              <span className="block text-xs text-slate-400">{post.authorRole}</span>
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        {/* Body */}
        <div className="mt-8 space-y-8">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((para, j) => (
                <p key={j} className={`leading-relaxed text-slate-700 ${section.heading || j > 0 ? 'mt-4' : ''}`}>
                  {para}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-slate-700">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sky-500" aria-hidden />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
          {post.tags.map((tag) => (
            <Badge key={tag} className="bg-slate-100 text-slate-600 ring-1 ring-slate-200">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-sky-700 to-teal-600 p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold text-white">Check your own medicines</h2>
          <p className="mt-2 text-sm text-sky-50/90">
            Scan your medicine packaging and get an interaction summary in under two minutes.
          </p>
          <Link to="/analyze" className="focus-ring mt-5 inline-block rounded-xl">
            <Button className="bg-white text-sky-700 shadow-none hover:bg-sky-50">
              <ScanLine className="size-4" aria-hidden />
              Open Interaction Checker
            </Button>
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold text-slate-900">Related articles</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* Back */}
        <div className="mt-12 border-t border-slate-100 pt-6">
          <Link to="/blogs" className="focus-ring inline-block rounded-xl">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4" aria-hidden />
              Back to all articles
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
