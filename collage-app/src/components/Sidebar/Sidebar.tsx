import { BackgroundSettings } from './BackgroundSettings'
import { BorderSettings } from './BorderSettings'
import { LayoutPicker } from './LayoutPicker'
import { RadiusSettings } from './RadiusSettings'
import { SizeSettings } from './SizeSettings'
import { useCollageStore } from '../../store/useCollageStore'

export function Sidebar() {
  const images = useCollageStore((s) => s.images)
  const hasImages = Object.keys(images).length > 0

  return (
    <aside className="w-[280px] shrink-0 bg-[#1c1814] text-gray-300 flex flex-col overflow-y-auto">
      {/* Layout picker — dimmed until images are loaded */}
      <div className="relative">
        <LayoutPicker />
        {!hasImages && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(28,24,20,0.55)' }}
          />
        )}
      </div>

      {/* Группа: внешний вид — dimmed until images are loaded */}
      <div className="border-b border-white/10 relative">
        <p className="px-4 pt-3 pb-0 text-[10px] font-semibold uppercase tracking-widest text-white/25 select-none">
          Внешний вид
        </p>
        <BackgroundSettings />
        <BorderSettings />
        <RadiusSettings />
        {!hasImages && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(28,24,20,0.55)' }}
          />
        )}
      </div>

      <SizeSettings />

      {/* Onboarding nudge — shown only when no images */}
      {!hasImages && (
        <div
          className="mx-3 mb-3 mt-auto rounded-lg px-3 py-2.5 flex items-start gap-2 animate-fade-in"
          style={{ background: 'rgba(160,120,80,0.15)', border: '1px solid rgba(160,120,80,0.25)' }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>↓</span>
          <div>
            <p className="text-xs font-medium" style={{ color: '#d4a870' }}>Начните с загрузки фото</p>
            <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#9a7a58' }}>
              Перетащите их в зону внизу — остальное станет доступным
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
