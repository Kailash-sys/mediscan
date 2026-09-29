import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { BlogPost } from '../../data/posts'
import { Badge } from '../ui/Badge'
import { formatDate } from '../../utils/format'

interface BlogCardProps {
  post: BlogPost
  /** Featured posts get a large horizontal layout. */
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const meta = (
    <>
      <span>{post.author}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" aria-hidden />
        {post.readingTimeMinutes} min read
      </span>
    </>
  )

  if (featured) {
    return (
      <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.06]">
        <Link to={`/blogs/${post.slug}`} className="focus-ring grid md:grid-cols-2">
          <div className="aspect-[16/10] overflow-hidden bg-slate-100 md:aspect-auto md:min-h-[280px]">
            <img
              src={post.coverImage}
              alt=""
              className="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-50 text-teal-700 ring-1 ring-teal-200">Featured</Badge>
              <Badge>{post.category}</Badge>
            </div>
            <h3 className="mt-3 font-display text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-sky-700 sm:text-2xl">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">{meta}</div>
          </div>
          <span className="sr-only">Read article</span>
        </Link>
      </article>
    )
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.06]">
      <Link to={`/blogs/${post.slug}`} className="focus-ring flex h-full flex-col">
        <div className="aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt=""
            className="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <Badge>{post.category}</Badge>
          <h3 className="mt-3 font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-sky-700">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">{meta}</div>
        </div>
        <span className="sr-only">Read article</span>
      </Link>
    </article>
  )
}
