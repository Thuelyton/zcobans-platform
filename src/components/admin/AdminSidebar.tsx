'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileSearch,
  CreditCard,
  Users,
  Handshake,
  Shield,
  Clock,
  BarChart3,
  Wallet,
  Settings,
  Image as ImageIcon,
  Tag,
  FolderTree,
  Briefcase,
  Activity,
  FileText,
  HelpCircle,
  ChevronDown,
  FileDown,
  FileText as FileTextIcon,
  MoreHorizontal,
  Download,
  RefreshCw,
  Database,
  CreditCard as CreditCardIcon,
  UserCheck,
  Lock,
  Unlock,
  Layers,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'

// Grupo: Consultas (itens principais)
const consultationGroup = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Consultas', href: '/admin/consultas', icon: FileSearch },
  { name: 'Limpa Nome', href: '/admin/limpa-nome', icon: Shield },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'CRM', href: '/admin/crm', icon: Handshake },
  { name: 'Créditos', href: '/admin/creditos', icon: Wallet },
  { name: 'Histórico', href: '/admin/historico', icon: Clock },
  { name: 'Relatórios', href: '/admin/relatorios', icon: BarChart3 },
]

// Subgrupo: Extratos CNIS
const extratosCnisGroup = [
  { name: 'CNIS Online', href: '/admin/consultas?tipo=cnis_online', icon: Download },
  { name: 'CNIS c/ QR Code', href: '/admin/consultas?tipo=cnis_online_qr', icon: RefreshCw },
  { name: 'CNIS s/ QR Code', href: '/admin/consultas?tipo=cnis_online_sem_qr', icon: FileDown },
  { name: 'CNIS Offline CPF', href: '/admin/consultas?tipo=cnis_offline_cpf', icon: Database },
  { name: 'Consulta CNIS', href: '/admin/consultas?tipo=consulta_cnis', icon: FileSearch },
  { name: 'Atualização CNIS', href: '/admin/consultas?tipo=atualizacao_cnis', icon: RefreshCw },
]

// Subgrupo: Documentos INSS
const documentosINSSGroup = [
  { name: 'IN100', href: '/admin/consultas?tipo=in100', icon: FileTextIcon },
  { name: 'HISCRE', href: '/admin/consultas?tipo=hiscre', icon: FileTextIcon },
  { name: 'HISMED', href: '/admin/consultas?tipo=hismed', icon: FileTextIcon },
  { name: 'HISATU', href: '/admin/consultas?tipo=hisatu', icon: FileTextIcon },
  { name: 'TITULA', href: '/admin/consultas?tipo=titula', icon: FileTextIcon },
  { name: 'INFBEN', href: '/admin/consultas?tipo=infben', icon: FileTextIcon },
  { name: 'Carta de Concessão', href: '/admin/consultas?tipo=carta_concessao', icon: FileTextIcon },
]

// Subgrupo: Outros Serviços INSS
const outrosServicosINSSGroup = [
  { name: 'CRAS', href: '/admin/consultas?tipo=cras', icon: Layers },
  { name: 'Prova de Vida', href: '/admin/consultas?tipo=prova_vida', icon: UserCheck },
  { name: 'Subida de Nível', href: '/admin/consultas?tipo=subida_nivel', icon: CreditCardIcon },
  { name: 'Desbloqueio NB', href: '/admin/consultas?tipo=desbloqueio_nb', icon: Unlock },
  { name: 'Retirada 2 Etapas', href: '/admin/consultas?tipo=retirada_duas_etapas', icon: MoreHorizontal },
]

// Grupo: Conteúdo
const contentGroup = [
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Promoções', href: '/admin/promotions', icon: Tag },
  { name: 'Categorias', href: '/admin/categories', icon: FolderTree },
  { name: 'Serviços', href: '/admin/services', icon: Briefcase },
  { name: 'Status', href: '/admin/status', icon: Activity },
  { name: 'Conteúdo', href: '/admin/content', icon: FileText },
  { name: 'Leads', href: '/admin/leads', icon: Users },
]

// Grupo: Configurações
const settingsGroup = [
  { name: 'Confiança', href: '/admin/settings/trust', icon: Shield },
  { name: 'FAQ', href: '/admin/settings/faq', icon: HelpCircle },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
]

function SidebarGroup({ title, items, defaultOpen = true }: { title: string; items: typeof consultationGroup; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const pathname = usePathname()

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-400 transition-colors"
      >
        {title}
        <ChevronDown
          className={clsx(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <ul role="list" className="mt-1 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent',
                    'group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium transition-all duration-200'
                  )}
                >
                  <item.icon
                    className={clsx(
                      isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300',
                      'h-5 w-5 shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function AdminSidebar() {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-800 bg-[#0d1117] px-4 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <span className="text-xl font-bold tracking-tight text-emerald-400">ZCobans</span>
        <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          Platform
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <SidebarGroup title="Consultas" items={consultationGroup} defaultOpen={true} />
        
        {/* INSS/CNIS Subgroups */}
        <SidebarGroup title="Extratos CNIS" items={extratosCnisGroup} defaultOpen={false} />
        <SidebarGroup title="Documentos INSS" items={documentosINSSGroup} defaultOpen={false} />
        <SidebarGroup title="Outros Serviços INSS" items={outrosServicosINSSGroup} defaultOpen={false} />
        
        <SidebarGroup title="Conteúdo" items={contentGroup} defaultOpen={false} />
        <SidebarGroup title="Sistema" items={settingsGroup} defaultOpen={false} />
      </nav>
    </div>
  )
}
