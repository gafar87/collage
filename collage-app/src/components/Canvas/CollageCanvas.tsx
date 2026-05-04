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
    <main
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 24,
        background: '#eeecea',
        backgroundImage: 'radial-gradient(circle, #c8c5c2 0.8px, transparent 0.8px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          maxHeight: '100%',
          maxWidth: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          borderRadius: 4,
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
