import type { AppState } from '../store/useCollageStore'
import { getLayout } from '../layouts/layouts'
import { getCoverParams } from './imageCrop'

const imageCache = new Map<string, HTMLImageElement>()

function getOrLoadImage(src: string, onLoad: () => void): HTMLImageElement | null {
  if (!imageCache.has(src)) {
    const img = new Image()
    img.onload = onLoad
    img.src = src
    imageCache.set(src, img)
  }
  const img = imageCache.get(src)!
  return img.complete && img.naturalWidth > 0 ? img : null
}

function drawCheckerboard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const size = 16
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  for (let cx = x; cx < x + w; cx += size) {
    for (let cy = y; cy < y + h; cy += size) {
      const isEven = (Math.floor((cx - x) / size) + Math.floor((cy - y) / size)) % 2 === 0
      ctx.fillStyle = isEven ? '#cccccc' : '#ffffff'
      ctx.fillRect(cx, cy, size, size)
    }
  }
  ctx.restore()
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#d1d5db'
  ctx.fillRect(x, y, w, h)

  const iconSize = Math.min(w, h) * 0.18
  const lw = Math.max(2, Math.min(w, h) * 0.03)
  const cx = x + w / 2
  const cy = y + h / 2

  ctx.strokeStyle = '#9ca3af'
  ctx.lineWidth = lw
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - iconSize, cy)
  ctx.lineTo(cx + iconSize, cy)
  ctx.moveTo(cx, cy - iconSize)
  ctx.lineTo(cx, cy + iconSize)
  ctx.stroke()
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cellX: number, cellY: number, cellW: number, cellH: number,
  offsetX: number, offsetY: number, scale: number
) {
  const { sx, sy, sw, sh, dx, dy, dw, dh } = getCoverParams(
    img.naturalWidth, img.naturalHeight,
    cellX, cellY, cellW, cellH,
    offsetX, offsetY, scale
  )
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

function applyRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2)
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
  } else {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }
}

export function renderCollage(
  canvas: HTMLCanvasElement,
  state: AppState,
  onImageLoaded?: () => void,
  forExport = false
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const {
    canvasWidth: W,
    canvasHeight: H,
    borderWidth,
    borderColor,
    transparentBackground,
    borderRadius,
    cells,
    images,
    selectedLayoutId,
  } = state

  canvas.width = W
  canvas.height = H

  ctx.clearRect(0, 0, W, H)

  // Draw canvas background (gaps/padding areas show borderColor; cells cover the rest)
  if (transparentBackground && !forExport) {
    drawCheckerboard(ctx, 0, 0, W, H)
  } else if (!transparentBackground) {
    ctx.fillStyle = borderColor
    ctx.fillRect(0, 0, W, H)
  }

  const pad = borderWidth
  const gap = borderWidth
  const eps = 0.001
  const halfGap = gap / 2

  let layout
  try {
    layout = getLayout(selectedLayoutId)
  } catch {
    return
  }

  for (const layoutCell of layout.cells) {
    const cellState = cells[layoutCell.id]

    const innerW = W - 2 * pad
    const innerH = H - 2 * pad

    let absX = pad + layoutCell.x * innerW
    let absY = pad + layoutCell.y * innerH
    let absW = layoutCell.width * innerW
    let absH = layoutCell.height * innerH

    const isLeftEdge = layoutCell.x < eps
    const isTopEdge = layoutCell.y < eps
    const isRightEdge = layoutCell.x + layoutCell.width > 1 - eps
    const isBottomEdge = layoutCell.y + layoutCell.height > 1 - eps

    if (!isLeftEdge) { absX += halfGap; absW -= halfGap }
    if (!isTopEdge) { absY += halfGap; absH -= halfGap }
    if (!isRightEdge) { absW -= halfGap }
    if (!isBottomEdge) { absH -= halfGap }

    if (absW <= 0 || absH <= 0) continue

    ctx.save()
    ctx.beginPath()
    applyRoundRect(ctx, absX, absY, absW, absH, borderRadius)
    ctx.clip()

    const imageId = cellState?.imageId ?? null
    if (imageId && images[imageId]) {
      const imgData = images[imageId]
      const img = getOrLoadImage(imgData.src, () => onImageLoaded?.())
      if (img) {
        drawImageCover(ctx, img, absX, absY, absW, absH, cellState.offsetX, cellState.offsetY, cellState.scale)
      } else {
        drawPlaceholder(ctx, absX, absY, absW, absH)
      }
    } else {
      drawPlaceholder(ctx, absX, absY, absW, absH)
    }

    ctx.restore()
  }
}
