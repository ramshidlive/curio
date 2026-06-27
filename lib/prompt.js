import { pickRandomCategories } from './dailyCategories.js'

export function buildCurioPrompt(editionDate, categories) {
  const categoryBlock = `Today's edition (${editionDate}) is assigned these 5 categories — one fact each, in this order. Use these exact strings as the JSON "category" field:

1. ${categories[0]}
2. ${categories[1]}
3. ${categories[2]}
4. ${categories[3]}
5. ${categories[4]}

Each edition randomly draws a fresh category mix. Match each assigned category to a story that fits the editorial mix above — current-event surprise or hidden everyday design logic.`

  return `You are the automated backend engine for "Curio", a minimal daily micro-learning app.

Today's edition date: ${editionDate}

Search the live internet for 5 completely true, verified, highly engaging stories. We want readers to think: "Holy cow, I never knew that."

EDITORIAL MIX (across all 5 items):
Include a balance of:
1. High-stakes current events — surprising real-world pivots, geopolitical quirks, or cultural shifts from the last 1–3 years.
2. Timeless everyday design logic — the hidden human safety, engineering, or psychological reasons behind common objects, vehicles, buildings, or daily routines people never question.

At least 2 items should lean toward current events; at least 2 should reveal why something ordinary was designed or works the way it does. The fifth can be either.

CRITICAL CONSTRAINTS:
1. Every fact MUST be real and verifiable via search. Do not invent companies, laws, or products.
2. For everyday-design stories: do NOT write dry textbook lectures. Reveal a specific, surprising reason — a safety tradeoff, a regulatory constraint, a human-behavior insight — tied to something people encounter regularly.
3. Strictly avoid corporate news, tech chip announcements, software updates, and generic "how X works" explainers with no hook.
4. Focus on street-level human interest and structural pivots, not academic summaries.

Tone and depth examples:
- "The Real Reason Modern Cars Always Keep Their Front Lights On" — DRLs exist so other drivers see you faster in daylight, not so you can see the road (Automotive/Safety)
- "The Life-Saving Geometry Behind a Motorcycle's Gear Shift" — 1-N-2-3-4-5 lets riders stomp down to first in emergencies without hunting for neutral (Design)
- "Why Olympic Athletes Secretly Bought Their Own Portable AC Units to the Paris Games" (Sports/Current events)
- "Why Millions of People in South Korea Suddenly Became One to Two Years Younger Overnight" (World/Current events)
- "The Secret Psychology Behind a Grocery Store's Layout" — milk at the back forces you past high-margin impulse buys (Lifestyle/Design)

${categoryBlock}
Assign id values 1 through 5 in that order.

Return the response STRICTLY as a raw, valid JSON array of objects. Do not include markdown formatting, code block wrappers (like \`\`\`json), or conversational filler text. Follow this exact schema:
[
  {
    "id": 1,
    "title": "Title here...",
    "category": "Category here...",
    "story": "1-2 paragraph narrative here..."
  }
]`
}

export function buildPromptForEdition(editionDate, avoidCategories = []) {
  const categories = pickRandomCategories({ avoidCategories })
  return {
    categories,
    prompt: buildCurioPrompt(editionDate, categories),
  }
}
