import type { AppState } from '../store/useCollageStore'
import { renderCollage } from './canvasRenderer'

function getFilename(format: 'png' | 'jpg'): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const YYYYMMDD = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const HHmmss = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `collage_${YYYYMMDD}_${HHmmss}.${format}`
}

export async function exportCollage(
  _sourceCanvas: HTMLCanvasElement,
  state: AppState,
  format: 'png' | 'jpg',
  quality: number,
  scale: number
): Promise<void> {
  const exportCanvas = document.createElement('canvas')
  const scaledState: AppState = {
    ...state,
    canvasWidth: state.canvasWidth * scale,
    canvasHeight: state.canvasHeight * scale,
    borderWidth: state.borderWidth * scale,
    borderRadius: state.borderRadius * scale,
  }

  await new Promise<void>((resolve) => {
    let resolved = false
    function doRender() {
      if (!resolved) {
        renderCollage(exportCanvas, scaledState, () => {
          if (!resolved) {
            resolved = true
            renderCollage(exportCanvas, scaledState, undefined, true)
            resolve()
          }
        }, true)
      }
    }
    doRender()
    setTimeout(() => {
      if (!resolved) {
        resolved = true
        renderCollage(exportCanvas, scaledState, undefined, true)
        resolve()
      }
    }, 300)
  })

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
  const jpgQuality = format === 'jpg' ? quality / 100 : undefined

  exportCanvas.toBlob(
    (blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = getFilename(format)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    },
    mimeType,
    jpgQuality
  )
}
