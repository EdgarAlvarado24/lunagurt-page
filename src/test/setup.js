import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
beforeEach(() => {
  cleanup()
})

// Mock window methods before each test
beforeEach(() => {
  window.scrollTo = vi.fn()
  window.open = vi.fn()
})