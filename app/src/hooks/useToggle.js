import { useState, useCallback } from 'react';

const useToggle = (initialState = '', values = []) => {
    const [state, setState] = useState(initialState);

    const toggleState = useCallback(() => {
        let nextState = !state;
        if (!Array.isEmpty(values)) {
            let indexOfcurrentValue = values.indexOf(state);
            if (indexOfcurrentValue !== -1 && indexOfcurrentValue < (values.length - 1)) {
                nextState = values[(indexOfcurrentValue + 1)];
            }
            else {
                nextState = values[0];
            }
        }
        setState(nextState);
    }, [state]);
    return [state, toggleState];
};

export default useToggle;