export interface CoverParams {
  sx: number  // source x (full image)
  sy: number  // source y (full image)
  sw: number  // source width
  sh: number  // source height
  dx: number  // destination x on canvas
  dy: number  // destination y on canvas
  dw: number  // destination width
  dh: number  // destination height
}

/**
 * Вычисляет параметры для ctx.drawImage с object-fit: cover.
 * Изображение масштабируется так, чтобы полностью заполнить ячейку (без пустых полос),
 * центрируется, затем применяются пользовательские offsetX/Y и scale.
 */
export function getCoverParams(
  imgW: number,
  imgH: number,
  cellX: number,
  cellY: number,
  cellW: number,
  cellH: number,
  offsetX: number,
  offsetY: number,
  scale: number
): CoverParams {
  // Минимальный коэффициент масштабирования, чтобы изображение закрыло всю ячейку
  const ratio = Math.max(cellW / imgW, cellH / imgH)

  const dw = imgW * ratio * scale
  const dh = imgH * ratio * scale

  // Центрируем + применяем смещение пользователя
  const dx = cellX + (cellW - dw) / 2 + offsetX
  const dy = cellY + (cellH - dh) / 2 + offsetY

  return {
    sx: 0,
    sy: 0,
    sw: imgW,
    sh: imgH,
    dx,
    dy,
    dw,
    dh,
  }
}
