/** True when this browser can create a WebGL context. Kept apart from the scene so three.js loads lazily. */
export function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
