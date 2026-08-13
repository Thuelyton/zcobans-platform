import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateId,
  hexToRgb,
  rgbToHex,
  deepClone,
  debounce,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  DESIGNER_STORAGE_KEY,
  AUTO_SAVE_INTERVAL,
  MAX_HISTORY_SIZE,
} from '@/lib/designer/utils'

describe('Designer Utils', () => {
  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })

    it('should generate UUID format', () => {
      const id = generateId()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      expect(uuidRegex.test(id)).toBe(true)
    })
  })

  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('should handle hex without #', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull()
      expect(hexToRgb('#fff')).toBeNull()
      expect(hexToRgb('#gggggg')).toBeNull()
    })
  })

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00')
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff')
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
      expect(rgbToHex(0, 0, 0)).toBe('#000000')
    })

    it('should pad single digit values', () => {
      expect(rgbToHex(1, 2, 3)).toBe('#010203')
    })
  })

  describe('deepClone', () => {
    it('should deep clone objects', () => {
      const original = { a: 1, b: { c: 2 }, d: [3, 4] }
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
      expect(cloned.d).not.toBe(original.d)
    })

    it('should handle nested objects', () => {
      const original = { a: { b: { c: { d: 1 } } } }
      const cloned = deepClone(original)
      
      cloned.a.b.c.d = 2
      expect(original.a.b.c.d).toBe(1)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      expect(mockFn).not.toHaveBeenCalled()
      
      vi.advanceTimersByTime(100)
      
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to debounced function', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn('arg1', 'arg2')
      
      vi.advanceTimersByTime(100)
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('localStorage functions', () => {
    beforeEach(() => {
      // Mock localStorage
      const store: Record<string, string> = {}
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null)
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
        store[key] = value
      })
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
        delete store[key]
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should save to localStorage', () => {
      const data = { test: 'value' }
      saveToLocalStorage(DESIGNER_STORAGE_KEY, data)
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        DESIGNER_STORAGE_KEY,
        JSON.stringify(data)
      )
    })

    it('should load from localStorage', () => {
      const data = { test: 'value' }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(data))
      
      const loaded = loadFromLocalStorage(DESIGNER_STORAGE_KEY)
      
      expect(loaded).toEqual(data)
    })

    it('should return null for non-existent key', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      
      const loaded = loadFromLocalStorage(DESIGNER_STORAGE_KEY)
      
      expect(loaded).toBeNull()
    })

    it('should remove from localStorage', () => {
      removeFromLocalStorage(DESIGNER_STORAGE_KEY)
      
      expect(localStorage.removeItem).toHaveBeenCalledWith(DESIGNER_STORAGE_KEY)
    })
  })

  describe('constants', () => {
    it('should have correct storage key', () => {
      expect(DESIGNER_STORAGE_KEY).toBe('zcobans-designer')
    })

    it('should have correct auto-save interval', () => {
      expect(AUTO_SAVE_INTERVAL).toBe(30000)
    })

    it('should have correct max history size', () => {
      expect(MAX_HISTORY_SIZE).toBe(50)
    })
  })
})
