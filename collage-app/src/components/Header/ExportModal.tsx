import { useState } from 'react'
import { useCollageStore } from '../../store/useCollageStore'
import { getCanvasElement } from '../../utils/canvasRegistry'
import { exportCollage } from '../../utils/export'

interface ExportModalProps {
  onClose: () => void
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-80 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Скачать коллаж</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Format */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Формат</span>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(['png', 'jpg'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  format === f
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          {format === 'png' && (
            <p className="text-xs text-gray-500">
              {state.transparentBackground
                ? 'Прозрачный фон будет сохранён'
                : 'Фон: ' + state.backgroundColor}
            </p>
          )}
        </div>

        {/* JPG quality */}
        {format === 'jpg' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Качество</span>
              <span className="text-sm text-violet-600 font-medium">{quality}%</span>
            </div>
            <input
              type="range"
              min={60}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
            <p className="text-xs text-gray-500">Фон: {state.backgroundColor}</p>
          </div>
        )}

        {/* Scale */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Размер экспорта</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  scale === s
                    ? 'border-violet-600 bg-violet-50 text-violet-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                ×{s}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {state.canvasWidth * scale} × {state.canvasHeight * scale} px
          </p>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Создание...' : 'Скачать'}
        </button>
      </div>
    </div>
  )
}
