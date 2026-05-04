import { useCollageStore } from '../../store/useCollageStore'

interface PhotoThumbnailProps {
  imageId: string
}

export function PhotoThumbnail({ imageId }: PhotoThumbnailProps) {
  const image = useCollageStore((s) => s.images[imageId])
  const removeImage = useCollageStore((s) => s.removeImage)

  if (!image) return null

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('imageId', imageId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      className="relative shrink-0 group"
      draggable
      onDragStart={handleDragStart}
    >
      <img
        src={image.src}
        alt=""
        draggable={false}
        className="w-16 h-16 object-cover rounded-lg cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-indigo-400 transition-colors pointer-events-none"
      />
      <button
        onClick={() => removeImage(imageId)}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Удалить фото"
      >
        ×
      </button>
    </div>
  )
}
