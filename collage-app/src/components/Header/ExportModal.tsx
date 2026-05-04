import { useState } from 'react'
import { useCollageStore } from '../../store/useCollageStore'
import { getCanvasElement } from '../../utils/canvasRegistry'
import { exportCollage } from '../../utils/export'

interface ExportModalProps {
  onClose: () => void
}

const btnBase: React.CSSProperties = {
  flex: 1,
  padding: '8px 0',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 6,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}

export function ExportModal({ onClose }: ExportModalProps) {
  const state = useCollageStore()
  const [format, setFormat] = useState<'png' | 'jpg'>('png')
  const [quality, setQuality] = useState(90)
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    const canvas = getCanvasElement()
    if (!canvas) return
    setLoading(true)
    try {
      await exportCollage(canvas, state, format, quality, scale)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
    >
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: 320, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1c1c1c', margin: 0 }}>Скачать коллаж</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#aaa', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        {/* Format */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>Формат</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['png', 'jpg'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                style={{
                  ...btnBase,
                  background: format === f ? '#1c1c1c' : '#f5f5f2',
                  color: format === f ? '#fff' : '#666',
                  border: format === f ? '1px solid #1c1c1c' : '1px solid #e4e3e0',
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          {format === 'png' && (
            <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
              {state.transparentBackground ? 'Прозрачный фон будет сохранён' : `Фон: ${state.backgroundColor}`}
            </p>
          )}
        </div>

        {/* JPG quality */}
        {format === 'jpg' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>Качество</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1c1c1c' }}>{quality}%</span>
            </div>
            <input
              type="range"
              min={60}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#1c1c1c' }}
            />
            <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>Фон: {state.backgroundColor}</p>
          </div>
        )}

        {/* Scale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>Размер экспорта</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                style={{
                  ...btnBase,
                  background: scale === s ? '#1c1c1c' : '#fff',
                  color: scale === s ? '#fff' : '#666',
                  border: scale === s ? '1px solid #1c1c1c' : '1px solid #e4e3e0',
                }}
              >
                ×{s}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#aaa' }}>{state.canvasWidth * scale} × {state.canvasHeight * scale} px</span>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 0',
            background: '#1c1c1c',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Создание...' : 'Скачать'}
        </button>
      </div>
    </div>
  )
}
