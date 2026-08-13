'use client'

import { Bell, Menu, Search, Moon } from 'lucide-react'
import { logout } from '@/app/admin/login/actions'
import { Input } from '@/components/ui/Input'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-800 bg-[#0d1117]/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-400 lg:hidden hover:text-slate-200 transition-colors"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar consultas, clientes..."
              className="w-full rounded-lg border border-slate-800 bg-[#111827] pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-200 transition-colors">
            <span className="sr-only">Toggle theme</span>
            <Moon className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Notifications */}
          <button type="button" className="relative -m-2.5 p-2.5 text-slate-400 hover:text-slate-200 transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-400"></span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-800" aria-hidden="true" />

          {/* Profile */}
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">
                  Admin User
                </span>
                <span className="text-xs text-slate-500">
                  Super Admin
                </span>
              </div>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
