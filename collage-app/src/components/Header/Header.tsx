import { useCollageStore } from '../../store/useCollageStore'
import { ExportModal } from './ExportModal'

export function Header() {
  const exportModalOpen = useCollageStore((s) => s.exportModalOpen)
  const setExportModalOpen = useCollageStore((s) => s.setExportModalOpen)

  return (
    <>
      <header
        style={{ height: 52 }}
        className="glass-header flex items-center justify-between px-5 shrink-0 z-10"
      >
        <div className="glass-header__glow" aria-hidden="true" />

        <div className="flex items-center gap-2.5">
          <div
            style={{ width: 30, height: 30, borderRadius: 9 }}
            className="glass-logo flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#1c1c1c" />
              <rect x="10" y="1" width="7" height="7" rx="1.5" fill="#1c1c1c" opacity="0.6" />
              <rect x="1" y="10" width="7" height="7" rx="1.5" fill="#1c1c1c" opacity="0.6" />
              <rect x="10" y="10" width="7" height="7" rx="1.5" fill="#1c1c1c" opacity="0.35" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1c1c1c' }}>Коллаж</span>
        </div>

        <button onClick={() => setExportModalOpen(true)} className="glass-btn">
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Скачать
        </button>
      </header>

      {exportModalOpen && <ExportModal onClose={() => setExportModalOpen(false)} />}
    </>
  )
}
