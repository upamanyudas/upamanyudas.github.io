import { ref } from 'vue'

/**
 * Restart an element's CSS animations in place.
 * Re-keying the node instead would tear it out from under the pointer,
 * which retriggers mouseenter forever and eats the card's click.
 */
export function useAnimReplay() {
  const animEl = ref(null)

  function replay() {
    animEl.value?.getAnimations({ subtree: true })
      .forEach(a => { a.currentTime = 0; a.play() })
  }

  return { animEl, replay }
}
