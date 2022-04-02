import React, { useState, useEffect, useCallback } from "react";

// Usage 
//const { execute, status, value, error } = useAsync(myFunction, false);

// Hook
const useAsync = (asyncFunction, immediate = false) => {
	const [status, setStatus] = useState("idle");
	const [value, setValue] = useState(null);
	const [error, setError] = useState(null);
	// The execute function wraps asyncFunction and
	// handles setting state for pending, value, and error.
	// useCallback ensures the below useEffect is not called
	// on every render, but only if asyncFunction changes.
	 
	const execute = useCallback((...args) => {
        setStatus("pending");
        setValue(null);
        setError(null);
        let context = this;

        let result = asyncFunction.apply(null, args);
        Promise.all([result]).then((response) => {
            setValue(response[0]);
            setStatus("success");
        }).catch((error) => {
            setError(error);
            setStatus("error");
        });
    }, [asyncFunction]);
	// Call execute if we want to fire it right away.
	// Otherwise execute can be called later, such as
	// in an onClick handler.
	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, [execute, immediate]);
	return { execute, status, value, error };
};

export default useAsync;