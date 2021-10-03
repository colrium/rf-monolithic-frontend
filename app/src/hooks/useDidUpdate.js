import { useEffect } from 'react';
import useFirstMountState from './useFirstMountState';

const useDidUpdate = (effect, deps) => {
    const isFirstMount = useFirstMountState();

    useEffect(() => {
        if (!isFirstMount) {
            return effect();
        }
    }, deps);
};

export default useDidUpdate;
