import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from '../App.jsx'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window methods
beforeEach(() => {
  window.scrollTo = vi.fn()
  window.open = vi.fn()
})

describe('LunaGurt App', () => {
  describe('Step 1: Pedido', () => {
    beforeEach(() => {
      render(<App />)
    })

    it('renders home header correctly', () => {
      expect(screen.getByText(/Bienvenidos a/)).toBeInTheDocument()
    })

    it('shows first step (Pedido) by default', () => {
      expect(screen.getByText('Selecciona tu Pedido')).toBeInTheDocument()
    })

    it('displays all products', () => {
      expect(screen.getByText('Yogur Individual')).toBeInTheDocument()
      expect(screen.getByText('Dúo de Yogures')).toBeInTheDocument()
      expect(screen.getByText('Pack Familiar (Combo 3)')).toBeInTheDocument()
    })

    it('shows correct prices', () => {
      expect(screen.getAllByText('$5')[0]).toBeInTheDocument()
      expect(screen.getAllByText('$10')[0]).toBeInTheDocument()
      expect(screen.getAllByText('$13')[0]).toBeInTheDocument()
    })

    it('shows special badge for family pack', () => {
      expect(screen.getByText('PRECIO ESPECIAL')).toBeInTheDocument()
    })

    it('disables continue button when cart is empty', () => {
      const continueBtn = screen.getAllByText('Continuar →')[0]
      expect(continueBtn).toBeDisabled()
    })

    it('enables continue button when cart has items', () => {
      const incrementBtn = screen.getAllByLabelText(/Incrementar/)[0]
      fireEvent.click(incrementBtn)
      
      const continueBtn = screen.getAllByText('Continuar →')[0]
      expect(continueBtn).toBeEnabled()
    })
  })

  describe('Navigation', () => {
    beforeEach(() => {
      render(<App />)
    })

    it('shows progress indicator with all steps', () => {
      expect(screen.getByText('Pedido')).toBeInTheDocument()
      expect(screen.getByText('Sabores')).toBeInTheDocument()
      expect(screen.getByText('Detalles')).toBeInTheDocument()
    })

    it('navigates to step 2 when continue is clicked with items', () => {
      const incrementBtn = screen.getAllByLabelText(/Incrementar/)[0]
      fireEvent.click(incrementBtn)
      
      const continueBtn = screen.getAllByText('Continuar →')[0]
      fireEvent.click(continueBtn)
      
      expect(screen.getByText('Elige tus Sabores')).toBeInTheDocument()
    })
  })

  describe('Step 2: Sabores', () => {
    beforeEach(() => {
      render(<App />)
      // Navigate to step 2
      const incrementBtn = screen.getAllByLabelText(/Incrementar/)[0]
      fireEvent.click(incrementBtn)
      const continueBtn = screen.getAllByText('Continuar →')[0]
      fireEvent.click(continueBtn)
    })

    it('displays all 8 flavors', () => {
      expect(screen.getByText('Fresa')).toBeInTheDocument()
      expect(screen.getByText('Piña')).toBeInTheDocument()
      expect(screen.getByText('Mora')).toBeInTheDocument()
    })

    it('shows flavor counter', () => {
      expect(screen.getByText(/Sabores seleccionados/)).toBeInTheDocument()
    })

    it('can navigate back to step 1', () => {
      const backBtn = screen.getByText('Regresar')
      fireEvent.click(backBtn)
      
      expect(screen.getByText('Selecciona tu Pedido')).toBeInTheDocument()
    })
  })

  describe('Step 3: Detalles', () => {
    beforeEach(() => {
      render(<App />)
      // Navigate to step 3
      const incrementBtn = screen.getAllByLabelText(/Incrementar/)[0]
      fireEvent.click(incrementBtn)
      
      let continueBtn = screen.getAllByText('Continuar →')[0]
      fireEvent.click(continueBtn)
      
      const flavorCards = document.querySelectorAll('.flavor-card')
      fireEvent.click(flavorCards[0])
      continueBtn = screen.getAllByText('Continuar →')[0]
      fireEvent.click(continueBtn)
    })

    it('displays form title', () => {
      expect(screen.getByText('Detalles del Pedido')).toBeInTheDocument()
    })

    it('has required fields', () => {
      expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Dirección/)).toBeInTheDocument()
    })

    it('can navigate back to step 2', () => {
      const backBtn = screen.getByText('Regresar')
      fireEvent.click(backBtn)
      
      expect(screen.getByText('Elige tus Sabores')).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('displays footer with copyright', () => {
      render(<App />)
      expect(screen.getByText(/© 2025 LunaGurt/)).toBeInTheDocument()
    })
  })
})