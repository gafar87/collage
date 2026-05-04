import { useCollageStore } from '../../store/useCollageStore'

function ColorInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 32, height: 32, borderRadius: 8, overflow: 'hidden', border: '1px solid #e4e3e0', flexShrink: 0, cursor: disabled ? 'default' : 'pointer' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', opacity: 0 }}
        />
        <div style={{ width: '100%', height: '100%', background: disabled ? 'repeating-conic-gradient(#ddd 0% 25%, #f4f4f4 0% 50%) 50% / 8px 8px' : value }} />
      </div>
      <input
        type="text"
        value={disabled ? 'transparent' : value.toUpperCase()}
        disabled={disabled}
        onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v) }}
        style={{ flex: 1, background: '#f5f5f2', border: '1px solid #e4e3e0', borderRadius: 6, padding: '5px 8px', fontSize: 13, fontFamily: 'monospace', color: '#1c1c1c', opacity: disabled ? 0.4 : 1 }}
        maxLength={11}
      />
    </div>
  )
}

export function BackgroundSettings() {
  const { backgroundColor, transparentBackground, setBackgroundColor, setTransparentBackground } = useCollageStore()

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#666', marginBottom: 8 }}>Фон</div>
      <ColorInput value={backgroundColor} onChange={setBackgroundColor} disabled={transparentBackground} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#777', cursor: 'pointer', marginTop: 8, userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={transparentBackground}
          onChange={(e) => setTransparentBackground(e.target.checked)}
          style={{ accentColor: '#1c1c1c', width: 14, height: 14 }}
        />
        Прозрачный фон
      </label>
    </div>
  )
}
