/** @format */

import React, { Fragment, useMemo, useCallback } from "react";
import { Backdrop, Box, TableRow, Typography } from "@mui/material"


export const DataTableRow = React.forwardRef((props, ref) => {
	const {
		data,
		headers,
		collapsible,
		collapseHeaders,
		collapseContent,
		openRows,
		selected,
		rowSpan,
		onClick,
		onContextMenu,
		index,
		identifier,
		disableCopyToClipboard,
		truncate,
		...rest
	} = props

	const handleOnRowClick = useCallback(() => {}, [])

	const handleOnClick = useCallback(() => {}, [])

    const handleOnContextMenu = useCallback(() => {}, [])

	const isDisabled = useCallback(() => {}, [])

    const getRowSpan = useCallback(() => {}, [])

	const isSelectible = useCallback(() => {}, [])

    const getKey = useCallback(() => {}, [])

	const getCellDom = useCallback(
		(header, data) => {
			var key = getKey(header)
			var content, htmlContent, selected, checkboxDisabled, onClickCollapseIcon, collapseOpen, disabled

			if (header.html) {
				htmlContent = formatContent(header, content)
			} else if (header.checkbox) {
				selected = isSelected(data)
				checkboxDisabled = !isSelectible(data)
			} else if (header.actions) {
				disabled = isDisabled(data)
			} else if (header.collapse) {
				onClickCollapseIcon = event => handleCollapseIconClick(event, data[identifier], !openRows[data[identifier] || undefined])
				collapseOpen = openRows[data[identifier]]
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
			)
		},
		[disableCopyToClipboard, truncate]
	)

	return (
		<Fragment key={data[identifier] || index}>
			<TableRow
				hover={isSelectible(data)}
				onClick={event => {
					if (disableRowClick) return
					if (collapsible) {
						handleCollapseIconClick(event, data[identifier], !openRows[data[identifier] || undefined])
					}
					if (handleRowClick) {
						handleRowClick(event, data)
					}
				}}
				role="checkbox"
				aria-checked={selected}
				tabIndex={-1}
				selected={selected}
				rowSpan={getRowSpan(data)}
				sx={{
					opacity: isDisabled(data) ? 0.3 : 1,
					cursor: isSelectible(data) ? "pointer" : "auto",
				}}
			>
				{headers.map(header => {
					if (header.arrayAttribute) {
						return (
							<SubTable
								key={getKey(header)}
								header={header}
								row={data}
								handleNestedAction={handleNestedAction}
								handleNestedFieldChange={handleNestedFieldChange}
								nestedRowAction={nestedRowAction}
								formatContent={formatContent}
							/>
						)
					}
					return getCellDom(header, data)
				})}
			</TableRow>
			{collapsible && (
				<TableRow
					style={{
						backgroundColor: lighten(theme.palette.primary.light, 0.9),
					}}
				>
					<TableCell
						style={{
							paddingBottom: 0,
							paddingTop: 0,
						}}
						colSpan={headers.length}
					>
						<Collapse in={openRows[data[identifier] || undefined]} timeout="auto" mountOnEnter unmountOnExit>
							<Box margin={1}>
								{collapseContent ? (
									collapseContent[index]
								) : (
									<Table size="small" aria-label="details">
										<TableHead>
											<TableRow>
												{collapseHeaders.map(head => (
													<TableCell key={getKey(head)}>{head.label}</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>{collapseHeaders.map(head => getCellDom(head, data))}</TableRow>
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

});

export default React.memo(DataTableRow);
