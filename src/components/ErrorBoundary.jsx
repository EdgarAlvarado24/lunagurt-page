import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <h2>Algo salió mal</h2>
            <p>Estamos experimentando problemas técnicos. Por favor, recarga la página.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Recargar Página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
