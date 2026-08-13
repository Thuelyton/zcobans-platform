import { getCategories } from './actions'
import { CategoryList } from './CategoryList'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <CategoryList initialCategories={categories} />
    </div>
  )
}
