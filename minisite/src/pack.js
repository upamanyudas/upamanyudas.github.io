/**
 * pack.js — bento auto-packer.
 * Cards in the active filter ("bright") pack first via dense 2-D placement;
 * the rest ("dim") always start on a fresh row below. `flex` cards grow to
 * swallow leftover cells so a block stays solid — that's what lets dim cards
 * sit strictly below without gaps. Returns key → {col, row, dim}, each a
 * `<start> / span <n>` CSS grid string.
 */

const occupied = (grid, r, c) => grid[r] && grid[r][c]

function fits(grid, r, c, w, h, cols) {
  if (c + w > cols) return false
  for (let rr = r; rr < r + h; rr++)
    for (let cc = c; cc < c + w; cc++)
      if (occupied(grid, rr, cc)) return false
  return true
}

function fill(grid, r, c, w, h, key) {
  for (let rr = r; rr < r + h; rr++) {
    grid[rr] = grid[rr] || []
    for (let cc = c; cc < c + w; cc++) grid[rr][cc] = key
  }
}

// Place a run of cards from `startRow` down, scanning left→right, top→bottom.
function packGroup(grid, pos, cards, cols, startRow) {
  for (const card of cards) {
    for (let r = startRow; ; r++) {
      let done = false
      for (let c = 0; c < cols; c++) {
        if (fits(grid, r, c, card.w, card.h, cols)) {
          fill(grid, r, c, card.w, card.h, card.key)
          pos[card.key] = { r, c, w: card.w, h: card.h }
          done = true
          break
        }
      }
      if (done) break
    }
  }
}

// Grow flex cards (widen first, then heighten into interior gaps) to fill
// empty cells within [rowStart, rowEnd). rowEnd is fixed, so growth never
// extends the block — empty cells only ever decrease, so this converges.
function flexFill(grid, pos, cards, cols, rowStart, rowEnd) {
  const flex = new Set(cards.filter(c => c.flex).map(c => c.key))
  if (!flex.size) return

  const widenable = (p) =>
    p.c + p.w < cols &&
    [...Array(p.h)].every((_, i) => !occupied(grid, p.r + i, p.c + p.w))
  const heightenable = (p) =>
    p.r + p.h < rowEnd &&
    [...Array(p.w)].every((_, i) => !occupied(grid, p.r + p.h, p.c + i))
  const widen = (p, key) => { for (let i = 0; i < p.h; i++) grid[p.r + i][p.c + p.w] = key; p.w++ }
  const heighten = (p, key) => { for (let i = 0; i < p.w; i++) grid[p.r + p.h][p.c + i] = key; p.h++ }

  // Apply one gap-filling move, scanning top→bottom, left→right. A widen that
  // makes a card span every column ("full width") is a last resort: skipped
  // unless `full` is set, so partial widens and heightens get first refusal.
  const sweep = (full) => {
    for (let r = rowStart; r < rowEnd; r++) {
      for (let c = 0; c < cols; c++) {
        if (occupied(grid, r, c)) continue
        const left = c > 0 && occupied(grid, r, c - 1)
        if (left && flex.has(left) && pos[left].c + pos[left].w === c && widenable(pos[left])) {
          const p = pos[left]
          if (full || p.w + 1 < cols) { widen(p, left); return true }
        }
        const up = r > 0 && occupied(grid, r - 1, c)
        if (up && flex.has(up) && pos[up].r + pos[up].h === r && heightenable(pos[up])) {
          heighten(pos[up], up); return true
        }
      }
    }
    return false
  }

  // Exhaust partial fills everywhere; only then allow a full-width stretch.
  while (sweep(false) || sweep(true)) {}
}

export function packLayout(entries, filter, cols) {
  const inFilter = e => filter === 'All' || e.filters.includes(filter)
  const bright = entries.filter(inFilter)
  const dim    = entries.filter(e => !inFilter(e))

  const grid = [], pos = {}
  packGroup(grid, pos, bright, cols, 0)
  flexFill(grid, pos, bright, cols, 0, grid.length)

  const brightRows = grid.length
  packGroup(grid, pos, dim, cols, brightRows)
  flexFill(grid, pos, dim, cols, brightRows, grid.length)

  const out = {}
  for (const e of entries) {
    const p = pos[e.key]
    out[e.key] = {
      col: `${p.c + 1} / span ${p.w}`,
      row: `${p.r + 1} / span ${p.h}`,
      dim: !inFilter(e),
    }
  }
  return out
}
