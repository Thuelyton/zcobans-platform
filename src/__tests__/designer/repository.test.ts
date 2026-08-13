import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createDefaultPage } from '@/lib/designer/templates'
import type { DesignerPage } from '@/lib/designer/types'

// Mock Supabase client
const mockUser = { id: 'test-user-id', email: 'test@example.com' }
const mockSelect = vi.fn().mockReturnThis()
const mockInsert = vi.fn().mockReturnThis()
const mockUpdate = vi.fn().mockReturnThis()
const mockDelete = vi.fn().mockReturnThis()
const mockEq = vi.fn().mockReturnThis()
const mockSingle = vi.fn()
const mockOrder = vi.fn().mockReturnThis()

const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
  },
  from: vi.fn().mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    single: mockSingle,
    order: mockOrder,
  }),
}

// Mock the createClient function
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}))

describe('Designer Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSingle.mockResolvedValue({ data: null, error: null })
    mockEq.mockReturnThis()
    mockOrder.mockReturnThis()
    mockSelect.mockReturnThis()
    mockInsert.mockReturnThis()
    mockUpdate.mockReturnThis()
    mockDelete.mockReturnThis()
  })

  describe('createProject', () => {
    it('should create a new project', async () => {
      const { createProject } = await import('@/lib/designer/repository')
      const page = createDefaultPage()
      
      const mockProject = {
        id: 'project-id',
        user_id: mockUser.id,
        name: page.title,
        slug: page.slug,
        page_data: page,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      mockSingle.mockResolvedValue({ data: mockProject, error: null })
      
      const result = await createProject({
        name: page.title,
        slug: page.slug,
        page_data: page,
      })
      
      expect(result).toEqual(mockProject)
      expect(mockSupabase.from).toHaveBeenCalledWith('designer_projects')
    })

    it('should throw error if user not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('Not authenticated') })
      
      const { createProject } = await import('@/lib/designer/repository')
      const page = createDefaultPage()
      
      await expect(createProject({
        name: page.title,
        slug: page.slug,
        page_data: page,
      })).rejects.toThrow('Usuário não autenticado')
    })
  })

  describe('listProjects', () => {
    it('should list user projects', async () => {
      const { listProjects } = await import('@/lib/designer/repository')
      
      const mockProjects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ]
      
      mockSelect.mockReturnValue({
        eq: mockEq.mockReturnValue({
          order: mockOrder.mockReturnValue({
            data: mockProjects,
            error: null,
          }),
        }),
      })
      
      const result = await listProjects()
      
      expect(result).toEqual(mockProjects)
    })
  })

  describe('getProject', () => {
    it('should get project by id', async () => {
      const { getProject } = await import('@/lib/designer/repository')
      
      const mockProject = { id: 'project-id', name: 'Test Project' }
      
      mockSingle.mockResolvedValue({ data: mockProject, error: null })
      
      const result = await getProject('project-id')
      
      expect(result).toEqual(mockProject)
    })

    it('should return null if not found', async () => {
      const { getProject } = await import('@/lib/designer/repository')
      
      mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
      
      const result = await getProject('non-existent')
      
      expect(result).toBeNull()
    })
  })

  describe('updateProject', () => {
    it('should update project', async () => {
      const { updateProject } = await import('@/lib/designer/repository')
      
      const mockProject = { id: 'project-id', name: 'Updated Project' }
      
      mockSingle.mockResolvedValue({ data: mockProject, error: null })
      
      const result = await updateProject('project-id', { name: 'Updated Project' })
      
      expect(result).toEqual(mockProject)
    })
  })

  describe('deleteProject', () => {
    it('should delete project', async () => {
      const { deleteProject } = await import('@/lib/designer/repository')
      
      mockDelete.mockReturnValue({
        eq: mockEq.mockReturnValue({
          eq: mockEq.mockReturnValue({
            error: null,
          }),
        }),
      })
      
      await expect(deleteProject('project-id')).resolves.not.toThrow()
    })
  })
})
