import { Metadata } from 'next'
import { getPublicContactSettings } from '../actions'
import { ContactForm } from '@/components/public/ContactForm'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato conosco. Estamos prontos para ajudar sua empresa.',
}

interface ContactSettings {
  email: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  maps_url: string | null
  business_hours: string | null
}

export default async function ContactPage() {
  const contactResult = await getPublicContactSettings().catch(() => null)

  const contact = (
    contactResult && 'data' in contactResult ? contactResult.data : null
  ) as ContactSettings | null

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <div className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <Container>
          <div className="py-12 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              Entre em Contato
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              Estamos prontos para ajudar sua empresa. Preencha o formulário abaixo.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-6">
                  Envie sua mensagem
                </h2>
                <ContactForm />
              </Card>
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-1">
              <Card padding="md">
                <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-6">
                  Informações de Contato
                </h2>

                <div className="space-y-5">
                  {/* Email */}
                  {contact?.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-start gap-4 rounded-lg p-3 -mx-3 transition-colors hover:bg-[var(--color-muted)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                        <Mail className="h-5 w-5 text-[var(--color-primary-600)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">Email</p>
                        <p className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                          {contact.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Phone */}
                  {contact?.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/\D/g, '')}`}
                      className="flex items-start gap-4 rounded-lg p-3 -mx-3 transition-colors hover:bg-[var(--color-muted)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                        <Phone className="h-5 w-5 text-[var(--color-primary-600)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">Telefone</p>
                        <p className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                          {contact.phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Address */}
                  {contact?.address && (
                    <div className="flex items-start gap-4 rounded-lg p-3 -mx-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                        <MapPin className="h-5 w-5 text-[var(--color-primary-600)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">Endereço</p>
                        <p className="text-sm text-[var(--color-muted-foreground)]">{contact.address}</p>
                        {contact.maps_url && (
                          <a
                            href={contact.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
                          >
                            Ver no mapa
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Business hours */}
                  {contact?.business_hours && (
                    <div className="flex items-start gap-4 rounded-lg p-3 -mx-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                        <Clock className="h-5 w-5 text-[var(--color-primary-600)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">Horário</p>
                        <p className="text-sm text-[var(--color-muted-foreground)]">{contact.business_hours}</p>
                      </div>
                    </div>
                  )}

                  {/* Default info when no contact settings */}
                  {!contact?.email && !contact?.phone && !contact?.address && (
                    <div className="text-center py-4">
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Entre em contato pelo formulário ao lado.
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                        Responderemos o mais breve possível.
                      </p>
                    </div>
                  )}
                </div>

                {/* WhatsApp */}
                {contact?.whatsapp && (
                  <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-secondary-600)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-secondary-700)] transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Falar no WhatsApp
                    </a>
                  </div>
                )}
              </Card>

              {/* Response time note */}
              <div className="mt-6 rounded-lg bg-[var(--color-primary-50)] p-4 border border-[var(--color-primary-200)]">
                <p className="text-sm text-[var(--color-primary-700)]">
                  <strong>Tempo de resposta:</strong> Responderemos sua mensagem em até 24 horas úteis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
