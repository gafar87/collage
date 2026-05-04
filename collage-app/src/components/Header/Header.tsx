import { useCollageStore } from '../../store/useCollageStore'
import { ExportModal } from './ExportModal'

export function Header() {
  const exportModalOpen = useCollageStore((s) => s.exportModalOpen)
  const setExportModalOpen = useCollageStore((s) => s.setExportModalOpen)

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="7" height="7" rx="1" fill="white" />
              <rect x="10" y="1" width="7" height="7" rx="1" fill="white" opacity="0.7" />
              <rect x="1" y="10" width="7" height="7" rx="1" fill="white" opacity="0.7" />
              <rect x="10" y="10" width="3.5" height="7" rx="1" fill="white" opacity="0.5" />
              <rect x="14.5" y="10" width="2.5" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="14.5" y="14" width="2.5" height="3" rx="0.5" fill="white" opacity="0.5" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold text-gray-900 leading-snug">Коллаж</span>
            <span className="text-[11px] text-gray-400 leading-none">онлайн-редактор</span>
          </div>
        </div>
        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Скачать
        </button>
      </header>

      {exportModalOpen && <ExportModal onClose={() => setExportModalOpen(false)} />}
    </>
  )
}
