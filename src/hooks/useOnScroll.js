
import { useEffect, useCallback } from "react";
import useSetState from "./useSetState";

const useOnScroll = (ref, throttle = 250) => {
    const [state, setState] = useSetState({
        scrollHeight: 0,
        scrollTop: 0,
        scrollBottom: 0,
        clientHeight: 0,
    });


    const handleOnScroll = useCallback(Function.debounce((event) => {
        let element = event.target;
        setState({
            scrollHeight: element.scrollHeight,
            scrollTop: element.scrollTop,
            scrollBottom: element.scrollHeight - (element.scrollTop + element.clientHeight),
            clientHeight: element.clientHeight
        })
    }, throttle), []);

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        ref.current.addEventListener('scroll', handleOnScroll);
        return () => {
            //cleanup
            if (ref.current) {
                ref.current.addEventListener('scroll', handleOnScroll);
            }

        }
    }, [ref])

    return state;
};

export default useOnScroll;