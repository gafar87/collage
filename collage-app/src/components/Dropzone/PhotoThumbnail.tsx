import { useState } from 'react'
import { useCollageStore } from '../../store/useCollageStore'

interface PhotoThumbnailProps {
  imageId: string
}

export function PhotoThumbnail({ imageId }: PhotoThumbnailProps) {
  const image = useCollageStore((s) => s.images[imageId])
  const removeImage = useCollageStore((s) => s.removeImage)
  const [hovered, setHovered] = useState(false)

  if (!image) return null

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('imageId', imageId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      style={{ position: 'relative', flexShrink: 0 }}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image.src}
        alt=""
        draggable={false}
        style={{
          width: 56,
          height: 56,
          objectFit: 'cover',
          borderRadius: 8,
          cursor: 'grab',
          border: hovered ? '2px solid #1c1c1c' : '2px solid transparent',
          transition: 'border 0.15s',
          pointerEvents: 'none',
          display: 'block',
        }}
      />
      {hovered && (
        <button
          onClick={() => removeImage(imageId)}
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#e74c3c',
            color: '#fff',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
          title="Удалить фото"
        >
          ×
        </button>
      )}
    </div>
  )
}
