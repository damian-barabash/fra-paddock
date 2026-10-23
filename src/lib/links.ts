/**
 * The site has two pages: the home page (/) and the application page (/aplikacja/).
 * Each page's <html data-page> tells which one is running, so shared parts
 * (menu, footer, buttons) can build links that work from either page.
 */
export const isApplyPage = document.documentElement.dataset.page === 'aplikacja'

/** Path from the current page back to the site root. */
export const ROOT = isApplyPage ? '../' : './'

/** Link to a place on the home page, e.g. home('#klub'). */
export const home = (hash = '') => (isApplyPage ? `../${hash}` : hash || '#top')

/** Link to the application page, optionally to a section on it, e.g. applyPage('#zasady'). */
export const applyPage = (hash = '') => (isApplyPage ? hash || '#aplikacja' : `aplikacja/${hash}`)
