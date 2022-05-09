import { useState } from 'react';

const useMark = () => {
    const [mark, setMark] = useState(Date.now());
    const updateMark = () => setMark(Date.now())
    return [mark, updateMark];
}

export default useMark;