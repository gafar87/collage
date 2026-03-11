import { useToastStore } from '../../store/useToastStore'

const BG: Record<string, string> = {
  error: 'bg-red-500',
  success: 'bg-green-500',
  info: 'bg-blue-500',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[9999] pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${BG[t.type]} text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg pointer-events-auto flex items-center gap-3 animate-fade-in`}
        >
          <span>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-white/80 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
