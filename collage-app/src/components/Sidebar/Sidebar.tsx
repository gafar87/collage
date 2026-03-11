import { BackgroundSettings } from './BackgroundSettings'
import { BorderSettings } from './BorderSettings'
import { LayoutPicker } from './LayoutPicker'
import { RadiusSettings } from './RadiusSettings'
import { SizeSettings } from './SizeSettings'

export function Sidebar() {
  return (
    <aside className="w-[280px] shrink-0 bg-[#1e1e2e] text-gray-300 flex flex-col overflow-y-auto">
      <LayoutPicker />
      <BackgroundSettings />
      <BorderSettings />
      <RadiusSettings />
      <SizeSettings />
    </aside>
  )
}
