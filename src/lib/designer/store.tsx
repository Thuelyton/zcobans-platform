'use client'

/**
 * Visual Designer Store
 * ZCobans Visual Designer
 *
 * Context + useReducer para gerenciar o estado do Designer.
 * Esta é a única fonte de verdade do Designer.
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type {
  DesignerState,
  DesignerAction,
  DesignerPage,
  DesignerSection,
  DesignerElement,
  DeviceType,
  SectionStyles,
  ElementStyles,
  ElementProps,
} from './types'
import {
  deepClone,
  saveToLocalStorage,
  loadFromLocalStorage,
  DESIGNER_STORAGE_KEY,
  AUTO_SAVE_INTERVAL,
  MAX_HISTORY_SIZE,
} from './utils'
import { createDefaultPage } from './templates'

// ============================================================================
// INITIAL STATE
// ============================================================================

function createInitialState(): DesignerState {
  return {
    page: createDefaultPage(),
    selectedSectionId: null,
    selectedElementId: null,
    device: 'desktop',
    history: [],
    historyIndex: -1,
    isSaving: false,
    hasUnsavedChanges: false,
  }
}

// ============================================================================
// REDUCER
// ============================================================================

function designerReducer(state: DesignerState, action: DesignerAction): DesignerState {
  switch (action.type) {
    // ========================================================================
    // PAGE ACTIONS
    // ========================================================================
    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload,
        hasUnsavedChanges: false,
        selectedSectionId: null,
        selectedElementId: null,
      }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        page: {
          ...state.page,
          settings: { ...state.page.settings, ...action.payload },
        },
        hasUnsavedChanges: true,
      }

    // ========================================================================
    // SECTION ACTIONS
    // ========================================================================
    case 'ADD_SECTION': {
      const { section, index } = action.payload
      const sections = [...state.page.sections]
      
      if (index !== undefined && index >= 0) {
        sections.splice(index, 0, section)
      } else {
        sections.push(section)
      }

      // Reorder all sections
      const reorderedSections = sections.map((s, i) => ({
        ...s,
        order: i,
      }))

      return {
        ...state,
        page: {
          ...state.page,
          sections: reorderedSections,
        },
        selectedSectionId: section.id,
        selectedElementId: null,
        hasUnsavedChanges: true,
      }
    }

    case 'REMOVE_SECTION': {
      const { sectionId } = action.payload
      const sections = state.page.sections
        .filter((s) => s.id !== sectionId)
        .map((s, i) => ({ ...s, order: i }))

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        selectedSectionId:
          state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        selectedElementId: null,
        hasUnsavedChanges: true,
      }
    }

    case 'UPDATE_SECTION': {
      const { sectionId, updates } = action.payload
      const sections = state.page.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      )

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        hasUnsavedChanges: true,
      }
    }

    case 'UPDATE_SECTION_STYLES': {
      const { sectionId, styles } = action.payload
      const sections = state.page.sections.map((s) =>
        s.id === sectionId
          ? { ...s, styles: { ...s.styles, ...styles } }
          : s
      )

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        hasUnsavedChanges: true,
      }
    }

    case 'MOVE_SECTION': {
      const { sectionId, direction } = action.payload
      const sections = [...state.page.sections]
      const index = sections.findIndex((s) => s.id === sectionId)

      if (index === -1) return state

      const targetIndex = direction === 'up' ? index - 1 : index + 1

      if (targetIndex < 0 || targetIndex >= sections.length) return state

      // Swap
      const temp = sections[index]
      sections[index] = sections[targetIndex]
      sections[targetIndex] = temp

      // Reorder
      const reorderedSections = sections.map((s, i) => ({
        ...s,
        order: i,
      }))

      return {
        ...state,
        page: {
          ...state.page,
          sections: reorderedSections,
        },
        hasUnsavedChanges: true,
      }
    }

    case 'REORDER_SECTION': {
      const { sectionId, targetIndex } = action.payload
      const sections = [...state.page.sections]
      const sourceIndex = sections.findIndex((s) => s.id === sectionId)

      if (sourceIndex === -1 || targetIndex < 0 || targetIndex >= sections.length) {
        return state
      }

      // Remove section from source
      const [movedSection] = sections.splice(sourceIndex, 1)

      // Insert at target position
      sections.splice(targetIndex, 0, movedSection)

      // Reorder all sections
      const reorderedSections = sections.map((s, i) => ({
        ...s,
        order: i,
      }))

      return {
        ...state,
        page: {
          ...state.page,
          sections: reorderedSections,
        },
        hasUnsavedChanges: true,
      }
    }

    // ========================================================================
    // ELEMENT ACTIONS
    // ========================================================================
    case 'ADD_ELEMENT': {
      const { sectionId, element, index } = action.payload
      const sections = state.page.sections.map((s) => {
        if (s.id !== sectionId) return s

        const elements = [...s.elements]
        if (index !== undefined && index >= 0) {
          elements.splice(index, 0, element)
        } else {
          elements.push(element)
        }

        // Reorder
        const reorderedElements = elements.map((e, i) => ({
          ...e,
          order: i,
        }))

        return { ...s, elements: reorderedElements }
      })

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        selectedSectionId: sectionId,
        selectedElementId: element.id,
        hasUnsavedChanges: true,
      }
    }

    case 'REMOVE_ELEMENT': {
      const { sectionId, elementId } = action.payload
      const sections = state.page.sections.map((s) => {
        if (s.id !== sectionId) return s

        const elements = s.elements
          .filter((e) => e.id !== elementId)
          .map((e, i) => ({ ...e, order: i }))

        return { ...s, elements }
      })

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        selectedElementId:
          state.selectedElementId === elementId ? null : state.selectedElementId,
        hasUnsavedChanges: true,
      }
    }

    case 'UPDATE_ELEMENT': {
      const { sectionId, elementId, updates } = action.payload
      const sections = state.page.sections.map((s) => {
        if (s.id !== sectionId) return s

        const elements = s.elements.map((e) =>
          e.id === elementId ? { ...e, ...updates } : e
        )

        return { ...s, elements }
      })

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        hasUnsavedChanges: true,
      }
    }

    case 'UPDATE_ELEMENT_PROPS': {
      const { sectionId, elementId, props } = action.payload
      const sections = state.page.sections.map((s) => {
        if (s.id !== sectionId) return s

        const elements = s.elements.map((e) =>
          e.id === elementId
            ? { ...e, props: { ...e.props, ...props } as ElementProps }
            : e
        )

        return { ...s, elements }
      })

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        hasUnsavedChanges: true,
      }
    }

    case 'UPDATE_ELEMENT_STYLES': {
      const { sectionId, elementId, styles } = action.payload
      const sections = state.page.sections.map((s) => {
        if (s.id !== sectionId) return s

        const elements = s.elements.map((e) =>
          e.id === elementId
            ? { ...e, styles: { ...e.styles, ...styles } }
            : e
        )

        return { ...s, elements }
      })

      return {
        ...state,
        page: {
          ...state.page,
          sections,
        },
        hasUnsavedChanges: true,
      }
    }

    // ========================================================================
    // SELECTION ACTIONS
    // ========================================================================
    case 'SELECT_SECTION':
      return {
        ...state,
        selectedSectionId: action.payload.sectionId,
        selectedElementId: null,
      }

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedSectionId: action.payload.sectionId,
        selectedElementId: action.payload.elementId,
      }

    case 'DESELECT_ALL':
      return {
        ...state,
        selectedSectionId: null,
        selectedElementId: null,
      }

    // ========================================================================
    // DEVICE
    // ========================================================================
    case 'SET_DEVICE':
      return {
        ...state,
        device: action.payload,
      }

    // ========================================================================
    // HISTORY (UNDO/REDO)
    // ========================================================================
    case 'UNDO': {
      if (state.historyIndex <= 0) return state

      const newIndex = state.historyIndex - 1
      const previousPage = state.history[newIndex]

      return {
        ...state,
        page: deepClone(previousPage),
        historyIndex: newIndex,
        hasUnsavedChanges: true,
      }
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state

      const newIndex = state.historyIndex + 1
      const nextPage = state.history[newIndex]

      return {
        ...state,
        page: deepClone(nextPage),
        historyIndex: newIndex,
        hasUnsavedChanges: true,
      }
    }

    case 'PUSH_HISTORY': {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(deepClone(action.payload))

      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift()
      }

      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    }

    // ========================================================================
    // SAVING
    // ========================================================================
    case 'SET_SAVING':
      return {
        ...state,
        isSaving: action.payload,
      }

    case 'SET_UNSAVED':
      return {
        ...state,
        hasUnsavedChanges: action.payload,
      }

    default:
      return state
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

interface DesignerContextValue {
  state: DesignerState
  dispatch: React.Dispatch<DesignerAction>

  // Convenience methods
  addSection: (section: DesignerSection) => void
  removeSection: (sectionId: string) => void
  updateSection: (sectionId: string, updates: Partial<DesignerSection>) => void
  updateSectionStyles: (sectionId: string, styles: Partial<SectionStyles>) => void
  moveSection: (sectionId: string, direction: 'up' | 'down') => void
  reorderSection: (sectionId: string, targetIndex: number) => void

  addElement: (sectionId: string, element: DesignerElement) => void
  removeElement: (sectionId: string, elementId: string) => void
  updateElement: (sectionId: string, elementId: string, updates: Partial<DesignerElement>) => void
  updateElementProps: (sectionId: string, elementId: string, props: Partial<ElementProps>) => void
  updateElementStyles: (sectionId: string, elementId: string, styles: Partial<ElementStyles>) => void

  selectSection: (sectionId: string | null) => void
  selectElement: (sectionId: string, elementId: string | null) => void
  deselectAll: () => void

  setDevice: (device: DeviceType) => void

  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  save: () => Promise<void>
  setPage: (page: DesignerPage) => void
}

const DesignerContext = createContext<DesignerContextValue | null>(null)

// ============================================================================
// PROVIDER
// ============================================================================

interface DesignerProviderProps {
  children: ReactNode
  initialPage?: DesignerPage
}

export function DesignerProvider({ children, initialPage }: DesignerProviderProps) {
  // Initialize state from localStorage or default
  const getInitialState = useCallback((): DesignerState => {
    if (initialPage) {
      return {
        ...createInitialState(),
        page: initialPage,
      }
    }

    const savedPage = loadFromLocalStorage<DesignerPage>(DESIGNER_STORAGE_KEY)
    if (savedPage) {
      return {
        ...createInitialState(),
        page: savedPage,
        hasUnsavedChanges: false,
      }
    }

    return createInitialState()
  }, [initialPage])

  const [state, dispatch] = useReducer(designerReducer, null, getInitialState)

  // Push initial state to history
  const hasInitializedHistory = useRef(false)
  useEffect(() => {
    if (!hasInitializedHistory.current) {
      hasInitializedHistory.current = true
      dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    }
  }, [])

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.hasUnsavedChanges && !state.isSaving) {
        saveToLocalStorage(DESIGNER_STORAGE_KEY, state.page)
        dispatch({ type: 'SET_UNSAVED', payload: false })
      }
    }, AUTO_SAVE_INTERVAL)

    return () => clearInterval(interval)
  }, [state.hasUnsavedChanges, state.isSaving, state.page])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.hasUnsavedChanges) {
        saveToLocalStorage(DESIGNER_STORAGE_KEY, state.page)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [state.hasUnsavedChanges, state.page])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        dispatch({ type: 'UNDO' })
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault()
        dispatch({ type: 'REDO' })
      }

      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }

      // Delete/Backspace = Remove selected element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't remove if typing in an input
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return
        }

        if (state.selectedElementId && state.selectedSectionId) {
          dispatch({
            type: 'REMOVE_ELEMENT',
            payload: {
              sectionId: state.selectedSectionId,
              elementId: state.selectedElementId,
            },
          })
        } else if (state.selectedSectionId) {
          dispatch({
            type: 'REMOVE_SECTION',
            payload: { sectionId: state.selectedSectionId },
          })
        }
      }

      // Escape = Deselect
      if (e.key === 'Escape') {
        dispatch({ type: 'DESELECT_ALL' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.selectedSectionId, state.selectedElementId])

  // Convenience methods
  const addSection = useCallback((section: DesignerSection) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'ADD_SECTION', payload: { section } })
  }, [dispatch, state.page])

  const removeSection = useCallback((sectionId: string) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'REMOVE_SECTION', payload: { sectionId } })
  }, [dispatch, state.page])

  const updateSection = useCallback((sectionId: string, updates: Partial<DesignerSection>) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'UPDATE_SECTION', payload: { sectionId, updates } })
  }, [dispatch, state.page])

  const updateSectionStyles = useCallback((sectionId: string, styles: Partial<SectionStyles>) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'UPDATE_SECTION_STYLES', payload: { sectionId, styles } })
  }, [dispatch, state.page])

  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'MOVE_SECTION', payload: { sectionId, direction } })
  }, [dispatch, state.page])

  const reorderSection = useCallback((sectionId: string, targetIndex: number) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'REORDER_SECTION', payload: { sectionId, targetIndex } })
  }, [dispatch, state.page])

  const addElement = useCallback((sectionId: string, element: DesignerElement) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'ADD_ELEMENT', payload: { sectionId, element } })
  }, [dispatch, state.page])

  const removeElement = useCallback((sectionId: string, elementId: string) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'REMOVE_ELEMENT', payload: { sectionId, elementId } })
  }, [dispatch, state.page])

  const updateElement = useCallback((sectionId: string, elementId: string, updates: Partial<DesignerElement>) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'UPDATE_ELEMENT', payload: { sectionId, elementId, updates } })
  }, [dispatch, state.page])

  const updateElementProps = useCallback((sectionId: string, elementId: string, props: Partial<ElementProps>) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'UPDATE_ELEMENT_PROPS', payload: { sectionId, elementId, props } })
  }, [dispatch, state.page])

  const updateElementStyles = useCallback((sectionId: string, elementId: string, styles: Partial<ElementStyles>) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'UPDATE_ELEMENT_STYLES', payload: { sectionId, elementId, styles } })
  }, [dispatch, state.page])

  const selectSection = useCallback((sectionId: string | null) => {
    dispatch({ type: 'SELECT_SECTION', payload: { sectionId } })
  }, [dispatch])

  const selectElement = useCallback((sectionId: string, elementId: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: { sectionId, elementId } })
  }, [dispatch])

  const deselectAll = useCallback(() => {
    dispatch({ type: 'DESELECT_ALL' })
  }, [dispatch])

  const setDevice = useCallback((device: DeviceType) => {
    dispatch({ type: 'SET_DEVICE', payload: device })
  }, [dispatch])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [dispatch])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [dispatch])

  const setPage = useCallback((page: DesignerPage) => {
    dispatch({ type: 'PUSH_HISTORY', payload: state.page })
    dispatch({ type: 'SET_PAGE', payload: page })
  }, [dispatch, state.page])

  const handleSave = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', payload: true })
    try {
      saveToLocalStorage(DESIGNER_STORAGE_KEY, state.page)
      // Simulate async save
      await new Promise((resolve) => setTimeout(resolve, 300))
      dispatch({ type: 'SET_UNSAVED', payload: false })
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false })
    }
  }, [dispatch, state.page])

  // Create the value
  const contextValue: DesignerContextValue = {
    state,
    dispatch,
    addSection,
    removeSection,
    updateSection,
    updateSectionStyles,
    moveSection,
    reorderSection,
    addElement,
    removeElement,
    updateElement,
    updateElementProps,
    updateElementStyles,
    selectSection,
    selectElement,
    deselectAll,
    setDevice,
    undo,
    redo,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    save: handleSave,
    setPage,
  }

  return (
    <DesignerContext.Provider value={contextValue}>
      {children}
    </DesignerContext.Provider>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access the Designer context
 */
export function useDesigner(): DesignerContextValue {
  const context = useContext(DesignerContext)
  if (!context) {
    throw new Error('useDesigner must be used within a DesignerProvider')
  }
  return context
}

/**
 * Hook to get just the designer state
 */
export function useDesignerState(): DesignerState {
  const { state } = useDesigner()
  return state
}

// ============================================================================
// REDUCER EXPORT (for testing)
// ============================================================================

export { designerReducer, createInitialState }
