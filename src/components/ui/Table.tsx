import { ReactNode } from 'react'
import { clsx } from 'clsx'

// Table Container
export function TableContainer({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          {children}
        </table>
      </div>
    </div>
  )
}

// Table Header
export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-[#0d1117]">
      <tr>{children}</tr>
    </thead>
  )
}

// Table Header Cell
export function TableHead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <th
      className={clsx(
        'px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400',
        className
      )}
    >
      {children}
    </th>
  )
}

// Table Body
export function TableBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-slate-800 bg-[#111827]">
      {children}
    </tbody>
  )
}

// Table Row
export function TableRow({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <tr
      className={clsx(
        'transition-colors hover:bg-slate-800/50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

// Table Cell
export function TableCell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <td
      className={clsx(
        'whitespace-nowrap px-6 py-4 text-sm text-slate-300',
        className
      )}
    >
      {children}
    </td>
  )
}

// Empty State
export function TableEmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode
  title: string
  description?: string
}) {
  return (
    <tr>
      <td colSpan={100} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          {icon && (
            <div className="mb-4 rounded-full bg-slate-800 p-3 text-slate-400">
              {icon}
            </div>
          )}
          <p className="text-sm font-medium text-slate-300">{title}</p>
          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </td>
    </tr>
  )
}

// Loading State
export function TableLoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
