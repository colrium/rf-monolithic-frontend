import React, { useMemo, useCallback, useRef } from "react";
import { AutoSizer, Collection, WindowScroller } from 'react-virtualized';
import { useSetState } from "hooks";

const VirtualizedCollection = (props) => {
    const { data, cellRenderer, gutterSize = 10, itemWidth = 100, itemHeight = 100, columnCount = 3, onScrollToEnd, ...rest } = props;
    const [state, setState] = useSetState({
        horizontalOverscanSize: 0,
        scrollToCell: undefined,
        verticalOverscanSize: 0,
    })
    const cellCount = useMemo(() => (data.length), [data]);
    const rowCount = useMemo(() => Math.ceil((cellCount / columnCount)), [columnCount, cellCount]);
    const rowHeight = useMemo(() => (itemHeight + (gutterSize * 2)), [gutterSize, itemHeight]);
    const height = useMemo(() => (rowCount * rowHeight), [rowCount, rowHeight]);
    const width = useMemo(() => ((columnCount * itemWidth) + (gutterSize * (columnCount * 2))), [columnCount, gutterSize, itemWidth]);
    const columnYMap = useRef([]);
    const columnXMap = useRef([]);

    const getCellSizeAndPosition = useCallback(({ index }) => {
        const columnPosition = index % (columnCount || 1);
        const datum = data[index % data.length];
        // Poor man's Masonry layout; columns won't all line up equally with the bottom.
        const cellHeight = datum.height || itemHeight;
        const cellWidth = datum.width || itemWidth;
        const x = columnXMap.current[columnPosition] || ((columnPosition * cellWidth) + (gutterSize * columnPosition) + gutterSize);
        const y = (columnYMap.current[columnPosition] || 0) + gutterSize;
        columnXMap.current[columnPosition] = x;
        columnYMap.current[columnPosition] = y + cellHeight;

        return { height: cellHeight, width: cellWidth, x, y, };
    }, [data, columnCount, gutterSize, itemWidth, itemHeight]);

    const handleOnScroll = useCallback(({ scrollLeft, scrollTop }) => {
        
    }, [onScrollToEnd, height, width])

    return (
        <WindowScroller onScroll={handleOnScroll}>
            {({ isScrolling, onChildScroll, scrollTop }) => (
                <Collection
                    autoHeight
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    cellCount={cellCount}
                    cellRenderer={cellRenderer}
                    cellSizeAndPositionGetter={getCellSizeAndPosition}
                    height={height}
                    horizontalOverscanSize={0}
                    noContentRenderer={() => (<div>No data</div>)}
                    scrollToCell={state.scrollToCell}
                    verticalOverscanSize={0}
                    width={width}
                    {...rest}
                />
            )}
        </WindowScroller>
    );
};

export default VirtualizedCollection;