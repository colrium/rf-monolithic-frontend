import { useEffect } from 'react';


const useWillUnmount = (callback) => {
    // run only once
    useEffect(() => {
        return callback;
    }, []);
}

export default useWillUnmount;