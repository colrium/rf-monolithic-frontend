/** @format */

import React, { Fragment, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import {
	Backdrop,
	Box,
	Checkbox,
	Chip,
	CircularProgress,
	Collapse,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Skeleton,
	Stack,
	Typography,
	Menu,
	MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import ReactJson from "react-json-view";
import { lighten, useTheme } from "@mui/material/styles";
import TableToolbar from "../TableToolbar";
import DataTableHead from "../TableHead";
import DataTableCell from "../TableCell";
import JSONView, { JSONViewDialog } from "components/JSONView";
import ScrollBars from "components/ScrollBars";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { grey, indigo } from "@mui/material/colors";
import SubTable from "../SubTable";
import { format, parseISO } from "date-fns";
import { useSetState } from "hooks";

function getKey(header) {
	return header.key || header.attribute;
}

export default function TableComponent(props) {
	const {
		title,
		rows,
		totalCount,
		descriptorAttribute,
		headers,
		order,
		orderBy,
		dense,
		loading,
		page,
		rowsPerPage,
		selected,
		handleRowClick,
		handleRowCellClick,
		handleRequestSort,
		onPageChange,
		onRowsPerPageChange,
		handleNestedAction,
		handleNestedFieldChange,
		handleActionClick,
		disableRowClick,
		handleUniversalFilterChange,
		handleDateChange,
		dates,
		actionButtons,
		showToolbar,
		collapsible,
		collapseHeaders,
		collapseContent,
		refreshBadgeCount,
		disableSelection,
		nestedRowAction,
		openRows,
		handleCollapseIconClick,
		selectibleRows,
		identifier,
		sort,
		disableCopyToClipboard,
		truncate,
	} = props;

	const theme = useTheme();

	const [state, setState, getState] = useSetState({
		objectDialog: {
			open: false,
			src: {},
			name: "",
		},
		contextMenu: null,
	});
	const sorting = useMemo(() => {
		let sortingValue = {};
		if (!String.isEmpty(sort)) {
			sortingValue = sort
				.split(",")
				.reduce((currentOrdersValue, entry) => {
					currentOrdersValue[entry.replace("-", "")] =
						entry.startsWith("-") ? "desc" : "asc";
					return currentOrdersValue;
				}, {});
		}
		return sortingValue;
	}, [sort]);

	const handleOnClickRowCell = React.useCallback(
		(data, header) => e => {
			if (
				JSON.isJSON(data) &&
				Function.isFunction(header?.resolveReferenceText)
			) {
				setState({
					objectDialog: {
						open: true,
						src: data,
						name: header?.label,
						title: header?.label,
					},
				});
			}
			if (Function.isFunction(handleRowCellClick)) {
				handleRowCellClick(e, data, header);
			}
		},
		[handleRowCellClick]
	);

	const isSelected = useCallback(
		row => {
			if (disableSelection) {
				return false;
			}
			return selected
				.map(item => item[identifier])
				.includes(row[identifier]);
		},
		[disableSelection, selected]
	);

	const isDisabled = useCallback(
		row => {
			selectibleRows !== null &&
				!selectibleRows.includes(row[identifier]);
		},
		[selectibleRows]
	);

	const isSelectible = useCallback(
		row => {
			return (
				selectibleRows === null ||
				(selectibleRows !== null &&
					selectibleRows.includes(row[identifier]))
			);
		},
		[selectibleRows]
	);

	// const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const formatContent = useCallback(
		(header, content, additionalContent = null) => {
			if (!content) {
				return "";
			}

			if (header.date) {
				return format(parseISO(content), "d MMM yyyy");
			}
			if (header.datetime) {
				return `${format(parseISO(content), "d MMM yyyy")} ${format(
					parseISO(content),
					"h:mm:ss a"
				)}`;
			}
			if (header.time) {
				return format(parseISO(content), "h:mm:ss a");
			}
			if (header.truncate && String.isString(content)) {
				return content.truncate(header.truncate || truncate);
			}
			if (header.chip) {
				const [bgColor, borderColor] = header.color[content] || [
					indigo[50],
					indigo[200],
				];
				return (
					<Chip
						style={{
							backgroundColor: bgColor,
							border: `2px solid ${borderColor}`,
						}}
						label={content}
						size="small"
					/>
				);
			}
			if (header.price) {
				if (additionalContent) {
					return additionalContent + " " + content;
				}
				return "$ " + content;
			}
			return content;
		},
		[truncate]
	);

	const getCellDom = useCallback(
		(header, data) => {
			var key = getKey(header);
			var content,
				htmlContent,
				selected,
				checkboxDisabled,
				onClickCollapseIcon,
				collapseOpen,
				disabled;

			if (header.html) {
				htmlContent = formatContent(header, content);
			} else if (header.checkbox) {
				selected = isSelected(data);
				checkboxDisabled = !isSelectible(data);
			} else if (header.actions) {
				disabled = isDisabled(data);
			} else if (header.collapse) {
				onClickCollapseIcon = event =>
					handleCollapseIconClick(
						event,
						data[identifier],
						!openRows[data[identifier] || undefined]
					);
				collapseOpen = openRows[data[identifier]];
			}

			return (
				<DataTableCell
					className={`relative`}
					data={data}
					htmlContent={htmlContent}
					selected={selected}
					checkboxDisabled={checkboxDisabled}
					onClickCollapseIcon={onClickCollapseIcon}
					collapseOpen={collapseOpen}
					key={key}
					disabled={disabled}
					header={header}
					formatContent={formatContent}
					onClick={handleOnClickRowCell(data[key], header)}
					disableCopyToClipboard={disableCopyToClipboard}
					truncate={truncate}
				/>
			);
		},
		[disableCopyToClipboard, truncate, rows]
	);

	const handleContextMenu = useCallback(event => {
		event.preventDefault();
		// const {contextMenu} = getState();
		setState(prevState => ({
			contextMenu:
				prevState.contextMenu === null
					? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
					: null,
		}));
	}, []);

	const handleCloseContextMenu = () => {
		setState({ contextMenu: null });
	};

	const getRowSpan = useCallback(
		row => {
			return headers
				.map(header => {
					if (header.arrayAttribute) {
						return (JSON.get(row, header.childAttribute) || [])
							.length;
					}
					return 1;
				})
				.reduce((max, curr) => Math.max(max, curr), 0);
		},
		[headers]
	);

	const handleOnPageChange = useCallback(
		(...args) => {
			if (Function.isFunction(onPageChange)) {

			}
		},
		[onPageChange]
	)

	return (
		<Box sx={{ width: "100%" }}>
			<JSONViewDialog
				humanize
				fullScreen={false}
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
			<Paper sx={{ position: "relative", width: "100%", mb: 2 }}>
				{showToolbar ? (
					<TableToolbar
						selected={selected.length > 0 ? selected[0] : {}}
						descriptorAttribute={descriptorAttribute}
						handleActionClick={(event, action) =>
							handleActionClick(event, action)
						}
						actionButtons={actionButtons}
						handleUniversalFilterChange={
							handleUniversalFilterChange
						}
						handleDateChange={handleDateChange}
						dates={dates}
						loading={loading}
						refreshBadgeCount={refreshBadgeCount}
						disableSelection={disableSelection}
					/>
				) : null}
				<ScrollBars>
					<Table
						aria-labelledby="tableTitle"
						size={dense ? "small" : "medium"}
						aria-label={title}
						stickyHeader
					>
						<DataTableHead
							headers={headers}
							order={order}
							orderBy={orderBy}
							sorting={sorting}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{loading && (
								<TableRow>
									<TableCell
										className={"p-4 text-center"}
										colSpan={headers?.length || 1}
									>
										<CircularProgress
											size={24}
											color="accent"
										/>
									</TableCell>
								</TableRow>
							)}
							{!loading &&
								Array.isArray(rows) &&
								rows.length === 0 && (
									<TableRow>
										<TableCell
											className={"p-4 text-center"}
											colSpan={headers?.length || 1}
										>
											<Stack
												className="p-0 m-0"
												justify="center"
												alignItems="center"
											>
												<img
													alt="Empty list"
													className={"h-32 w-32"}
													src={
														"https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/empty-state-table.svg"
													}
												/>
												<Typography
													className={"m-4 capitalize"}
													variant="h3"
													fullWidth
												>
													Noting
												</Typography>
											</Stack>
										</TableCell>
									</TableRow>
								)}
							{Array.isArray(rows) &&
								rows.length > 0 &&
								rows.map((row, index) => {
									var isItemSelected = isSelected(row)
									return (
										<Fragment
											key={row[identifier] || index}
										>
											<TableRow
												hover={isSelectible(row)}
												onClick={event => {
													if (disableRowClick) return
													if (collapsible) {
														handleCollapseIconClick(
															event,
															row[identifier],
															!openRows[
																row[
																	identifier
																] || undefined
															]
														)
													}
													if (handleRowClick) {
														handleRowClick(
															event,
															row
														)
													}
												}}
												role="checkbox"
												aria-checked={isItemSelected}
												tabIndex={-1}
												selected={isItemSelected}
												rowSpan={getRowSpan(row)}
												sx={{
													opacity: isDisabled(row)
														? 0.3
														: 1,
													cursor: isSelectible(row)
														? "pointer"
														: "auto",
												}}
											>
												{headers.map(header => {
													if (header.arrayAttribute) {
														return (
															<SubTable
																key={getKey(
																	header
																)}
																header={header}
																row={row}
																handleNestedAction={
																	handleNestedAction
																}
																handleNestedFieldChange={
																	handleNestedFieldChange
																}
																nestedRowAction={
																	nestedRowAction
																}
																formatContent={
																	formatContent
																}
															/>
														)
													}
													return getCellDom(
														header,
														row
													)
												})}
											</TableRow>
											{collapsible && (
												<TableRow
													style={{
														backgroundColor:
															lighten(
																theme.palette
																	.primary
																	.light,
																0.9
															),
													}}
												>
													<TableCell
														style={{
															paddingBottom: 0,
															paddingTop: 0,
														}}
														colSpan={headers.length}
													>
														<Collapse
															in={
																openRows[
																	row[
																		identifier
																	] ||
																		undefined
																]
															}
															timeout="auto"
															mountOnEnter
															unmountOnExit
														>
															<Box margin={1}>
																{collapseContent ? (
																	collapseContent[
																		index
																	]
																) : (
																	<Table
																		size="small"
																		aria-label="details"
																	>
																		<TableHead>
																			<TableRow>
																				{collapseHeaders.map(
																					head => (
																						<TableCell
																							key={getKey(
																								head
																							)}
																						>
																							{
																								head.label
																							}
																						</TableCell>
																					)
																				)}
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			<TableRow>
																				{collapseHeaders.map(
																					head =>
																						getCellDom(
																							head,
																							row
																						)
																				)}
																			</TableRow>
																		</TableBody>
																	</Table>
																)}
															</Box>
														</Collapse>
													</TableCell>
												</TableRow>
											)}
										</Fragment>
									)
								})}
							{/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={headers.length} />
                </TableRow>
              )} */}
						</TableBody>
					</Table>
				</ScrollBars>
				{!!totalCount && !loading && (
					<TablePagination
						rowsPerPageOptions={[5, 10, 25, 50, 100, 250, 500]}
						component="div"
						count={totalCount || 0}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleOnPageChange}
						onRowsPerPageChange={onRowsPerPageChange}
					/>
				)}
				<Menu
					open={state.contextMenu !== null}
					onClose={handleCloseContextMenu}
					anchorReference="anchorPosition"
					anchorPosition={
						state.contextMenu !== null
							? {
									top: state.contextMenu.mouseY,
									left: state.contextMenu.mouseX,
							  }
							: undefined
					}
				>
					<MenuItem onClick={handleCloseContextMenu}>Copy</MenuItem>
					<MenuItem onClick={handleCloseContextMenu}>Print</MenuItem>
					<MenuItem onClick={handleCloseContextMenu}>
						Highlight
					</MenuItem>
					<MenuItem onClick={handleCloseContextMenu}>Email</MenuItem>
				</Menu>
				{/* <Backdrop
					sx={{
						zIndex: theme.zIndex.modal + 1,
						color: "#fff",
						position: "absolute",
					}}
					open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop> */}
			</Paper>
		</Box>
	)
}

TableComponent.defaultProps = {
	order: "asc",
	orderBy: "id",
	dense: true,
	loading: false,
	page: 1,
	rowsPerPage: 10,
	selected: [],
	handleRowClick: () => {},
	handleRequestSort: () => {},
	handleNestedAction: () => {},
	handleNestedFieldChange: () => {},
	handleActionClick: () => {},
	disableRowClick: false,
	handleUniversalFilterChange: () => {},
	handleDateChange: () => {},
	dates: {
		from: format(new Date(), "yyyy-MM-dd"),
		to: format(new Date(), "yyyy-MM-dd"),
	},
	// actionButtons: ["create", "edit", "delete", "filter"],
	actionButtons: ["delete"],
	showToolbar: false,
	collapsible: false,
	collapseHeaders: [],
	collapseContent: null,
	refreshBadgeCount: 0,
	disableSelection: false,
	nestedRowAction: {},
	openRows: {},
	handleCollapseIconClick: () => {},
	selectibleRows: null,
	identifier: "id",
	disableCopyToClipboard: false,
	truncate: 100,
};

TableComponent.propTypes = {
	title: PropTypes.string,
	rows: PropTypes.array.isRequired,
	totalCount: PropTypes.number,
	descriptorAttribute: PropTypes.string,
	headers: PropTypes.array.isRequired,
	dense: PropTypes.bool,
	order: PropTypes.oneOf(["", "asc", "desc"]),
	orderBy: PropTypes.string,
	loading: PropTypes.bool,
	page: PropTypes.number,
	rowsPerPage: PropTypes.number,
	selected: PropTypes.array,
	handleRowClick: PropTypes.func,
	handleRequestSort: PropTypes.func,
	onPageChange: PropTypes.func,
	onRowsPerPageChange: PropTypes.func,
	handleNestedAction: PropTypes.func,
	handleNestedFieldChange: PropTypes.func,
	handleActionClick: PropTypes.func,
	disableRowClick: PropTypes.bool,
	handleUniversalFilterChange: PropTypes.func,
	handleDateChange: PropTypes.func,
	dates: PropTypes.object,
	actionButtons: PropTypes.array,
	showToolbar: PropTypes.bool,
	collapsible: PropTypes.bool,
	collapseHeaders: PropTypes.array,
	collapseContent: PropTypes.array,
	refreshBadgeCount: PropTypes.number,
	disableSelection: PropTypes.bool,
	nestedRowAction: PropTypes.object,
	openRows: PropTypes.object,
	handleCollapseIconClick: PropTypes.func,
	selectibleRows: PropTypes.array,
	identifier: PropTypes.string,
	disableCopyToClipboard: PropTypes.bool,
};
