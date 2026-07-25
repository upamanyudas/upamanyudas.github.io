/**
 * siteData.js — Jekyll-rendered content, parsed once.
 * The #minisite-data JSON script tag is emitted by _layouts/minisite.html
 * from _data/minisite/*.yml and the _case_studies collection.
 */
const data = JSON.parse(document.getElementById('minisite-data').textContent)

export const profile     = data.profile
export const stats       = data.stats
export const layouts     = data.layouts
export const caseStudies = data.caseStudies

/** Rendered HTML of a content <template> (about bio, quotes, case studies). */
export function templateHTML(id) {
  const tpl = document.getElementById(id)
  return tpl ? tpl.innerHTML : ''
}
