import { useCollageStore } from '../../store/useCollageStore'

export function RadiusSettings() {
  const { borderRadius, setBorderRadius } = useCollageStore()

  function handleChange(value: number) {
    setBorderRadius(Math.min(100, Math.max(0, value)))
  }

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#666', marginBottom: 8 }}>Скругление</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={borderRadius}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#1c1c1c' }}
        />
        <input
          type="number"
          min={0}
          max={100}
          value={borderRadius}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{ width: 48, background: '#f5f5f2', border: '1px solid #e4e3e0', borderRadius: 6, padding: '4px 6px', fontSize: 13, textAlign: 'center', color: '#1c1c1c', fontFamily: 'inherit' }}
        />
        <span style={{ fontSize: 11, color: '#aaa' }}>px</span>
      </div>
    </div>
  )
}
