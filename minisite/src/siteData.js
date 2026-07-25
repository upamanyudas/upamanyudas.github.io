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

/** Years since profile.career_start — recomputed on every page load. */
export const yearsExp = new Date().getFullYear() - profile.career_start

/** Resolve `{years}` / `{start}` placeholders anywhere in authored copy. */
export function fillYears(v) {
  if (typeof v === 'string') return v.replace(/\{years\}/g, yearsExp).replace(/\{start\}/g, profile.career_start)
  if (Array.isArray(v)) return v.map(fillYears)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillYears(x)]))
  return v
}

/** Rendered HTML of a content <template> (about bio, quotes, case studies). */
export function templateHTML(id) {
  const tpl = document.getElementById(id)
  return tpl ? tpl.innerHTML : ''
}
