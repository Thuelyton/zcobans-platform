import { getSiteSettings } from './actions'
import { SettingsForm } from './SettingsForm'
import { SectionHeader } from '@/components/admin/SectionHeader'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Configurações do Site" 
        description="Gerencie a identidade visual e comportamento geral da plataforma." 
      />
      <SettingsForm settings={settings} />
    </div>
  )
}
