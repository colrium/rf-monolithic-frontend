
import { useRef } from "react";

const useLatest = (val) => {
    const ref = useRef(val);
    ref.current = val;
    return ref;
};

export default useLatest;