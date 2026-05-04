import { LAYOUTS } from '../../layouts/layouts'
import { useCollageStore } from '../../store/useCollageStore'

const ICON_SIZE = 36
const ICON_PAD = 2
const ICON_GAP = 3

function LayoutIcon({ cells }: { cells: { x: number; y: number; width: number; height: number }[] }) {
  const inner = ICON_SIZE - 2 * ICON_PAD

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {cells.map((cell, i) => {
        const x = ICON_PAD + cell.x * inner + (cell.x > 0 ? ICON_GAP / 2 : 0)
        const y = ICON_PAD + cell.y * inner + (cell.y > 0 ? ICON_GAP / 2 : 0)
        const w =
          cell.width * inner -
          (cell.x > 0 ? ICON_GAP / 2 : 0) -
          (cell.x + cell.width < 1 ? ICON_GAP / 2 : 0)
        const h =
          cell.height * inner -
          (cell.y > 0 ? ICON_GAP / 2 : 0) -
          (cell.y + cell.height < 1 ? ICON_GAP / 2 : 0)

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={Math.max(0, w)}
            height={Math.max(0, h)}
            rx={1}
            fill="currentColor"
          />
        )
      })}
    </svg>
  )
}

export function LayoutPicker() {
  const { selectedLayoutId, setLayout } = useCollageStore()

  return (
    <section className="px-4 pt-5 pb-4 border-b border-white/10">
      <h3 className="text-sm font-semibold text-white mb-4">Макет</h3>
      <div className="grid grid-cols-4 gap-2">
        {LAYOUTS.map((layout) => {
          const active = layout.id === selectedLayoutId
          return (
            <button
              key={layout.id}
              onClick={() => setLayout(layout.id, layout.cellCount)}
              title={layout.name}
              className={`
                aspect-square rounded flex items-center justify-center transition-colors
                ${active
                  ? 'bg-violet-500/25 text-violet-100 ring-1 ring-violet-400/60'
                  : 'bg-white/8 text-gray-400 hover:bg-violet-500/15 hover:text-violet-100'
                }
              `}
            >
              <LayoutIcon cells={layout.cells} />
            </button>
          )
        })}
      </div>
    </section>
  )
}
