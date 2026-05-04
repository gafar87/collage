import { useRef, useEffect, useCallback, useState } from 'react'
import { useCollageStore } from '../../store/useCollageStore'
import { useToastStore } from '../../store/useToastStore'
import { getLayout } from '../../layouts/layouts'

const eps = 0.001

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

interface DragState {
  cellId: number
  startMouseX: number
  startMouseY: number
  startOffsetX: number
  startOffsetY: number
}

export function CellOverlay() {
  const state = useCollageStore()
  const showToast = useToastStore((s) => s.showToast)
  const {
    canvasWidth: W,
    canvasHeight: H,
    borderWidth,
    selectedLayoutId,
    cells,
    setCellImage,
    updateCellTransform,
    swapCells,
    addImage,
    selectedCellId,
    setSelectedCell,
  } = state

  const overlayRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const hoveredCellRef = useRef<number | null>(null)
  const [hoveredEmptyCell, setHoveredEmptyCell] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputCellRef = useRef<number | null>(null)

  let layout
  try {
    layout = getLayout(selectedLayoutId)
  } catch {
    return null
  }

  const pad = borderWidth
  const halfGap = borderWidth / 2
  const innerW = W - 2 * pad
  const innerH = H - 2 * pad

  const getCanvasScale = useCallback(() => {
    if (!overlayRef.current) return { sx: 1, sy: 1 }
    const rect = overlayRef.current.getBoundingClientRect()
    return {
      sx: W / rect.width,
      sy: H / rect.height,
    }
  }, [W, H])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const drag = dragRef.current
      if (!drag) return
      const { sx, sy } = getCanvasScale()
      const deltaX = (e.clientX - drag.startMouseX) * sx
      const deltaY = (e.clientY - drag.startMouseY) * sy
      const cell = cells[drag.cellId]
      if (!cell) return
      updateCellTransform(drag.cellId, drag.startOffsetX + deltaX, drag.startOffsetY + deltaY, cell.scale)
    }

    function handleMouseUp() {
      dragRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cells, updateCellTransform, getCanvasScale])

  // Non-passive wheel listener to allow preventDefault (React registers wheel as passive)
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    function handleWheel(e: WheelEvent) {
      const cellId = hoveredCellRef.current
      if (cellId == null) return
      const cellState = useCollageStore.getState().cells[cellId]
      if (!cellState?.imageId) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newScale = Math.min(5, Math.max(0.5, cellState.scale + delta))
      useCollageStore.getState().updateCellTransform(cellId, cellState.offsetX, cellState.offsetY, newScale)
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const cellId = fileInputCellRef.current
    if (!file || cellId == null) return
    e.target.value = ''

    if (!ACCEPTED_MIME.has(file.type)) {
      showToast(`Формат не поддерживается: ${file.name}`, 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      if (!src) return
      const img = new Image()
      img.onload = () => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        addImage(id, { src, width: img.naturalWidth, height: img.naturalHeight })
        setCellImage(cellId, id)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
        onDragOver={(e) => {
          e.preventDefault()
          const hasCellId = e.dataTransfer.types.includes('text/cellid')
          e.dataTransfer.dropEffect = hasCellId ? 'move' : 'copy'
        }}
        onDrop={(e) => {
          e.preventDefault()
          const el = (e.target as HTMLElement).closest('[data-cell-id]') as HTMLElement | null
          if (!el) return
          const cellId = Number(el.dataset.cellId)
          const fromCellId = e.dataTransfer.getData('text/cellid')
          if (fromCellId !== '') {
            const fromId = Number(fromCellId)
            if (fromId !== cellId) swapCells(fromId, cellId)
            return
          }
          const imageId = e.dataTransfer.getData('imageId')
          if (imageId) setCellImage(cellId, imageId)
        }}
      >
        {layout.cells.map((layoutCell) => {
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

          if (absW <= 0 || absH <= 0) return null

          const xPct = (absX / W) * 100
          const yPct = (absY / H) * 100
          const wPct = (absW / W) * 100
          const hPct = (absH / H) * 100

          const cellState = cells[layoutCell.id]
          const hasImage = cellState?.imageId != null
          const isSelected = selectedCellId === layoutCell.id

          function handleMouseDown(e: React.MouseEvent) {
            if (!hasImage) return
            e.preventDefault()
            const cell = cells[layoutCell.id]
            dragRef.current = {
              cellId: layoutCell.id,
              startMouseX: e.clientX,
              startMouseY: e.clientY,
              startOffsetX: cell.offsetX,
              startOffsetY: cell.offsetY,
            }
          }

          function handleClick(e: React.MouseEvent) {
            e.stopPropagation()
            setSelectedCell(layoutCell.id)
            if (!hasImage) {
              fileInputCellRef.current = layoutCell.id
              fileInputRef.current?.click()
            }
          }

          function handleCellDragStart(e: React.DragEvent) {
            e.dataTransfer.setData('text/cellid', String(layoutCell.id))
            e.dataTransfer.effectAllowed = 'move'
          }

          return (
            <div
              key={layoutCell.id}
              style={{
                position: 'absolute',
                left: `${xPct}%`,
                top: `${yPct}%`,
                width: `${wPct}%`,
                height: `${hPct}%`,
                pointerEvents: 'all',
                cursor: hasImage ? 'grab' : 'pointer',
                outline: isSelected ? '2px solid #1c1c1c' : undefined,
                outlineOffset: '-2px',
                borderRadius: 'inherit',
                zIndex: isSelected ? 1 : undefined,
              }}
              data-cell-id={layoutCell.id}
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onMouseEnter={() => {
                hoveredCellRef.current = layoutCell.id
                if (!hasImage) setHoveredEmptyCell(layoutCell.id)
              }}
              onMouseLeave={() => {
                hoveredCellRef.current = null
                setHoveredEmptyCell(null)
              }}
            >
              {/* Hover highlight for empty cells (mouse-only, no drag state) */}
              {!hasImage && hoveredEmptyCell === layoutCell.id && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.04)',
                    pointerEvents: 'none',
                  }}
                />
              )}
              {hasImage && (
                <div
                  draggable
                  onDragStart={handleCellDragStart}
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 22,
                    height: 22,
                    cursor: 'grab',
                    background: 'rgba(0,0,0,0.45)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 13,
                    userSelect: 'none',
                    flexShrink: 0,
                  }}
                  title="Перетащить ячейку"
                >
                  {/* 2×3 dot grid — universal drag handle */}
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                    <circle cx="2" cy="2"  r="1.3" /><circle cx="8" cy="2"  r="1.3" />
                    <circle cx="2" cy="7"  r="1.3" /><circle cx="8" cy="7"  r="1.3" />
                    <circle cx="2" cy="12" r="1.3" /><circle cx="8" cy="12" r="1.3" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
