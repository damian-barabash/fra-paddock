/**
 * Two pages share components: the public home page (/) and the members' platform (/klub/).
 * Each page's <html data-root> says how to get back to the site root from it.
 */
export const ROOT = document.documentElement.dataset.root || './'

/** Link to a place on the home page, e.g. home('#klub'). */
export const home = (hash = '') => (ROOT === './' ? hash || '#top' : `${ROOT}${hash}`)

/** The members' platform (login screen when signed out). */
export const clubUrl = `${ROOT}klub/`

/** Opens the application form (pop-up on the home page). */
export const APPLY_EVENT = 'fpc:apply'
export const openApply = () => window.dispatchEvent(new Event(APPLY_EVENT))
