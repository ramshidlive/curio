import { randomInt } from 'node:crypto'

/** Topic pool — edit this list to add or remove categories. */
export const CATEGORY_POOL = [
  'Automotive',
  'Tech',
  'Design',
  'Sports',
  'World',
  'Science',
  'Engineering',
  'Lifestyle',
  'History',
  'Business',
  'Food',
  'Music',
  'Space',
  'Fashion',
  'Startups',
]

/**
 * Randomly pick `count` unique categories from the pool.
 * Skips categories used in recent editions when possible.
 */
export function pickRandomCategories({
  avoidCategories = [],
  count = 5,
} = {}) {
  const avoid = new Set(
    avoidCategories.map((category) => category.trim().toLowerCase()),
  )

  let pool = CATEGORY_POOL.filter(
    (category) => !avoid.has(category.toLowerCase()),
  )

  if (pool.length < count) {
    pool = [...CATEGORY_POOL]
  }

  const shuffled = [...pool]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}
