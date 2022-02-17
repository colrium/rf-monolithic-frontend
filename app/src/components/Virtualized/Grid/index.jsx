import React, { useMemo, useCallback, useRef } from "react";
import { Grid, Collection, WindowScroller } from 'react-virtualized';
import { useSetState } from "hooks";

const VirtualizedGrid = (props) => {
    const { data, cellRenderer, gutterSize = 10, itemWidth = 100, itemHeight = 100, columnCount = 3, onScrollToEnd, scrollElement, ...rest } = props;
    const [state, setState] = useSetState({
        horizontalOverscanSize: 0,
        scrollToCell: undefined,
        verticalOverscanSize: 0,
    })
    const cellCount = (data.length);
    const rowCount = Math.ceil((cellCount / columnCount))
    const rowHeight = (itemHeight)
    const height = (rowCount * rowHeight)
    const width = (columnCount * itemWidth) + (gutterSize * (columnCount * 2))
    const columnYMap = useRef([]);
    const columnXMap = useRef([]);
    const containerRef = useRef(null);

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

    const handleOnScroll = useCallback(({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop }) => {
        const topOffset = containerRef.current?._positionFromTop || 0;
        const leftOffset = containerRef.current?._positionFromLeft || 0;
        const bottomPos = (clientHeight + topOffset);
        const scrollBottom = scrollHeight - (scrollTop + bottomPos);
        if (scrollBottom > 0 && scrollBottom <= itemHeight && Function.isFunction(onScrollToEnd)) {
            onScrollToEnd({ topOffset, leftOffset, clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop })

        }

    }, [onScrollToEnd, itemHeight, itemWidth] )

    const renderCell = useCallback( ( { rowIndex, columnIndex, ...rest } ) => {
        if( Function.isFunction( cellRenderer ) ) {
            let index = columnIndex + ( rowIndex * columnCount )
            return cellRenderer( {rowIndex, columnIndex, ...rest, index })
        }

    }, [columnCount, cellRenderer])

    /* return (
        <WindowScroller scrollElement={scrollElement || window} ref={containerRef}>
            {({ height, width, isScrolling, onChildScroll, scrollTop }) => (
                <Grid
                    autoHeight
                    cellRenderer={cellRenderer}
                    columnCount={columnCount}
                    columnWidth={itemWidth}
                    height={height}
                    rowCount={rowCount}
                    rowHeight={itemHeight}
                    width={width}
                    isScrolling={isScrolling}
                    onScroll={(event) => {
                        handleOnScroll(event)
                        onChildScroll(event)
                    }}
                    scrollTop={scrollTop}
                    {...rest}
                />
            )}
        </WindowScroller>
    ); */
    return (
        <Grid
            cellRenderer={renderCell}
                    columnCount={columnCount}
                    columnWidth={itemWidth}
                    rowCount={rowCount}
                    rowHeight={itemHeight}
                    onScroll={( event ) => {
                        handleOnScroll( event )
                    }}
            height={height}
            width={width}
                    {...rest}
                />
    );
};

export default VirtualizedGrid;
