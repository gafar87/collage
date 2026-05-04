import { BackgroundSettings } from './BackgroundSettings'
import { BorderSettings } from './BorderSettings'
import { LayoutPicker } from './LayoutPicker'
import { RadiusSettings } from './RadiusSettings'
import { SizeSettings } from './SizeSettings'
import { useCollageStore } from '../../store/useCollageStore'

export function Sidebar() {
  const images = useCollageStore((s) => s.images)
  const hasImages = Object.keys(images).length > 0
  const dimStyle = !hasImages ? { opacity: 0.4, pointerEvents: 'none' as const } : {}

  return (
    <aside
      style={{ width: 272, borderRight: '1px solid #eeedeb' }}
      className="shrink-0 bg-white flex flex-col overflow-y-auto overflow-x-hidden"
    >
      <div style={dimStyle}>
        <LayoutPicker />
      </div>

      <div style={dimStyle}>
        {/* Внешний вид section */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #eeedeb' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>
            Внешний вид
          </div>
          <BackgroundSettings />
          <BorderSettings />
          <RadiusSettings />
        </div>
      </div>

      {/* Холст section */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #eeedeb' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>
          Холст
        </div>
        <SizeSettings />
      </div>

      {!hasImages && (
        <div style={{ marginTop: 'auto', padding: '0 16px 16px' }} className="animate-fade-in">
          <div style={{ background: '#f8f8f6', border: '1px solid #eeedeb', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 16, lineHeight: 1, color: '#aaa' }}>↓</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>Начните с загрузки фото</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, lineHeight: 1.4 }}>
                Перетащите их в зону внизу — остальное станет доступным
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
