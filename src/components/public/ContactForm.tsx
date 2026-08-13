'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLeadSchema, CreateLeadFormData } from '@/lib/validations/lead'
import { createLead } from '@/app/(public)/actions'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

/**
 * Formulário de contato do ZCobans
 *
 * Recursos:
 * - Validação em tempo real
 * - Estados de loading/sucesso/erro
 * - Acessibilidade completa
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      source: 'website',
    },
  })

  async function onSubmit(data: CreateLeadFormData) {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage(null)

    const result = await createLead(data)

    setIsSubmitting(false)

    if (result.success) {
      setSubmitStatus('success')
      reset()
    } else {
      setSubmitStatus('error')
      setErrorMessage(result.error)
    }
  }

  // Success state
  if (submitStatus === 'success') {
    return (
      <div
        className="rounded-xl bg-[var(--color-success-light)] p-6 text-center"
        role="alert"
      >
        <CheckCircle className="mx-auto h-12 w-12 text-[var(--color-success)]" />
        <h3 className="mt-4 text-lg font-semibold text-[var(--color-foreground)]">
          Mensagem enviada com sucesso!
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Recebemos sua mensagem e entraremos em contato em breve.
        </p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setSubmitStatus('idle')}
        >
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  const inputClasses = cn(
    'mt-2 block w-full rounded-lg border px-4 py-3 text-sm',
    'placeholder:text-[var(--color-muted-foreground)]',
    'focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20',
    'transition-colors duration-200'
  )

  const labelClasses = 'block text-sm font-medium text-[var(--color-foreground)]'

  const errorClasses = 'mt-1 text-sm text-[var(--color-danger)] flex items-center gap-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Error message */}
      {submitStatus === 'error' && errorMessage && (
        <div
          className="flex items-start gap-3 rounded-lg bg-[var(--color-danger-light)] p-4"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-[var(--color-danger)]" />
          <p className="text-sm text-[var(--color-danger)]">{errorMessage}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClasses}>
          Nome <span className="text-[var(--color-danger)]">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={cn(inputClasses, errors.name && 'border-[var(--color-danger)]')}
          placeholder="Seu nome completo"
          disabled={isSubmitting}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className={errorClasses}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClasses}>
          Email <span className="text-[var(--color-danger)]">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={cn(inputClasses, errors.email && 'border-[var(--color-danger)]')}
          placeholder="seu@email.com"
          disabled={isSubmitting}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className={errorClasses}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClasses}>
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className={cn(inputClasses, errors.phone && 'border-[var(--color-danger)]')}
          placeholder="(11) 99999-9999"
          disabled={isSubmitting}
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className={errorClasses}>
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className={labelClasses}>
          Empresa
        </label>
        <input
          type="text"
          id="company"
          {...register('company')}
          className={cn(inputClasses, errors.company && 'border-[var(--color-danger)]')}
          placeholder="Nome da empresa"
          disabled={isSubmitting}
          aria-invalid={errors.company ? 'true' : 'false'}
          aria-describedby={errors.company ? 'company-error' : undefined}
        />
        {errors.company && (
          <p id="company-error" className={errorClasses}>
            {errors.company.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClasses}>
          Mensagem
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={4}
          className={cn(
            inputClasses,
            'resize-none',
            errors.message && 'border-[var(--color-danger)]'
          )}
          placeholder="Como podemos ajudar?"
          disabled={isSubmitting}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className={errorClasses}>
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            'Enviando...'
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Enviar mensagem
            </>
          )}
        </Button>
      </div>

      {/* Privacy note */}
      <p className="text-xs text-center text-[var(--color-muted-foreground)]">
        Ao enviar, você concorda com nossa política de privacidade.
        Seus dados serão utilizados apenas para contato.
      </p>
    </form>
  )
}
