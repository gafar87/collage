import { useCollageStore } from '../../store/useCollageStore'

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
      <div style={{ position: 'relative', width: 32, height: 32, borderRadius: 8, overflow: 'hidden', border: '1px solid #e4e3e0', flexShrink: 0, cursor: 'pointer' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', opacity: 0 }}
        />
        <div style={{ width: '100%', height: '100%', background: value }} />
      </div>
      <input
        type="text"
        value={value.toUpperCase()}
        onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v) }}
        style={{ flex: 1, background: '#f5f5f2', border: '1px solid #e4e3e0', borderRadius: 6, padding: '5px 8px', fontSize: 13, fontFamily: 'monospace', color: '#1c1c1c' }}
        maxLength={7}
      />
    </div>
  )
}

export function BorderSettings() {
  const { borderWidth, borderColor, backgroundColor, setBorderWidth, setBorderColor } = useCollageStore()
  const useBgColor = borderColor === backgroundColor

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#666', marginBottom: 8 }}>Рамка</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={borderWidth}
          onChange={(e) => setBorderWidth(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#1c1c1c' }}
        />
        <input
          type="number"
          min={0}
          max={50}
          value={borderWidth}
          onChange={(e) => setBorderWidth(Math.min(50, Math.max(0, Number(e.target.value))))}
          style={{ width: 48, background: '#f5f5f2', border: '1px solid #e4e3e0', borderRadius: 6, padding: '4px 6px', fontSize: 13, textAlign: 'center', color: '#1c1c1c', fontFamily: 'inherit' }}
        />
        <span style={{ fontSize: 11, color: '#aaa' }}>px</span>
      </div>
      {!useBgColor && <ColorInput value={borderColor} onChange={setBorderColor} />}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#777', cursor: 'pointer', marginTop: 8, userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={useBgColor}
          onChange={(e) => { if (e.target.checked) setBorderColor(backgroundColor) }}
          style={{ accentColor: '#1c1c1c', width: 14, height: 14 }}
        />
        Использовать цвет фона
      </label>
    </div>
  )
}
