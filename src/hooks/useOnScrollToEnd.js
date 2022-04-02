
import { useEffect } from "react"
import useOnScroll from "./useOnScroll";
import { useFirstMountState } from 'react-use';

const useOnScrollToEnd = (callback, ref) => {
    const { scrollHeight, scrollTop, scrollBottom, clientHeight } = useOnScroll(ref);
    const isFirstMount = useFirstMountState();

    useEffect(() => {

        if (!isFirstMount && scrollHeight > clientHeight && scrollBottom === 0 && Function.isFunction(callback)) {
            callback();
        }
        return () => {

        }
    }, [scrollBottom, isFirstMount])
}

export default useOnScrollToEnd;