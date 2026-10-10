/**
 * Plant search synonyms and typo normalization utility
 * Expands search queries to include common botanical and vernacular names
 */

export const PLANT_SYNONYMS: Record<string, string[]> = {
  'snake plant': ['sansevieria', 'mother-in-law', 'sansevieria trifasciata'],
  'sansevieria': ['snake plant', 'mother-in-law'],
  'money plant': ['pothos', 'epipremnum', 'golden pothos', 'devil ivy'],
  'pothos': ['money plant', 'epipremnum'],
  'desert rose': ['adenium', 'adenium obesum'],
  'adenium': ['desert rose', 'adenim'],
  'adenim': ['adenium', 'desert rose'],
  'rubber plant': ['ficus elastica', 'rubber tree'],
  'ficus': ['bonsai', 'ficus elastica', 'ficus microcarpa', 'fig'],
  'zz plant': ['zamioculcas', 'zanzibar gem'],
  'zamioculcas': ['zz plant'],
  'peace lily': ['spathiphyllum'],
  'spathiphyllum': ['peace lily'],
  'spider plant': ['chlorophytum'],
  'jade plant': ['crassula', 'crassula ovata', 'lucky plant'],
  'crassula': ['jade plant'],
  'aloe': ['aloe vera', 'aloevera'],
  'aloevera': ['aloe vera', 'aloe'],
  'bonzai': ['bonsai'],
  'bonsai': ['bonzai', 'ficus', 'juniper'],
  'succulent': ['succulents', 'suclent', 'cactus'],
  'suclent': ['succulent'],
  'air purifier': ['sansevieria', 'snake plant', 'peace lily', 'spider plant', 'areca palm'],
  'indoor plant': ['indoor', 'houseplant', 'low light'],
  'outdoor plant': ['outdoor', 'flowering', 'full sun'],
}

/**
 * Expands a search query into candidate terms including botanical & common synonyms
 */
export function expandSearchTerms(query: string): string[] {
  if (!query) return []
  const q = query.toLowerCase().trim()
  const terms = new Set<string>([q])

  // Direct phrase match in dictionary
  for (const [key, synonyms] of Object.entries(PLANT_SYNONYMS)) {
    if (q === key || q.includes(key) || key.includes(q)) {
      terms.add(key)
      synonyms.forEach((s) => terms.add(s))
    }
  }

  // Token match
  const tokens = q.split(/\s+/).filter(Boolean)
  for (const token of tokens) {
    terms.add(token)
    for (const [key, synonyms] of Object.entries(PLANT_SYNONYMS)) {
      if (token === key || key.includes(token)) {
        terms.add(key)
        synonyms.forEach((s) => terms.add(s))
      }
    }
  }

  return Array.from(terms)
}

/**
 * Matches a product against expanded search terms
 */
export function matchesSearch(product: any, query: string): boolean {
  if (!query) return true
  const terms = expandSearchTerms(query)

  const textToSearch = [
    product.title,
    product.description,
    product.plantType,
    product.category?.name,
    product.category?.slug,
    product.seller?.businessName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return terms.some((term) => textToSearch.includes(term.toLowerCase()))
}
