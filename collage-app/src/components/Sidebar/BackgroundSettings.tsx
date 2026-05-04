import { useCollageStore } from '../../store/useCollageStore'

export function BackgroundSettings() {
  const { backgroundColor, transparentBackground, setBackgroundColor, setTransparentBackground } = useCollageStore()

  return (
    <section className="px-4 py-3 border-b border-white/10">
      <h3 className="text-xs font-medium text-violet-300/70 mb-2.5">Фон</h3>

      {/* Color picker + HEX */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="relative w-8 h-8 rounded border-2 border-white/20 overflow-hidden cursor-pointer shrink-0">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            disabled={transparentBackground}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          {transparentBackground ? (
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                backgroundColor: '#fff',
              }}
            />
          ) : (
            <div className="w-full h-full" style={{ background: backgroundColor }} />
          )}
        </div>
        <input
          type="text"
          value={transparentBackground ? 'transparent' : backgroundColor.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setBackgroundColor(val)
          }}
          disabled={transparentBackground}
          className="flex-1 bg-white/10 rounded px-2 py-1 text-sm text-white font-mono disabled:opacity-40"
          maxLength={11}
        />
      </div>

      {/* Transparent checkbox */}
      <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-400 hover:text-gray-200 transition-colors">
        <input
          type="checkbox"
          checked={transparentBackground}
          onChange={(e) => setTransparentBackground(e.target.checked)}
          className="rounded accent-violet-400"
        />
        Прозрачный фон
      </label>
    </section>
  )
}
