/** @format */

import React, { useMemo, useCallback, useRef } from "react";
import classNames from "classnames";
import { Column, Table, AutoSizer, WindowScroller } from "react-virtualized";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ReactJson from "react-json-view";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ScrollBars from "components/ScrollBars";
import { useSetState } from "hooks";
import { useWindowSize } from "react-use";
import headerRowRenderer from "./headerRowRenderer";
import rowRenderer from "./rowRenderer";

const ObjectDialog = props => {
	const { onClose, src, name, open } = props;

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>{name}</DialogTitle>
			<DialogContent>
				<ReactJson
					name={"value"}
					src={src}
					enableClipboard={true}
					displayDataTypes={false}
				/>
			</DialogContent>
			<DialogActions>
				<Button color={"error"} onClick={handleClose} autoFocus>
					Dismiss
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const VirtualizedTable = React.forwardRef((props, ref) => {
	const {
		data,
		columns,
		onScrollToEnd,
		onRowClick,
		rowHeight,
		headerHeight,
		height,
		width,
		...rest
	} = props;

	const windowSize = useWindowSize();

	const [state, setState] = useSetState({
		objectDialog: {
			open: false,
			src: {},
			name: "",
		},
	});

	const tableWidth = useMemo(() => {
		let tableWidthValue = 0;
		if (Array.isArray(columns) && columns.length > 0) {
			tableWidthValue = columns.reduce(
				(previousTableWidth, column, index, columnsArray) =>
					previousTableWidth + (column?.width || 240),
				0
			);
		}
		return tableWidthValue;
	}, [columns]);

	const rowGetter = useCallback(
		({ index }) => {
			if (Array.isArray(data) && index < data.length) {
				return data[index];
			}
			return undefined;
		},
		[data]
	);

	const handleOnScroll = useCallback(
		({ scrollLeft, scrollTop }) => {
			if (Function.isFunction(onScrollToEnd)) {
				// onScrollToEnd()
			}
		},
		[onScrollToEnd]
	);

	const cellRenderer = useCallback(
		({ cellData, columnIndex }) => {
			return (
				<TableCell
					component="div"
					className={
						"flex items-center justify-center text-center border-0 box-border "
					}
					variant="body"
					style={{
						height: rowHeight || 64,
						minWidth: columns[columnIndex]?.width || 240,
					}}
					align={
						(columnIndex != null &&
							columns[columnIndex]?.numeric) ||
						false
							? "right"
							: "left"
					}>
					{Object.isObject(cellData) ? (
						<Button
							variant="text"
							color="secondary"
							onClick={() =>
								setState({
									objectDialog: {
										open: true,
										src: cellData,
										name: columns[columnIndex]?.label,
									},
								})
							}>
							View
						</Button>
					) : (
						<span className="whitespace-pre-wrap">{cellData}</span>
					)}
				</TableCell>
			);
		},
		[rowHeight, columns]
	);
	const headerRenderer = useCallback(
		({ label, columnIndex }) => {
			return (
				<TableCell
					component="div"
					className={
						" flex items-center justify-center text-center border-0 font-bold box-border capitalize"
					}
					variant="head"
					style={{
						height: headerHeight || 64,
						minWidth: columns[columnIndex]?.width || 240,
					}}
					align={
						columns[columnIndex]?.numeric || false
							? "right"
							: "left"
					}>
					<span>{label}</span>
				</TableCell>
			);
		},
		[headerHeight, columns]
	);

	const getRowClassName = useCallback(
		({ index }) =>
			classNames({
				"py-2 flex items-center box-border transition-all ": true,
				"hover:bg-gray-600 hover:bg-opacity-5": index !== -1,
				ponter: index !== -1 && onRowClick != null,
			}),
		[headerHeight, columns]
	);
	return (
		<Box className="relative">
			<ObjectDialog
				{...state.objectDialog}
				onClose={() =>
					setState({
						objectDialog: {
							open: false,
							src: {},
							name: "",
						},
					})
				}
			/>
			<ScrollBars>
				<Table
					width={width > 0 ? width : tableWidth}
					height={height > 0 ? height : windowSize.height * 0.6}
					rowCount={data?.length}
					rowGetter={rowGetter}
					rowHeight={rowHeight}
					headerHeight={headerHeight}
					rowClassName={getRowClassName}
					headerRowRenderer={headerRowRenderer}
					rowRenderer={rowRenderer}
					{...rest}
					ref={ref}>
					{Array.isArray(columns) &&
						columns.length > 0 &&
						columns.map(
							({ width, ...columnProps }, columnIndex) => (
								<Column
									label="Column"
									dataKey="column"
									headerRenderer={headerProps =>
										headerRenderer({
											...headerProps,
											columnIndex,
										})
									}
									cellRenderer={cellRenderer}
									{...columnProps}
									style={{ minWidth: width || 240 }}
									className={` flex items-center box-border ${
										columnProps?.className
											? columnProps.className
											: ""
									}`}
									key={columnIndex}
								/>
							)
						)}
				</Table>
			</ScrollBars>
		</Box>
	);
});

VirtualizedTable.defaultProps = {
	headerHeight: 48,
	rowHeight: 48,
};
export default React.memo(VirtualizedTable);
