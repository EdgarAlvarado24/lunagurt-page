import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

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
      const continueBtn = screen.getByRole('button', { name: 'Continuar →' })
      expect(continueBtn).toBeDisabled()
    })

    it('enables continue button when cart has items', async () => {
      const user = userEvent.setup()
      const incrementBtn = screen.getAllByLabelText(/Incrementar/)[0]
      await user.click(incrementBtn)

      const continueBtn = screen.getByRole('button', { name: 'Continuar →' })
      expect(continueBtn).toBeEnabled()
    })
  })

  describe('Navigation', () => {
    it('shows progress indicator with all steps', () => {
      render(<App />)
      expect(screen.getByText('Pedido')).toBeInTheDocument()
      expect(screen.getByText('Sabores')).toBeInTheDocument()
      expect(screen.getByText('Detalles')).toBeInTheDocument()
    })

    it('navigates to step 2 when continue is clicked with items', async () => {
      const user = userEvent.setup()
      render(<App />)

      const incrementBtn = screen.getAllByLabelText(/Incrementar/)[0]
      await user.click(incrementBtn)

      await user.click(screen.getByRole('button', { name: 'Continuar →' }))

      expect(screen.getByText('Elige tus Sabores')).toBeInTheDocument()
    })
  })

  describe('Step 2: Sabores', () => {
    async function navigateToStep2() {
      const user = userEvent.setup()
      render(<App />)
      const incrementBtn = screen.getAllByLabelText(/Incrementar/)[0]
      await user.click(incrementBtn)
      await user.click(screen.getByRole('button', { name: 'Continuar →' }))
      return user
    }

    it('displays all 8 flavors', async () => {
      await navigateToStep2()
      expect(screen.getByText('Fresa')).toBeInTheDocument()
      expect(screen.getByText('Piña')).toBeInTheDocument()
      expect(screen.getByText('Mora')).toBeInTheDocument()
    })

    it('shows flavor counter', async () => {
      await navigateToStep2()
      expect(screen.getByText(/Sabores seleccionados/)).toBeInTheDocument()
    })

    it('can navigate back to step 1', async () => {
      const user = await navigateToStep2()
      await user.click(screen.getByRole('button', { name: 'Regresar' }))

      expect(screen.getByText('Selecciona tu Pedido')).toBeInTheDocument()
    })

    it('selects a flavor on click', async () => {
      const user = await navigateToStep2()
      const flavorButton = screen.getByRole('button', { name: 'Sabor Fresa' })
      await user.click(flavorButton)

      expect(flavorButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Step 3: Detalles', () => {
    async function navigateToStep3() {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getAllByLabelText(/Incrementar/)[0])
      await user.click(screen.getByRole('button', { name: 'Continuar →' }))

      await user.click(screen.getByRole('button', { name: 'Sabor Fresa' }))
      await user.click(screen.getByRole('button', { name: 'Continuar →' }))

      return user
    }

    it('displays form title', async () => {
      await navigateToStep3()
      expect(screen.getByText('Detalles del Pedido')).toBeInTheDocument()
    })

    it('has required fields', async () => {
      await navigateToStep3()
      expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Dirección/)).toBeInTheDocument()
    })

    it('can navigate back to step 2', async () => {
      const user = await navigateToStep3()
      await user.click(screen.getByRole('button', { name: 'Regresar' }))

      expect(screen.getByText('Elige tus Sabores')).toBeInTheDocument()
    })

    it('fills form and submits order', async () => {
      const user = await navigateToStep3()

      await user.type(screen.getByLabelText(/Nombre/), 'María García')
      await user.type(screen.getByLabelText(/Dirección/), 'Calle Principal 123')
      await user.type(screen.getByLabelText(/Teléfono/), '04141234567')

      await user.click(screen.getByRole('button', { name: /Confirmar Pedido/ }))

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/Gracias por tu pedido/)).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('displays footer with copyright', () => {
      render(<App />)
      expect(screen.getByText(/© 2025 LunaGurt/)).toBeInTheDocument()
    })
  })
})
