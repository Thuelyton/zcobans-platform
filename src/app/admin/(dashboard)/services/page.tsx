import { getServices } from './actions'
import { getCategories } from '../categories/actions'
import { ServiceList } from './ServiceList'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getServices(),
    getCategories()
  ])

  return (
    <div className="space-y-6">
      <ServiceList initialServices={services} categories={categories} />
    </div>
  )
}
