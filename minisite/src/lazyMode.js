/**
 * lazyMode.js — shared reactive toggle for smooth/lazy effects.
 *
 * Import { isLazy, toggleLazy } wherever you need it.
 *   isLazy.value === true  → smooth lerp, eased scrolls
 *   isLazy.value === false → instant follow, instant scrolls
 */
import { ref } from 'vue'

export const isLazy = ref(true)

export function toggleLazy() {
  isLazy.value = !isLazy.value
}
