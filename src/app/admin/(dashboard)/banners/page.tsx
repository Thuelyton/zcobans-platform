import { getBanners } from './actions'
import { BannerList } from './BannerList'

export const dynamic = 'force-dynamic'

export default async function BannersPage() {
  const banners = await getBanners()

  return (
    <div className="space-y-6">
      <BannerList initialBanners={banners} />
    </div>
  )
}
