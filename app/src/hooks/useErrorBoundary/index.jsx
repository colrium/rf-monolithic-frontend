import React, { useRef, useReducer, useCallback } from "react"

import createErrorBoundary from "./createErrorBoundary"


const errorBoundaryReducer = (state, action) => {
    switch (action.type) {
        // The component did catch, update state
        case "catch":
            return {
                didCatch: true,
                // Pass the values from action.error
                error: action.error,
            }
        case "reset":
            return {
                didCatch: false,
                error: null,
            }
        // Unknown action, return state
        default:
            return state
    }
}

const useErrorBoundary = (options) => {
    // Reducer handling the error state
    const [state, dispatch] = useReducer(errorBoundaryReducer, {
        didCatch: false,
        error: null,
    })
    // Create ref for wrapped ErrorBoundary class
    const errorBoundaryWrapperRef = useRef(null)

    // Create a new wrapped boundary
    const createWrappedErrorBoundary = () => {
        // Create new wrapped ErrorBoundary class with onDidCatch callback
        return createErrorBoundary((err, errorInfo) => {
            // Dispatch action in case of an error
            dispatch({
                type: "catch",
                error: err,
            })

            // call onDidCatch if provided by user
            if (options && options.onDidCatch) options.onDidCatch(err, errorInfo)
        })
    }

    // Get the current ref value or initialize it with a new wrapped ErrorBoundary
    const getWrappedErrorBoundary = () => {
        // Get current ref value
        let errorBoundaryWrapper = errorBoundaryWrapperRef.current

        // Return the component when already initialized
        if (errorBoundaryWrapper !== null) {
            return errorBoundaryWrapper
        }

        // Update the ref with new boundary
        errorBoundaryWrapperRef.current = createWrappedErrorBoundary()

        // Return the newly created component
        return errorBoundaryWrapperRef.current
    }

    const reset = useCallback(() => {
        // create a new wrapped boundary to force a rerender
        errorBoundaryWrapperRef.current = createWrappedErrorBoundary()
        // Reset the hooks error state
        dispatch({ type: "reset" })
    }, [])

    // Return the wrapped ErrorBoundary class to wrap your components in plus the error state
    return {
        ErrorBoundary: getWrappedErrorBoundary(),
        didCatch: state.didCatch,
        error: state.error,
        reset,
    }
}

export default useErrorBoundary