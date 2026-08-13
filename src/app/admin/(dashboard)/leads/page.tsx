import { getLeads } from './actions'
import { LeadList } from './LeadList'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-6">
      <LeadList initialLeads={leads} />
    </div>
  )
}
