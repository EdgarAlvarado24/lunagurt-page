import { useState, useCallback, useMemo } from 'react'
import './App.css'

const WHATSAPP_NUMBER = '04145145068'

const FLAVORS = [
  { name: 'Fresa', emoji: '🍓' },
  { name: 'Piña', emoji: '🍍' },
  { name: 'Mora', emoji: '🫐' },
  { name: 'Durazno', emoji: '🍑' },
  { name: 'Parchita', emoji: '🍊' },
  { name: 'Natural', emoji: '🥛' },
  { name: 'Tamarindo', emoji: '🫘' },
  { name: 'Coco Piña', emoji: '🥥' },
]

const PRODUCTS = [
  { id: 'individual', name: 'Yogur Individual', desc: 'El sabor puro de la naturaleza en un frasco de 250ml', price: 5, emoji: '🧋', featured: false },
  { id: 'duo', name: 'Dúo de Yogures', desc: 'Ideal para compartir o disfrutar en dos momentos', price: 10, emoji: '🍯', featured: false },
  { id: 'family', name: 'Pack Familiar (Combo 3)', desc: 'Tres yogures variados para toda la familia', price: 13, emoji: '📦', featured: true },
]

function ProgressIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'Pedido' },
    { num: 2, label: 'Sabores' },
    { num: 3, label: 'Detalles' },
  ]

  const progressWidth = currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'

  return (
    <div className="progress-container">
      <div className="progress-line" />
      <div className="progress-line-fill" style={{ width: progressWidth }} />
      {steps.map(step => (
        <div key={step.num} className="progress-step">
          <div className={`progress-dot ${currentStep >= step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}>
            {currentStep > step.num ? '✓' : step.num}
          </div>
          <span className={`progress-label ${currentStep >= step.num ? 'active' : ''}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function ProductCard({ product, quantity, onIncrement, onDecrement }) {
  return (
    <article className={`product-card ${product.featured ? 'featured' : ''}`}>
      {product.featured && <span className="product-badge">PRECIO ESPECIAL</span>}
      <div className="product-image">
        <div className="product-placeholder">{product.emoji}</div>
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">${product.price}</span>
        </div>
        <p className="product-desc">{product.desc}</p>
        <div className="quantity-controls">
          <button 
            className="qty-btn" 
            onClick={onDecrement}
            aria-label={`Decrementar ${product.name}`}
          >−</button>
          <span className="qty-value">{quantity}</span>
          <button 
            className="qty-btn primary" 
            onClick={onIncrement}
            aria-label={`Incrementar ${product.name}`}
          >+</button>
        </div>
      </div>
    </article>
  )
}

function Step1({ quantities, onIncrement, onDecrement, totalYogurts, onContinue }) {
  return (
    <section className="section" id="step-1">
      <h2 className="section-title">Selecciona tu Pedido</h2>
      <div className="product-grid">
        {PRODUCTS.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.id]}
            onIncrement={() => onIncrement(product.id)}
            onDecrement={() => onDecrement(product.id)}
          />
        ))}
      </div>
      <div className="btn-container">
        <button 
          className="btn primary" 
          onClick={onContinue}
          disabled={totalYogurts === 0}
        >
          Continuar →
        </button>
      </div>
    </section>
  )
}

function Step2({ totalYogurts, selectedFlavors, onToggleFlavor, onContinue, onBack }) {
  return (
    <section className="section" id="step-2">
      <h2 className="section-title">Elige tus Sabores</h2>
      
      <div className="flavor-counter">
        <div className="flavor-counter-number">
          Sabores seleccionados: {selectedFlavors.length} / {totalYogurts}
        </div>
        <p className="flavor-counter-label">
          Selecciona tus sabores favoritos según la cantidad de yogures en tu pedido.
        </p>
      </div>
      
      <div className="flavor-grid">
        {FLAVORS.map(flavor => {
          const isSelected = selectedFlavors.includes(flavor.name)
          return (
            <div 
              key={flavor.name} 
              className="flavor-card"
              onClick={() => onToggleFlavor(flavor.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onToggleFlavor(flavor.name)}
            >
              <div className={`flavor-image ${isSelected ? 'selected' : ''}`}>
                <div className="product-placeholder">{flavor.emoji}</div>
                <div className="flavor-overlay" />
                <div className="flavor-check">✓</div>
              </div>
              <h3 className="flavor-name">{flavor.name}</h3>
            </div>
          )
        })}
      </div>
      
      <div className="btn-group">
        <button className="btn secondary" onClick={onBack}>
          Regresar
        </button>
        <button 
          className="btn primary" 
          onClick={onContinue}
          disabled={selectedFlavors.length !== totalYogurts || totalYogurts === 0}
        >
          Continuar →
        </button>
      </div>
    </section>
  )
}

function Step3({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' })
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])
  
  const handleSubmitForm = useCallback((e) => {
    e.preventDefault()
    if (formData.name && formData.address) {
      onSubmit(formData)
    }
  }, [formData, onSubmit])
  
  return (
    <section className="section" id="step-3">
      <div className="form-container">
        <h2 className="form-title">Detalles del Pedido</h2>
        <p className="form-subtitle">Completa tus datos para que podamos llevarte el sabor del campo.</p>
        
        <form onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nombre Completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Ej. María García"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="address">Dirección de Entrega *</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              placeholder="Ej. Calle principal 123"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Teléfono de Contacto</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Ej. 0414-123-4567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="btn-group" style={{ paddingTop: '32px' }}>
            <button type="button" className="btn secondary" onClick={onBack}>
              Regresar
            </button>
            <button type="submit" className="btn primary">
              <span>✓</span>
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function SuccessModal({ isOpen, onClose, formData, quantities, selectedFlavors }) {
  if (!isOpen) return null
  
  const totalYogurts = quantities.individual + quantities.duo * 2 + quantities.family * 3
  const flavorsList = selectedFlavors.join(', ')
  const summaryText = `Hola ${formData.name}, hemos preparado tu pedido de ${totalYogurts} yogures (${flavorsList}) para ser entregado en ${formData.address}.`
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🌱</div>
        <h3 className="modal-title">🍧 ¡Pedido Recibido!</h3>
        <p className="modal-summary">{summaryText}</p>
        <p className="modal-message">¡Gracias por tu pedido LunaGurt! Nos pondremos en contacto pronto.</p>
        <button className="modal-btn" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  )
}

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [quantities, setQuantities] = useState({ individual: 0, duo: 0, family: 0 })
  const [selectedFlavors, setSelectedFlavors] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' })
  
  const totalYogurts = useMemo(() => 
    quantities.individual + quantities.duo * 2 + quantities.family * 3, 
    [quantities]
  )
  
  const increment = useCallback((productId) => {
    setQuantities(prev => ({ ...prev, [productId]: prev[productId] + 1 }))
  }, [])
  
  const decrement = useCallback((productId) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(0, prev[productId] - 1) }))
  }, [])
  
  const toggleFlavor = useCallback((flavorName) => {
    setSelectedFlavors(prev => {
      if (prev.includes(flavorName)) {
        return prev.filter(f => f !== flavorName)
      }
      if (prev.length < totalYogurts) {
        return [...prev, flavorName]
      }
      return prev
    })
  }, [totalYogurts])
  
  const goToStep = useCallback((step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  const handleSubmit = useCallback((formData) => {
    const message = `🍧 *Nuevo Pedido LunaGurt* %0A%0A*Cliente:* ${formData.name}%0A*Dirección:* ${formData.address}${formData.phone ? '%0A*Teléfono:* ' + formData.phone : ''}%0A%0A*Pedido:*%0A- ${quantities.individual}x Yogur Individual ($${quantities.individual * 5})%0A- ${quantities.duo}x Dúo ($${quantities.duo * 10})%0A- ${quantities.family}x Pack Familiar ($${quantities.family * 13})%0A%0A*Sabores:* ${selectedFlavors.join(', ')}%0A%0A*Total yogures:* ${totalYogurts}%0A*Total:* $${quantities.individual * 5 + quantities.duo * 10 + quantities.family * 13}`
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
    setShowModal(true)
  }, [quantities, selectedFlavors, totalYogurts])
  
  const closeModal = useCallback(() => {
    setShowModal(false)
    setQuantities({ individual: 0, duo: 0, family: 0 })
    setSelectedFlavors([])
    setFormData({ name: '', address: '', phone: '' })
    setCurrentStep(1)
  }, [])
  
  return (
    <div className="app">
      <header className="header">
        <div className="header-icon"><img width={`128px`} src='converted_lunagurt.svg'/></div>
        <h1 className="header-title">Bienvenidos a <span className="text-brand-pink">Luna</span>Gurt</h1>
        <p className="header-subtitle">
          Yogures frescos elaborados con amor y tradición, traídos directamente desde nuestra granja sostenible hasta su mesa.
        </p>
      </header>
      
      <main className="main-content">
        <ProgressIndicator currentStep={currentStep} />
        
        {currentStep === 1 && (
          <Step1 
            quantities={quantities}
            onIncrement={increment}
            onDecrement={decrement}
            totalYogurts={totalYogurts}
            onContinue={() => goToStep(2)}
          />
        )}
        
        {currentStep === 2 && (
          <Step2 
            totalYogurts={totalYogurts}
            selectedFlavors={selectedFlavors}
            onToggleFlavor={toggleFlavor}
            onContinue={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}
        
        {currentStep === 3 && (
          <Step3 
            onSubmit={handleSubmit}
            onBack={() => goToStep(2)}
          />
        )}
      </main>
      
      <SuccessModal 
        isOpen={showModal}
        onClose={closeModal}
        formData={formData}
        quantities={quantities}
        selectedFlavors={selectedFlavors}
      />
      
      <footer className="footer">
        <p className="footer-text">© 2025 LunaGurt - Delicioso y saludable</p>
      </footer>
    </div>
  )
}

export default App