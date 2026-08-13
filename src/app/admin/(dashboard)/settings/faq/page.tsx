import { getFaqItems } from './actions'
import { FaqList } from './FaqList'

export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const items = await getFaqItems()

  return (
    <div className="space-y-6">
      <FaqList initialItems={items} />
    </div>
  )
}
