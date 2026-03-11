import { useCollageStore } from '../../store/useCollageStore'

export function BorderSettings() {
  const { borderWidth, borderColor, backgroundColor, setBorderWidth, setBorderColor } = useCollageStore()

  function handleWidthChange(value: number) {
    setBorderWidth(value)
  }

  function handleUseBgColor(checked: boolean) {
    if (checked) {
      setBorderColor(backgroundColor)
    }
  }

  const useBgColor = borderColor === backgroundColor

  return (
    <section className="p-4 border-b border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Рамка</h3>

      {/* Ширина */}
      <div className="flex items-center gap-3 mb-3">
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={borderWidth}
          onChange={(e) => handleWidthChange(Number(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <input
          type="number"
          min={0}
          max={50}
          value={borderWidth}
          onChange={(e) => handleWidthChange(Math.min(50, Math.max(0, Number(e.target.value))))}
          className="w-14 bg-white/10 rounded px-2 py-1 text-sm text-white text-center"
        />
        <span className="text-xs text-gray-500">px</span>
      </div>

      {/* Цвет рамки */}
      <div className="flex items-center gap-3 mb-2">
        <div className="relative w-8 h-8 rounded border-2 border-white/20 overflow-hidden cursor-pointer shrink-0">
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            disabled={useBgColor}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="w-full h-full" style={{ background: borderColor }} />
        </div>
        <input
          type="text"
          value={borderColor.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setBorderColor(val)
          }}
          disabled={useBgColor}
          className="flex-1 bg-white/10 rounded px-2 py-1 text-sm text-white font-mono disabled:opacity-40"
          maxLength={7}
        />
      </div>

      {/* Использовать цвет фона */}
      <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-400 hover:text-gray-200 transition-colors">
        <input
          type="checkbox"
          checked={useBgColor}
          onChange={(e) => handleUseBgColor(e.target.checked)}
          className="rounded accent-indigo-500"
        />
        Использовать цвет фона
      </label>
    </section>
  )
}
