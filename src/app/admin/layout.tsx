import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  // We'll add standard admin sidebar/layout logic here later.
  // For now, it just renders children so /admin/login doesn't have the sidebar,
  // or we can structure the folders so /admin/(dashboard) has the sidebar.
  // Let's create a sub-group for the actual dashboard so login is clean.
  return <div className="min-h-screen bg-gray-50">{children}</div>
}
