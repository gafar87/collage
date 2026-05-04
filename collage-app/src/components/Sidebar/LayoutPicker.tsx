import { LAYOUTS } from '../../layouts/layouts'
import { useCollageStore } from '../../store/useCollageStore'

const S = 32, P = 2, G = 2.5

function LayoutIcon({ cells }: { cells: { x: number; y: number; width: number; height: number }[] }) {
  const inner = S - 2 * P
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${S} ${S}`}>
      {cells.map((cell, i) => {
        const x = P + cell.x * inner + (cell.x > 0 ? G / 2 : 0)
        const y = P + cell.y * inner + (cell.y > 0 ? G / 2 : 0)
        const w = cell.width * inner - (cell.x > 0 ? G / 2 : 0) - (cell.x + cell.width < 1 ? G / 2 : 0)
        const h = cell.height * inner - (cell.y > 0 ? G / 2 : 0) - (cell.y + cell.height < 1 ? G / 2 : 0)
        return <rect key={i} x={x} y={y} width={Math.max(0, w)} height={Math.max(0, h)} rx={1.5} fill="currentColor" />
      })}
    </svg>
  )
}

export function LayoutPicker() {
  const { selectedLayoutId, setLayout } = useCollageStore()

  return (
    <div style={{ padding: '20px 20px 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>
        Макет
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {LAYOUTS.map((layout) => {
          const active = layout.id === selectedLayoutId
          return (
            <button
              key={layout.id}
              onClick={() => setLayout(layout.id, layout.cellCount)}
              title={layout.name}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 4,
                transition: 'all 0.15s',
                background: active ? '#1c1c1c' : '#f0efec',
                color: active ? '#fff' : '#999',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#e4e3e0'
                  e.currentTarget.style.color = '#666'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#f0efec'
                  e.currentTarget.style.color = '#999'
                }
              }}
            >
              <LayoutIcon cells={layout.cells} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
