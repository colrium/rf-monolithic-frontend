import { useEffect, useRef } from 'react';

const useDidMount = (callback = () => {}, useEffectHabitCurb=[]) => {
    const isMountedRef = useRef(false);
    useEffect(() => {        
        isMountedRef.current = true;
        if (Function.isFunction(callback)) {
            let res = callback();
        }
        return () => {
            isMountedRef.current = false;
        }
    }, []);
    return isMountedRef.current;
};

export default useDidMount;