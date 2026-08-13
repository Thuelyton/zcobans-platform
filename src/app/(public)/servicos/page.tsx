import { Metadata } from 'next'
import { getPublicCategories, getPublicServicesWithCategory } from '../actions'
import { ServiceCard } from '@/components/public/ServiceCard'
import { Container } from '@/components/ui/Container'
import { FolderOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços',
  description:
    'Conheça nossos serviços de gestão de cobranças e recuperação de créditos.',
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ServiceCategory {
  id: string
  name: string
  slug: string
}

interface Service {
  id: string
  name: string
  slug: string
  short_description: string | null
  image_url: string | null
  price: number | null
  position: number | null
  category_id: string | null
  category: ServiceCategory | null
}

export default async function ServicesPage() {
  const [categoriesResult, servicesResult] = await Promise.all([
    getPublicCategories().catch(() => []),
    getPublicServicesWithCategory().catch(() => []),
  ])

  const categories = (categoriesResult || []) as Category[]
  const services = (servicesResult || []) as Service[]

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <div className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <Container>
          <div className="py-12 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              Nossos Serviços
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              Soluções completas para gestão de cobranças e recuperação de créditos.
            </p>
          </div>
        </Container>
      </div>

      {/* Categories summary */}
      {categories.length > 0 && (
        <Container>
          <div className="py-8">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center rounded-full bg-[var(--color-primary-100)] px-4 py-2 text-sm font-medium text-[var(--color-primary-700)]"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      )}

      {/* Services grid */}
      <Container>
        <div className="pb-16">
          {services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="rounded-xl bg-[var(--color-background)] p-12 text-center shadow-sm ring-1 ring-[var(--color-border)]">
              <FolderOpen className="mx-auto h-12 w-12 text-[var(--color-muted-foreground)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-foreground)]">
                Nenhum serviço disponível
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                No momento não temos serviços cadastrados. Entre em contato para mais informações.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
