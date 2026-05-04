import { useCollageStore } from '../../store/useCollageStore'

export function RadiusSettings() {
  const { borderRadius, setBorderRadius } = useCollageStore()

  function handleChange(value: number) {
    setBorderRadius(Math.min(100, Math.max(0, value)))
  }

  return (
    <section className="px-4 py-3">
      <h3 className="text-xs font-medium text-gray-400 mb-2.5">Скругление</h3>
      <div className="flex items-center gap-2.5">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={borderRadius}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="flex-1 accent-white"
        />
        <input
          type="number"
          min={0}
          max={100}
          value={borderRadius}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-14 bg-white/10 rounded px-2 py-1 text-sm text-white text-center"
        />
        <span className="text-xs text-gray-500">px</span>
      </div>
    </section>
  )
}
