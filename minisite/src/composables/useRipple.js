import { ref, h } from 'vue'

/**
 * useRipple — shared ripple-on-click composable.
 *
 * Returns:
 *   spawnRipple(e)  — call from onClick, spawns a ripple at click position
 *   renderRipples() — returns an array of ripple VNodes to spread into your template
 */
export function useRipple() {
  const ripples = ref([])
  let nextId = 0

  function spawnRipple(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top
    const id = nextId++
    ripples.value.push({ id, x, y })
    setTimeout(() => {
      ripples.value = ripples.value.filter(r => r.id !== id)
    }, 520)
  }

  function renderRipples() {
    return ripples.value.map(r =>
      h('div', {
        key: r.id,
        class: 'card-ripple',
        style: {
          left: r.x + 'px',
          top: r.y + 'px',
          width: '20px',
          height: '20px',
          marginLeft: '-10px',
          marginTop: '-10px',
        },
      })
    )
  }

  return { spawnRipple, renderRipples }
}
