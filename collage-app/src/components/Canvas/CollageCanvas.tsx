import { useEffect, useRef, useCallback } from 'react'
import { useCollageStore } from '../../store/useCollageStore'
import { renderCollage } from '../../utils/canvasRenderer'
import { setCanvasElement } from '../../utils/canvasRegistry'
import { CellOverlay } from './CellOverlay'

export function CollageCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useCollageStore()

  useEffect(() => {
    setCanvasElement(canvasRef.current)
    return () => setCanvasElement(null)
  }, [])

  const render = useCallback(() => {
    if (canvasRef.current) {
      renderCollage(canvasRef.current, state, render)
    }
  }, [state])

  useEffect(() => {
    render()
  }, [render])

  const { canvasWidth, canvasHeight } = state

  return (
    <main className="flex-1 flex items-center justify-center overflow-hidden p-6" style={{ background: 'radial-gradient(ellipse at 60% 40%, #ece8fc 0%, #e5e0f8 60%, #ddd8f2 100%)' }}>
      <div
        className="relative shadow-xl"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          maxHeight: '100%',
          maxWidth: '100%',
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
        />
        <CellOverlay />
      </div>
    </main>
  )
}
