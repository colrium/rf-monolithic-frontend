import { PureComponent } from "react"

export default class ErrorBoundary extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            hasError: false,
            error: null,
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        return this.props.onDidCatch(error, errorInfo)
    }

    render() {
        const { hasError, error } = this.state
        const { render, children, renderError } = this.props

        // Prevent rendering of children that caused the error, render fallbacks instead
        if (hasError) {
            // Render either components from renderError() or nothing
            return renderError ? renderError({ error }) : null
        }

        // Render either components from render() or children or null
        return render ? render() : children || null
    }
}