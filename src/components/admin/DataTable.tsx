import { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
}

export function DataTable<T>({ data, columns, keyExtractor, emptyMessage = 'Nenhum registro encontrado' }: DataTableProps<T>) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={clsx(
                        'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900',
                        col.className
                      )}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="whitespace-nowrap px-3 py-8 text-sm text-gray-500 text-center"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={keyExtractor(row)}>
                      {columns.map((col, index) => (
                        <td
                          key={index}
                          className={clsx(
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                            col.className
                          )}
                        >
                          {typeof col.accessor === 'function'
                            ? col.accessor(row)
                            : (row[col.accessor] as ReactNode)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
