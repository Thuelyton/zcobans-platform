/**
 * Slug utility for generating URL-friendly slugs
 */

/**
 * Map of accented characters to their ASCII equivalents
 */
const ACCENT_MAP: Record<string, string> = {
  'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
  'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
  'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
  'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
  'ç': 'c', 'ñ': 'n',
  'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'Ä': 'A',
  'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
  'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
  'Ó': 'O', 'Ò': 'O', 'Õ': 'O', 'Ô': 'O', 'Ö': 'O',
  'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
  'Ç': 'C', 'Ñ': 'N',
}

/**
 * Removes accents from a string
 */
function removeAccents(str: string): string {
  return str.replace(/[^\u0000-\u007E]/g, (char) => ACCENT_MAP[char] || char)
}

/**
 * Generates a URL-friendly slug from a string
 * 
 * Rules:
 * - Converts to lowercase
 * - Removes accents
 * - Replaces spaces with hyphens
 * - Removes special characters (keeps only alphanumeric and hyphens)
 * - Removes leading/trailing hyphens
 * - Collapses multiple hyphens into one
 * - Returns empty string if no valid characters remain
 */
export function generateSlug(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  const slug = input
    .toLowerCase()
    .trim()
    // Remove accents
    .replace(/[^\u0000-\u007E]/g, (char) => ACCENT_MAP[char] || char)
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove characters that are not alphanumeric or hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')

  return slug
}

/**
 * Validates a slug format
 * 
 * Valid slug:
 * - Only contains lowercase letters, numbers, and hyphens
 * - Does not start or end with a hyphen
 * - Does not contain consecutive hyphens
 * - Is not empty
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false
  }

  // Must not be empty after trimming
  if (slug.trim().length === 0) {
    return false
  }

  // Must only contain lowercase letters, numbers, and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false
  }

  // Must not start or end with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return false
  }

  // Must not contain consecutive hyphens
  if (slug.includes('--')) {
    return false
  }

  return true
}
