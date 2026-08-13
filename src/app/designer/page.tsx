'use client'

/**
 * Designer Page
 * ZCobans Visual Designer
 *
 * Página principal do Visual Designer.
 */

import { DesignerProvider } from '@/lib/designer/store'
import { DesignerLayout } from '@/components/designer/DesignerLayout'
import { ComponentsPanel } from '@/components/designer/ComponentsPanel'
import { DesignerCanvas } from '@/components/designer/DesignerCanvas'
import { PropertiesPanel } from '@/components/designer/PropertiesPanel'

export default function DesignerPage() {
  return (
    <DesignerProvider>
      <DesignerLayout
        leftPanel={<ComponentsPanel />}
        rightPanel={<PropertiesPanel />}
      >
        <DesignerCanvas />
      </DesignerLayout>
    </DesignerProvider>
  )
}
