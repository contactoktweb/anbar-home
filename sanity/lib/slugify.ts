/**
 * Sanity Slugify Utility
 * Strips all accents/tildes, special characters, and formats clean SEO-friendly URLs.
 */

export function slugify(input: string | null | undefined): string {
  if (!input) return ''

  return input
    .toString()
    .toLowerCase()
    .normalize('NFD') // Decompose combined graphemes (e.g., 'ó' -> 'o' + '\u0301')
    .replace(/[\u0300-\u036f]/g, '') // Strip all accent marks/tildes
    .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric chars except space & hyphen
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with a single hyphen
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
    .slice(0, 96)
}

export default slugify
