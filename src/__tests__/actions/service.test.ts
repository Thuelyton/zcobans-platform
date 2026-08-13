import { describe, it, expect, vi } from 'vitest'
import { createService } from '@/app/admin/(dashboard)/services/actions'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Service Actions', () => {
  it('should return error if validation fails', async () => {
    const result = await createService({ name: '' } as any)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Nome é obrigatório')
    }
  })

  it('should call supabase insert on success', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    
    ;(createClient as any).mockResolvedValue({
      from: mockFrom
    })

    const data = {
      name: 'New Service',
      slug: 'new-service',
      category_id: null,
      active: true,
      position: 0,
    }

    const result = await createService(data as any)
    expect(mockFrom).toHaveBeenCalledWith('services')
    expect(mockInsert).toHaveBeenCalled()
    expect(result.success).toBe(true)
  })
})
