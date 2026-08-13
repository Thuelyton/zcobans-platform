import { getPromotions } from './actions'
import { PromotionList } from './PromotionList'

export const dynamic = 'force-dynamic'

export default async function PromotionsPage() {
  const promotions = await getPromotions()

  return (
    <div className="space-y-6">
      <PromotionList initialPromotions={promotions} />
    </div>
  )
}
