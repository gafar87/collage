import { useState } from 'react'
import { useCollageStore } from '../../store/useCollageStore'

const PRESETS = [
  { label: '1:1', w: 1200, h: 1200 },
  { label: '4:3', w: 1600, h: 1200 },
  { label: '9:16', w: 1080, h: 1920 },
  { label: '16:9', w: 1920, h: 1080 },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f5f5f2',
  border: '1px solid #e4e3e0',
  borderRadius: 6,
  padding: '6px 8px',
  fontSize: 13,
  textAlign: 'center',
  color: '#1c1c1c',
  fontFamily: 'inherit',
}

export function SizeSettings() {
  const { canvasWidth, canvasHeight, setCanvasSize } = useCollageStore()
  const [keepRatio, setKeepRatio] = useState(false)
  const [localW, setLocalW] = useState(String(canvasWidth))
  const [localH, setLocalH] = useState(String(canvasHeight))

  function applySize(w: number, h: number) {
    const cw = Math.max(100, Math.min(8000, w))
    const ch = Math.max(100, Math.min(8000, h))
    setLocalW(String(cw))
    setLocalH(String(ch))
    setCanvasSize(cw, ch)
  }

  function handleWidthChange(raw: string) {
    setLocalW(raw)
    const w = parseInt(raw, 10)
    if (!w || w < 100) return
    if (keepRatio) {
      applySize(w, Math.round(w * (canvasHeight / canvasWidth)))
    } else {
      applySize(w, canvasHeight)
    }
  }

  function handleHeightChange(raw: string) {
    setLocalH(raw)
    const h = parseInt(raw, 10)
    if (!h || h < 100) return
    if (keepRatio) {
      applySize(Math.round(h * (canvasWidth / canvasHeight)), h)
    } else {
      applySize(canvasWidth, h)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <input
          type="number"
          min={100}
          max={8000}
          value={localW}
          onChange={(e) => handleWidthChange(e.target.value)}
          onBlur={() => setLocalW(String(canvasWidth))}
          style={inputStyle}
        />
        <span style={{ color: '#bbb', fontSize: 12, flexShrink: 0 }}>×</span>
        <input
          type="number"
          min={100}
          max={8000}
          value={localH}
          onChange={(e) => handleHeightChange(e.target.value)}
          onBlur={() => setLocalH(String(canvasHeight))}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
        {PRESETS.map((p) => {
          const active = canvasWidth === p.w && canvasHeight === p.h
          return (
            <button
              key={p.label}
              onClick={() => applySize(p.w, p.h)}
              style={{
                padding: '6px 0',
                borderRadius: 6,
                border: active ? '1px solid #1c1c1c' : '1px solid #e4e3e0',
                background: active ? '#1c1c1c' : '#fff',
                color: active ? '#fff' : '#666',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#777', cursor: 'pointer', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={keepRatio}
          onChange={(e) => setKeepRatio(e.target.checked)}
          style={{ accentColor: '#1c1c1c', width: 14, height: 14 }}
        />
        Сохранять пропорции
      </label>
    </>
  )
}
