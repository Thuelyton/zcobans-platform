import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js navigation and other browser/server globals if needed
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '',
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))
