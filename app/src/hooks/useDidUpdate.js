import { useRef, useEffect } from 'react';
import { useFirstMountState } from 'react-use';

const useDidUpdate = (effect, deps = []) => {
    const isFirstMount = useFirstMountState();
    const depsRef = useRef(deps);

    useEffect(() => {
        if (!isFirstMount && !Object.areEqual(depsRef.current, deps)) {
            depsRef.current = deps;
            return effect();
        }
    }, deps);
};

export default useDidUpdate;