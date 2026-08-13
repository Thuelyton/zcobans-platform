import { getTrustIndicators } from './actions'
import { TrustList } from './TrustList'

export const dynamic = 'force-dynamic'

export default async function TrustPage() {
  const indicators = await getTrustIndicators()

  return (
    <div className="space-y-6">
      <TrustList initialIndicators={indicators} />
    </div>
  )
}
