import { ROOT } from './links'

/** Resolve a public asset path from the site root (works on both pages, GH Pages and a custom domain). */
export const asset = (p: string) => ROOT + p.replace(/^\//, '')
