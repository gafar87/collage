import { useEffect } from 'react'
import './index.css'
import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar/Sidebar'
import { CollageCanvas } from './components/Canvas/CollageCanvas'
import { PhotoDropzone } from './components/Dropzone/PhotoDropzone'
import { ToastContainer } from './components/Toast/ToastContainer'
import { useCollageStore } from './store/useCollageStore'

function App() {
  const clearCell = useCollageStore((s) => s.clearCell)
  const selectedCellId = useCollageStore((s) => s.selectedCellId)
  const setExportModalOpen = useCollageStore((s) => s.setExportModalOpen)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCellId != null) {
          clearCell(selectedCellId)
        }
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        setExportModalOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [clearCell, selectedCellId, setExportModalOpen])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <CollageCanvas />
      </div>
      <PhotoDropzone />
      <ToastContainer />
    </div>
  )
}

export default App
