import { getContentSections } from './actions'
import { ContentList } from './ContentList'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const sections = await getContentSections()

  return (
    <div className="space-y-6">
      <ContentList initialSections={sections} />
    </div>
  )
}
