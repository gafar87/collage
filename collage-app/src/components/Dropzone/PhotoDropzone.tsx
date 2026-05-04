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

  const isEmpty = imageIds.length === 0

  return (
    <div
      className="shrink-0 border-t flex items-center px-4 gap-4 transition-all duration-300"
      style={{
        height: isEmpty ? '156px' : '140px',
        background: isEmpty ? '#fdf8f4' : 'white',
        borderColor: isEmpty ? '#e8d8c8' : '#e5e7eb',
      }}
    >
      {/* Drop zone */}
      <div className="relative flex flex-col items-center gap-1 shrink-0">
        {/* Step badge — only in empty state */}
        {isEmpty && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full select-none"
            style={{ background: '#a07850', color: '#fff', letterSpacing: '0.04em' }}
          >
            ШАГ 1
          </div>
        )}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            isDragActive
              ? 'border-amber-600 bg-amber-50'
              : isEmpty
              ? 'animate-dropzone-breathe hover:bg-amber-50/60'
              : 'border-gray-300 hover:border-stone-400 hover:bg-stone-50'
          }`}
          style={{
            width: isEmpty ? '200px' : '180px',
            height: isEmpty ? '112px' : '100px',
          }}
        >
          <input {...getInputProps()} />
          {loadingCount > 0 ? (
            <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: '#a07850' }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <svg
              width={isEmpty ? '28' : '22'}
              height={isEmpty ? '28' : '22'}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: isEmpty ? '#a07850' : '#9ca3af', transition: 'all 0.2s' }}
            >
              {/* Upload arrow icon */}
              <path d="M12 3v13M7 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <span
            className="text-center leading-tight px-2"
            style={{
              fontSize: isEmpty ? '12px' : '11px',
              color: isEmpty ? '#8a6540' : '#9ca3af',
              fontWeight: isEmpty ? 500 : 400,
            }}
          >
            {loadingCount > 0
              ? 'Загрузка...'
              : isDragActive
              ? 'Отпустите файлы'
              : isEmpty
              ? 'Перетащите фото сюда или нажмите'
              : 'Добавить ещё'}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex-1 flex items-center gap-3 overflow-x-auto py-2">
        {isEmpty ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium" style={{ color: '#b8a090' }}>Здесь появятся ваши фото</span>
            <span className="text-xs" style={{ color: '#c8b4a0' }}>JPG, PNG или WEBP — можно несколько сразу</span>
          </div>
        ) : (
          imageIds.map((id) => <PhotoThumbnail key={id} imageId={id} />)
        )}
      </div>
    </div>
  )
}
