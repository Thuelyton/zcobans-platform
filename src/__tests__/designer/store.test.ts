import { describe, it, expect } from 'vitest'
import { designerReducer, createInitialState } from '@/lib/designer/store'
import type { DesignerState, DesignerAction } from '@/lib/designer/types'
import { createDefaultPage, createSectionFromTemplate } from '@/lib/designer/templates'
import { generateId } from '@/lib/designer/utils'

// Helper to create empty initial state for testing
function createEmptyState(): DesignerState {
  return {
    ...createInitialState(),
    page: {
      ...createDefaultPage(),
      sections: [],
    },
  }
}

describe('Designer Store', () => {
  describe('createInitialState', () => {
    it('should create initial state with default page', () => {
      const state = createInitialState()
      expect(state.page).toBeDefined()
      expect(state.page.sections).toBeDefined()
      expect(state.selectedSectionId).toBeNull()
      expect(state.selectedElementId).toBeNull()
      expect(state.device).toBe('desktop')
      expect(state.history).toEqual([])
      expect(state.historyIndex).toBe(-1)
      expect(state.isSaving).toBe(false)
      expect(state.hasUnsavedChanges).toBe(false)
    })
  })

  describe('SET_PAGE', () => {
    it('should set a new page', () => {
      const initialState = createInitialState()
      const newPage = createDefaultPage()
      
      const action: DesignerAction = { type: 'SET_PAGE', payload: newPage }
      const newState = designerReducer(initialState, action)
      
      expect(newState.page).toEqual(newPage)
      expect(newState.hasUnsavedChanges).toBe(false)
      expect(newState.selectedSectionId).toBeNull()
      expect(newState.selectedElementId).toBeNull()
    })
  })

  describe('ADD_SECTION', () => {
    it('should add a section to the page', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      const action: DesignerAction = { type: 'ADD_SECTION', payload: { section } }
      const newState = designerReducer(initialState, action)
      
      expect(newState.page.sections).toHaveLength(1)
      expect(newState.page.sections[0].id).toBe(section.id)
      expect(newState.selectedSectionId).toBe(section.id)
      expect(newState.hasUnsavedChanges).toBe(true)
    })

    it('should add a section at specific index', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      // Add first section
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      
      // Push history before next change
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Add second section at beginning
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2, index: 0 },
      })
      
      expect(state.page.sections).toHaveLength(2)
      expect(state.page.sections[0].id).toBe(section2.id)
      expect(state.page.sections[1].id).toBe(section1.id)
    })
  })

  describe('REMOVE_SECTION', () => {
    it('should remove a section', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      // Push history before remove
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      state = designerReducer(state, {
        type: 'REMOVE_SECTION',
        payload: { sectionId: section.id },
      })
      
      expect(state.page.sections).toHaveLength(0)
      expect(state.selectedSectionId).toBeNull()
      expect(state.hasUnsavedChanges).toBe(true)
    })
  })

  describe('MOVE_SECTION', () => {
    it('should move section up', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move section2 up
      state = designerReducer(state, {
        type: 'MOVE_SECTION',
        payload: { sectionId: section2.id, direction: 'up' },
      })
      
      expect(state.page.sections[0].id).toBe(section2.id)
      expect(state.page.sections[1].id).toBe(section1.id)
    })

    it('should not move first section up', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      state = designerReducer(state, {
        type: 'MOVE_SECTION',
        payload: { sectionId: section1.id, direction: 'up' },
      })
      
      expect(state.page.sections[0].id).toBe(section1.id)
    })
  })

  describe('REORDER_SECTION', () => {
    it('should reorder section to target index', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('features', 1)
      const section3 = createSectionFromTemplate('cta', 2)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section3 },
      })
      
      // Push history before reorder
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move section3 to index 0 (first position)
      state = designerReducer(state, {
        type: 'REORDER_SECTION',
        payload: { sectionId: section3.id, targetIndex: 0 },
      })
      
      expect(state.page.sections[0].id).toBe(section3.id)
      expect(state.page.sections[1].id).toBe(section1.id)
      expect(state.page.sections[2].id).toBe(section2.id)
      expect(state.page.sections[0].order).toBe(0)
      expect(state.page.sections[1].order).toBe(1)
      expect(state.page.sections[2].order).toBe(2)
    })

    it('should not change order when dropping at same position', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('features', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      // Push history before reorder
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move section1 to index 0 (same position)
      state = designerReducer(state, {
        type: 'REORDER_SECTION',
        payload: { sectionId: section1.id, targetIndex: 0 },
      })
      
      expect(state.page.sections[0].id).toBe(section1.id)
      expect(state.page.sections[1].id).toBe(section2.id)
    })

    it('should ignore invalid target index', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      
      // Push history before reorder
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Try to move to invalid index
      state = designerReducer(state, {
        type: 'REORDER_SECTION',
        payload: { sectionId: section1.id, targetIndex: 5 },
      })
      
      // Should not change
      expect(state.page.sections).toHaveLength(1)
      expect(state.page.sections[0].id).toBe(section1.id)
    })
  })

  describe('ADD_ELEMENT', () => {
    it('should add an element to a section', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      const element = {
        id: generateId(),
        type: 'heading' as const,
        order: section.elements.length,
        props: { text: 'New Heading', level: 'h2' as const },
        styles: {},
      }
      
      state = designerReducer(state, {
        type: 'ADD_ELEMENT',
        payload: { sectionId: section.id, element },
      })
      
      const updatedSection = state.page.sections.find((s) => s.id === section.id)
      expect(updatedSection?.elements.length).toBeGreaterThan(section.elements.length)
      expect(state.selectedElementId).toBe(element.id)
    })
  })

  describe('REMOVE_ELEMENT', () => {
    it('should remove an element from a section', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      const elementToRemove = section.elements[0]
      
      state = designerReducer(state, {
        type: 'REMOVE_ELEMENT',
        payload: { sectionId: section.id, elementId: elementToRemove.id },
      })
      
      const updatedSection = state.page.sections.find((s) => s.id === section.id)
      expect(updatedSection?.elements.find((e) => e.id === elementToRemove.id)).toBeUndefined()
      expect(state.selectedElementId).toBeNull()
    })
  })

  describe('UPDATE_ELEMENT_PROPS', () => {
    it('should update element props', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      const element = section.elements[0]
      
      state = designerReducer(state, {
        type: 'UPDATE_ELEMENT_PROPS',
        payload: {
          sectionId: section.id,
          elementId: element.id,
          props: { text: 'Updated Title' },
        },
      })
      
      const updatedSection = state.page.sections.find((s) => s.id === section.id)
      const updatedElement = updatedSection?.elements.find((e) => e.id === element.id)
      expect(updatedElement?.props).toMatchObject({ text: 'Updated Title' })
    })
  })

  describe('MOVE_ELEMENT', () => {
    it('should move element to target index', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      const element1 = section.elements[0] // heading
      const element2 = section.elements[1] // text
      const element3 = section.elements[2] // button
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move element3 (button) to index 0 (first position)
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT',
        payload: { sectionId: section.id, elementId: element3.id, targetIndex: 0 },
      })
      
      const updatedSection = state.page.sections.find((s) => s.id === section.id)
      expect(updatedSection?.elements[0].id).toBe(element3.id)
      expect(updatedSection?.elements[1].id).toBe(element1.id)
      expect(updatedSection?.elements[2].id).toBe(element2.id)
      expect(updatedSection?.elements[0].order).toBe(0)
      expect(updatedSection?.elements[1].order).toBe(1)
      expect(updatedSection?.elements[2].order).toBe(2)
    })

    it('should not change order when dropping at same position', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      const element1 = section.elements[0]
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move element1 to index 0 (same position)
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT',
        payload: { sectionId: section.id, elementId: element1.id, targetIndex: 0 },
      })
      
      const updatedSection = state.page.sections.find((s) => s.id === section.id)
      expect(updatedSection?.elements[0].id).toBe(element1.id)
    })

    it('should ignore invalid target index', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      const element1 = section.elements[0]
      const originalOrder = section.elements.map(e => e.id)
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Try to move to invalid index
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT',
        payload: { sectionId: section.id, elementId: element1.id, targetIndex: 10 },
      })
      
      const updatedSection = state.page.sections.find((s) => s.id === section.id)
      expect(updatedSection?.elements.map(e => e.id)).toEqual(originalOrder)
    })
  })

  describe('MOVE_ELEMENT_CROSS_SECTION', () => {
    it('should move element from one section to another', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      const elementToMove = section1.elements[1] // text from section1
      const originalElementCount1 = section1.elements.length
      const originalElementCount2 = section2.elements.length
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move element from section1 to section2
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT_CROSS_SECTION',
        payload: {
          sourceSectionId: section1.id,
          targetSectionId: section2.id,
          elementId: elementToMove.id,
          targetIndex: 0,
        },
      })
      
      const updatedSection1 = state.page.sections.find(s => s.id === section1.id)
      const updatedSection2 = state.page.sections.find(s => s.id === section2.id)
      
      // Element should be removed from section1
      expect(updatedSection1?.elements.length).toBe(originalElementCount1 - 1)
      expect(updatedSection1?.elements.find(e => e.id === elementToMove.id)).toBeUndefined()
      
      // Element should be added to section2
      expect(updatedSection2?.elements.length).toBe(originalElementCount2 + 1)
      expect(updatedSection2?.elements[0].id).toBe(elementToMove.id)
      
      // Should select the target section and element
      expect(state.selectedSectionId).toBe(section2.id)
      expect(state.selectedElementId).toBe(elementToMove.id)
      
      // Should mark as unsaved
      expect(state.hasUnsavedChanges).toBe(true)
    })

    it('should preserve element ID when moving cross-section', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      const elementToMove = section1.elements[0]
      const originalId = elementToMove.id
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move element
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT_CROSS_SECTION',
        payload: {
          sourceSectionId: section1.id,
          targetSectionId: section2.id,
          elementId: elementToMove.id,
          targetIndex: 0,
        },
      })
      
      const updatedSection2 = state.page.sections.find(s => s.id === section2.id)
      const movedElement = updatedSection2?.elements.find(e => e.id === originalId)
      
      // ID should be preserved
      expect(movedElement).toBeDefined()
      expect(movedElement?.id).toBe(originalId)
    })

    it('should not duplicate element when moving cross-section', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      const elementToMove = section1.elements[0]
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move element
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT_CROSS_SECTION',
        payload: {
          sourceSectionId: section1.id,
          targetSectionId: section2.id,
          elementId: elementToMove.id,
          targetIndex: 0,
        },
      })
      
      // Count all occurrences of the element ID across all sections
      const allElementIds = state.page.sections.flatMap(s => s.elements.map(e => e.id))
      const occurrences = allElementIds.filter(id => id === elementToMove.id).length
      
      // Should only appear once
      expect(occurrences).toBe(1)
    })

    it('should handle undo after cross-section move', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      const elementToMove = section1.elements[0]
      const originalSection1Count = section1.elements.length
      const originalSection2Count = section2.elements.length
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move element
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT_CROSS_SECTION',
        payload: {
          sourceSectionId: section1.id,
          targetSectionId: section2.id,
          elementId: elementToMove.id,
          targetIndex: 0,
        },
      })
      
      // Verify move happened
      expect(state.page.sections.find(s => s.id === section1.id)?.elements.find(e => e.id === elementToMove.id)).toBeUndefined()
      expect(state.page.sections.find(s => s.id === section2.id)?.elements.find(e => e.id === elementToMove.id)).toBeDefined()
      
      // Undo
      state = designerReducer(state, { type: 'UNDO' })
      
      // After undo, element should be back in section1
      expect(state.page.sections.find(s => s.id === section1.id)?.elements.length).toBe(originalSection1Count)
    })

    it('should mark as unsaved after cross-section move', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      const elementToMove = section1.elements[0]
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Move element
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT_CROSS_SECTION',
        payload: {
          sourceSectionId: section1.id,
          targetSectionId: section2.id,
          elementId: elementToMove.id,
          targetIndex: 0,
        },
      })
      
      // Should mark as unsaved
      expect(state.hasUnsavedChanges).toBe(true)
    })

    it('should ignore invalid source section', () => {
      const initialState = createEmptyState()
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('cta', 1)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section: section1 },
      })
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section: section2 },
      })
      
      const originalCounts = state.page.sections.map(s => s.elements.length)
      
      // Push history before move
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Try to move with invalid source section
      state = designerReducer(state, {
        type: 'MOVE_ELEMENT_CROSS_SECTION',
        payload: {
          sourceSectionId: 'invalid-id',
          targetSectionId: section2.id,
          elementId: section1.elements[0].id,
          targetIndex: 0,
        },
      })
      
      // Nothing should change
      const newCounts = state.page.sections.map(s => s.elements.length)
      expect(newCounts).toEqual(originalCounts)
    })
  })

  describe('SELECT_SECTION', () => {
    it('should select a section', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      state = designerReducer(state, {
        type: 'SELECT_SECTION',
        payload: { sectionId: section.id },
      })
      
      expect(state.selectedSectionId).toBe(section.id)
      expect(state.selectedElementId).toBeNull()
    })
  })

  describe('DESELECT_ALL', () => {
    it('should deselect all', () => {
      const initialState = createEmptyState()
      const section = createSectionFromTemplate('hero', 0)
      
      let state = designerReducer(initialState, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      state = designerReducer(state, {
        type: 'SELECT_SECTION',
        payload: { sectionId: section.id },
      })
      
      state = designerReducer(state, {
        type: 'DESELECT_ALL',
      })
      
      expect(state.selectedSectionId).toBeNull()
      expect(state.selectedElementId).toBeNull()
    })
  })

  describe('SET_DEVICE', () => {
    it('should set device type', () => {
      const initialState = createEmptyState()
      
      const state = designerReducer(initialState, {
        type: 'SET_DEVICE',
        payload: 'mobile',
      })
      
      expect(state.device).toBe('mobile')
    })
  })

  describe('UNDO/REDO', () => {
    it('should undo to previous state', () => {
      const initialState = createEmptyState()
      const page = initialState.page
      
      let state = designerReducer(initialState, {
        type: 'PUSH_HISTORY',
        payload: page,
      })
      
      const section = createSectionFromTemplate('hero', 0)
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      // Push new state to history
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Undo
      state = designerReducer(state, { type: 'UNDO' })
      
      expect(state.page.sections).toHaveLength(0)
    })

    it('should redo to next state', () => {
      const initialState = createEmptyState()
      const page = initialState.page
      
      let state = designerReducer(initialState, {
        type: 'PUSH_HISTORY',
        payload: page,
      })
      
      const section = createSectionFromTemplate('hero', 0)
      state = designerReducer(state, {
        type: 'ADD_SECTION',
        payload: { section },
      })
      
      // Push new state to history
      state = designerReducer(state, {
        type: 'PUSH_HISTORY',
        payload: state.page,
      })
      
      // Undo
      state = designerReducer(state, { type: 'UNDO' })
      
      // Redo
      state = designerReducer(state, { type: 'REDO' })
      
      expect(state.page.sections).toHaveLength(1)
    })
  })

  describe('SET_SAVING', () => {
    it('should set saving state', () => {
      const initialState = createEmptyState()
      
      let state = designerReducer(initialState, {
        type: 'SET_SAVING',
        payload: true,
      })
      
      expect(state.isSaving).toBe(true)
      
      state = designerReducer(state, {
        type: 'SET_SAVING',
        payload: false,
      })
      
      expect(state.isSaving).toBe(false)
    })
  })

  describe('SET_UNSAVED', () => {
    it('should set unsaved state', () => {
      const initialState = createEmptyState()
      
      let state = designerReducer(initialState, {
        type: 'SET_UNSAVED',
        payload: true,
      })
      
      expect(state.hasUnsavedChanges).toBe(true)
      
      state = designerReducer(state, {
        type: 'SET_UNSAVED',
        payload: false,
      })
      
      expect(state.hasUnsavedChanges).toBe(false)
    })
  })
})
