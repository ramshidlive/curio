import { Bookmark, ExternalLink, Share2 } from 'lucide-react'

export default function FactCard({ fact }) {
  return (
    <article className="px-1 pt-0 pb-2">
      <h2 className="text-base font-semibold leading-snug text-stone-900">
        {fact.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        {fact.story}
      </p>
      <div className="mt-5 flex items-center gap-3">
        <span className="shrink-0 text-xs text-stone-600">
          {fact.category}
        </span>
        {fact.source && (
          <a
            href={fact.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs text-stone-400 transition-colors hover:text-stone-600"
          >
            <ExternalLink size={13} />
            {fact.source.label}
          </a>
        )}
        <div className="flex-1" />
        <button
          type="button"
          aria-label="Share"
          className="shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
        >
          <Share2 size={18} />
        </button>
        <button
          type="button"
          aria-label="Bookmark"
          className="shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
        >
          <Bookmark size={18} />
        </button>
      </div>
    </article>
  )
}
