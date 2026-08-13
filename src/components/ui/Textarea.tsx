import { forwardRef, TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Textarea reutilizável do ZCobans
 *
 * @param label - Label do campo
 * @param error - Mensagem de erro
 * @param helperText - Texto de ajuda
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            'w-full rounded-lg border bg-[#111827] px-4 py-3 text-sm text-slate-200',
            'placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500',
            'transition-colors duration-200 resize-none',
            error
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
              : 'border-slate-700 hover:border-slate-600',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={clsx(
              'mt-1.5 text-xs',
              error ? 'text-red-400' : 'text-slate-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
