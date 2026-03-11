import { useCollageStore } from '../../store/useCollageStore'
import { ExportModal } from './ExportModal'

export function Header() {
  const exportModalOpen = useCollageStore((s) => s.exportModalOpen)
  const setExportModalOpen = useCollageStore((s) => s.setExportModalOpen)

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="7" height="7" rx="1" fill="white" />
              <rect x="10" y="1" width="7" height="7" rx="1" fill="white" opacity="0.7" />
              <rect x="1" y="10" width="7" height="7" rx="1" fill="white" opacity="0.7" />
              <rect x="10" y="10" width="3.5" height="7" rx="1" fill="white" opacity="0.5" />
              <rect x="14.5" y="10" width="2.5" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="14.5" y="14" width="2.5" height="3" rx="0.5" fill="white" opacity="0.5" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">Коллаж</span>
        </div>
        <button
          onClick={() => setExportModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Скачать
        </button>
      </header>

      {exportModalOpen && <ExportModal onClose={() => setExportModalOpen(false)} />}
    </>
  )
}
