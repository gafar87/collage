/**
 * Simple registry to share the canvas element between CollageCanvas and export utilities.
 */
let _canvas: HTMLCanvasElement | null = null

export function setCanvasElement(canvas: HTMLCanvasElement | null) {
  _canvas = canvas
}

export function getCanvasElement(): HTMLCanvasElement | null {
  return _canvas
}
