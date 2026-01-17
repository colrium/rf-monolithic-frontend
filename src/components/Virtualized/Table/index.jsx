/** @format */

import React, { useMemo } from "react";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList } from "react-window";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/styles";
import { JSONViewDialog } from "components/JSONView";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ScrollBars from "components/ScrollBars";
import { useSetState } from "hooks";
import { useWindowSize } from "react-use";

export const VirtualizedTableCell = props => {
	const { row, onClick, resolveRowCellObjText, ...cell } = props;
	const content = useMemo(() => {
		if (!JSON.isJSON(cell?.value)) {
			if (Function.isFunction(cell?.column?.Header?.renderRowCell)) {
				return cell.column.Header.renderRowCell(cell);
			} else {
				return cell.render("Cell");
			}
		} else {
			if (Function.isFunction(cell?.column?.Header?.renderRowCell)) {
				return cell.column.Header.renderRowCell(cell);
			} else {
				return (
					<Button variant="text" color="secondary" onClick={onClick}>
						{Function.isFunction(
							cell?.column?.Header?.resolveRowCellObjText
						)
							? cell.column.Header.resolveRowCellObjText(cell)
							: "View"}
					</Button>
				);
			}
		}
	}, [cell]);
	return <TableCell {...cell.getCellProps()}>{content}</TableCell>;
};

const VirtualizedTable = props => {
	const { columns, data, dataEditable, autoSize, defination, ...rest } =
		props;
	// Use the state and functions returned from useTable to build your UI
	const theme = useTheme();
	const [state, setState] = useSetState({
		objectDialog: {
			open: false,

			src: {},
			name: "",
		},
	});
	const defaultColumn = React.useMemo(
		() => ({
			width: 150,
		}),
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		totalColumnsWidth,
		prepareRow,
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
		},
		useBlockLayout
	);

	const handleOnClickCell = React.useCallback(cell => {
		if (JSON.isJSON(cell.value)) {
			setState({
				objectDialog: {
					open: true,
					src: cell?.value,
					name: cell?.column.Header,
					title: cell?.column.Header,
				},
			});
		}
	}, []);

	const renderRow = React.useCallback(
		({ index, style }) => {
			const row = rows[index];

			prepareRow(row);
			return (
				<TableRow
					{...row.getRowProps({
						style,
					})}>
					{row.cells.map(cell => (
						<VirtualizedTableCell
							onClick={() => handleOnClickCell(cell)}
							{...cell}
						/>
					))}
				</TableRow>
			);
		},
		[prepareRow, rows]
	);

	// Render the UI for your table
	return (
		<Box className="relative">
			<JSONViewDialog
				humanize
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
				<Table {...getTableProps()} className="inline-block ">
					<TableHead>
						{/* {headerGroups.map(headerGroup => (
						<div
							{...headerGroup.getHeaderGroupProps()}
							className="border-0">
							{headerGroup.headers.map(column => (
								<div
									{...column.getHeaderProps()}
									className="p-2">
									{column.render("Header")}
								</div>
							))}
						</div>
					))} */}
						{headerGroups.map(headerGroup => (
							<TableRow {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<TableCell {...column.getHeaderProps()}>
										{column.render("Header")}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>

					<TableBody {...getTableBodyProps()}>
						<FixedSizeList
							height={400}
							itemCount={rows.length}
							itemSize={48}
							width={totalColumnsWidth}>
							{renderRow}
						</FixedSizeList>
					</TableBody>
				</Table>
			</ScrollBars>
		</Box>
	);
};
export default React.memo(VirtualizedTable);
