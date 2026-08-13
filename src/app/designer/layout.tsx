'use client'

/**
 * Designer Layout
 * ZCobans Visual Designer
 *
 * Layout para a rota /designer.
 */

import type { ReactNode } from 'react'

interface DesignerLayoutProps {
  children: ReactNode
}

export default function DesignerLayout({ children }: DesignerLayoutProps) {
  return <>{children}</>
}
