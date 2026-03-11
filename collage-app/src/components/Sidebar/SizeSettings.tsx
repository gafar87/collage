import { useState } from 'react'
import { useCollageStore } from '../../store/useCollageStore'

const PRESETS = [
  { label: '1:1', w: 1200, h: 1200 },
  { label: '4:3', w: 1600, h: 1200 },
  { label: '9:16', w: 1080, h: 1920 },
  { label: '16:9', w: 1920, h: 1080 },
]

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
      const ratio = canvasHeight / canvasWidth
      applySize(w, Math.round(w * ratio))
    } else {
      applySize(w, canvasHeight)
    }
  }

  function handleHeightChange(raw: string) {
    setLocalH(raw)
    const h = parseInt(raw, 10)
    if (!h || h < 100) return
    if (keepRatio) {
      const ratio = canvasWidth / canvasHeight
      applySize(Math.round(h * ratio), h)
    } else {
      applySize(canvasWidth, h)
    }
  }

  return (
    <section className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Размер холста</h3>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="number"
          min={100}
          max={8000}
          value={localW}
          onChange={(e) => handleWidthChange(e.target.value)}
          onBlur={() => setLocalW(String(canvasWidth))}
          className="w-full bg-white/10 rounded px-2 py-1.5 text-sm text-white text-center"
        />
        <span className="text-gray-500 shrink-0">×</span>
        <input
          type="number"
          min={100}
          max={8000}
          value={localH}
          onChange={(e) => handleHeightChange(e.target.value)}
          onBlur={() => setLocalH(String(canvasHeight))}
          className="w-full bg-white/10 rounded px-2 py-1.5 text-sm text-white text-center"
        />
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {PRESETS.map((p) => {
          const active = canvasWidth === p.w && canvasHeight === p.h
          return (
            <button
              key={p.label}
              onClick={() => applySize(p.w, p.h)}
              className={`text-xs py-1.5 rounded transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-400 hover:text-gray-200 transition-colors">
        <input
          type="checkbox"
          checked={keepRatio}
          onChange={(e) => setKeepRatio(e.target.checked)}
          className="rounded accent-indigo-500"
        />
        Сохранять пропорции
      </label>
    </section>
  )
}
