import { getStatuses } from './actions'
import { getServices } from '../services/actions'
import { StatusList } from './StatusList'

export const dynamic = 'force-dynamic'

export default async function StatusPage() {
  const [statuses, services] = await Promise.all([
    getStatuses(),
    getServices()
  ])

  return (
    <div className="space-y-6">
      <StatusList initialStatuses={statuses} services={services} />
    </div>
  )
}
