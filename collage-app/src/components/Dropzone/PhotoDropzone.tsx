import { useCallback, useState, useRef } from 'react'
import { useCollageStore } from '../../store/useCollageStore'
import { useToastStore } from '../../store/useToastStore'
import { PhotoThumbnail } from './PhotoThumbnail'

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function PhotoDropzone() {
  const addImage = useCollageStore((s) => s.addImage)
  const images = useCollageStore((s) => s.images)
  const showToast = useToastStore((s) => s.showToast)
  const imageIds = Object.keys(images)
  const [loadingCount, setLoadingCount] = useState(0)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEmpty = imageIds.length === 0

  const processFiles = useCallback(
    (files: File[]) => {
      for (const file of files) {
        if (!ACCEPTED_MIME.has(file.type)) {
          showToast(`Формат не поддерживается: ${file.name}. Используйте JPG, PNG или WEBP.`, 'error')
          continue
        }
        const isLarge = file.size > 5 * 1024 * 1024
        if (isLarge) setLoadingCount((c) => c + 1)
        const reader = new FileReader()
        reader.onload = (e) => {
          const src = e.target?.result as string
          if (!src) { if (isLarge) setLoadingCount((c) => c - 1); return }
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

  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: '1px solid #eeedeb',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        height: isEmpty ? 130 : 110,
        background: '#fff',
        transition: 'height 0.3s',
      }}
    >
      {/* Drop zone */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true) }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragActive(false); processFiles([...e.dataTransfer.files]) }}
          style={{
            width: isEmpty ? 180 : 160,
            height: isEmpty ? 90 : 80,
            border: `2px dashed ${isDragActive ? '#1c1c1c' : '#d0cfcc'}`,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: isDragActive ? '#f5f5f2' : 'transparent',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => { processFiles([...e.target.files!]); e.target.value = '' }}
          />
          {loadingCount > 0 ? (
            <svg style={{ animation: 'spin 1s linear infinite', color: '#888' }} width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <svg
              width={isEmpty ? 22 : 18}
              height={isEmpty ? 22 : 18}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: isEmpty ? '#888' : '#bbb' }}
            >
              <path d="M12 3v13M7 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <span
            style={{
              fontSize: isEmpty ? 12 : 11,
              color: isEmpty ? '#888' : '#aaa',
              fontWeight: isEmpty ? 500 : 400,
              textAlign: 'center',
              padding: '0 8px',
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

      {/* Thumbnails / placeholder */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', padding: '8px 0' }}>
        {isEmpty ? (
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>Здесь появятся ваши фото</div>
            <div style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>JPG, PNG или WEBP — можно несколько сразу</div>
          </div>
        ) : (
          imageIds.map((id) => <PhotoThumbnail key={id} imageId={id} />)
        )}
      </div>
    </div>
  )
}
