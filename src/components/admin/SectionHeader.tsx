import { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-8">
      <div>
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{title}</h3>
        {description && <p className="mt-2 max-w-4xl text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="mt-4 sm:ml-4 sm:mt-0 flex gap-3">{actions}</div>}
    </div>
  )
}
