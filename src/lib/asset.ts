/** Resolve a public asset path against the Vite base (works on GH Pages + custom domain). */
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '')
