import React from "react"

import ErrorBoundary from "./ErrorBoundary"



const createErrorBoundary = (onDidCatch) => {
    // Return function component that wraps ErrorBoundary and passes props to it
    return function UseErrorBoundaryWrapper(props) {
        // Return ErrorBoundary with original onDidCatch and the current props
        return React.createElement(ErrorBoundary, {
            onDidCatch,
            children: props.children,
            render: props.render,
            renderError: props.renderError,
        })
    }
}

export default createErrorBoundary;