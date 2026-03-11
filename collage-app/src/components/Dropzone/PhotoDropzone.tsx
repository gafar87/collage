import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCollageStore } from '../../store/useCollageStore'
import { useToastStore } from '../../store/useToastStore'
import { PhotoThumbnail } from './PhotoThumbnail'

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024 // 5MB

export function PhotoDropzone() {
  const addImage = useCollageStore((s) => s.addImage)
  const images = useCollageStore((s) => s.images)
  const showToast = useToastStore((s) => s.showToast)
  const imageIds = Object.keys(images)
  const [loadingCount, setLoadingCount] = useState(0)

  const processFiles = useCallback(
    (files: File[]) => {
      for (const file of files) {
        if (!ACCEPTED_MIME.has(file.type)) {
          showToast(`Формат не поддерживается: ${file.name}. Используйте JPG, PNG или WEBP.`, 'error')
          continue
        }

        const isLarge = file.size > LARGE_FILE_THRESHOLD
        if (isLarge) setLoadingCount((c) => c + 1)

        const reader = new FileReader()
        reader.onload = (e) => {
          const src = e.target?.result as string
          if (!src) {
            if (isLarge) setLoadingCount((c) => c - 1)
            return
          }
          const img = new Image()
          img.onload = () => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
            addImage(id, { src, width: img.naturalWidth, height: img.naturalHeight })
            if (isLarge) setLoadingCount((c) => c - 1)
          }
          img.onerror = () => {
            showToast(`Не удалось загрузить файл: ${file.name}`, 'error')
            if (isLarge) setLoadingCount((c) => c - 1)
          }
          img.src = src
        }
        reader.onerror = () => {
          showToast(`Ошибка чтения файла: ${file.name}`, 'error')
          if (isLarge) setLoadingCount((c) => c - 1)
        }
        reader.readAsDataURL(file)
      }
    },
    [addImage, showToast]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: { file: File }[]) => {
      for (const { file } of rejectedFiles) {
        showToast(`Формат не поддерживается: ${file.name}. Используйте JPG, PNG или WEBP.`, 'error')
      }
      processFiles(acceptedFiles)
    },
    [processFiles, showToast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
  })

  return (
    <div className="h-[140px] shrink-0 bg-white border-t border-gray-200 flex items-center px-4 gap-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`h-[100px] w-[180px] shrink-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
        }`}
      >
        <input {...getInputProps()} />
        {loadingCount > 0 ? (
          <svg className="animate-spin text-indigo-500" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        <span className="text-xs text-gray-400 text-center leading-tight px-2">
          {loadingCount > 0
            ? 'Загрузка...'
            : isDragActive
            ? 'Отпустите файлы'
            : 'Перетащите фото или нажмите'}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex-1 flex items-center gap-3 overflow-x-auto py-2">
        {imageIds.length === 0 ? (
          <span className="text-sm text-gray-400">Загруженные фото появятся здесь</span>
        ) : (
          imageIds.map((id) => <PhotoThumbnail key={id} imageId={id} />)
        )}
      </div>
    </div>
  )
}
