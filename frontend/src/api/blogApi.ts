/**
 * Blog data layer.
 *
 * The backend does NOT expose a blog API yet, so this module serves mock
 * content. It is intentionally shaped like an async data source: when a blog
 * endpoint exists, only this file needs to change (fetch instead of Promise.resolve).
 */

import { POSTS } from '../data/posts'
import type { BlogPost } from '../data/posts'

export const BLOG_CATEGORIES = ['All', ...Array.from(new Set(POSTS.map((p) => p.category)))] as const

export function getAllPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug)
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const sameCategory = (x: BlogPost) => (x.category === post.category ? 1 : 0)
      return sameCategory(b) - sameCategory(a)
    })
    .slice(0, limit)
}
