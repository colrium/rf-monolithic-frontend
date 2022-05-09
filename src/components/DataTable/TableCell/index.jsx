/** @format */

import React, { useMemo, useCallback } from "react";
import {
	Backdrop,
	Box,
	Checkbox,
	Chip,
	CircularProgress,
	Collapse,
	IconButton,
	Tooltip,
	TableCell,
	Stack,
	Typography
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Check as CheckIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import JSONView from "components/JSONView";
import CopyToClipboardButton from "components/CopyToClipboardButton";


export const DataTableCell = React.forwardRef((props, ref) => {
	const {
		data,
		header,
		selected,
		htmlContent,
		collapseOpen,
		onClickCollapseIcon,
		truncate,
		checkboxDisabled,
		disabled,
		onClick,
		disableCopyToClipboard,
		...rest
	} = props

	const truncateSize = useMemo(() => {
		if (!!header.truncate && header.truncate > 0) {
			return header.truncate
		} else if (!!truncate && truncate > 0) {
			return truncate
		}
		return 100
	}, [truncate, header])

	const formatContent = useCallback(
		(header, content, additionalContent = null) => {
			if (!content) {
				return ""
			}

			if (header.date) {
				return Date.format(content, "d M Y")
			}
			if (header.datetime) {
				return `${Date.format(content, "d M Y")} ${Date.format(content, "h:i:s a")}`
			}
			if (header.time) {
				return Date.format(content, "h:i:s a")
			}
			if (String.isString(content) && content.length > truncateSize) {
				return content.truncate(truncateSize)
			}
			if (header.chip) {
				const [bgColor, borderColor] = header.color[content] || [indigo[50], indigo[200]]
				return (
					<Chip
						style={{
							backgroundColor: bgColor,
							border: `2px solid ${borderColor}`,
						}}
						label={content}
						size="small"
					/>
				)
			}
			if (header.price) {
				if (additionalContent) {
					return additionalContent + " " + content
				}
				return "$ " + content
			}
			return content
		},
		[truncate, truncateSize]
	)

	const content = useMemo(() => {
		var content

		if (header.multiField) {
			if (header.html) {
				content = header.html
				header.data.forEach((item, index) => {
					const value = JSON.getDeepPropertyValue(item.attribute, data) || ""
					content = content.replace(`{{${index}}}`, formatContent(item, value))
				})
			} else {
				content = ""
				header.data.forEach((item, index) => {
					const value = JSON.getDeepPropertyValue(item.attribute, data) || ""

					content += formatContent(item, value)
					if (index !== header.data.length - 1) {
						content += ", "
					}
				})
			}

			return content
		}

		if (header.html) {
			content = header.html
			return content.replace(`{{0}}`, JSON.getDeepPropertyValue(header.attribute, data))
		} else if (header.object || !!header.reference) {
			return Function.isFunction(header?.resolveReferenceText)
				? header.resolveReferenceText(JSON.getDeepPropertyValue(header.attribute, data), header)
				: JSON.getDeepPropertyValue(header.attribute, data)
		} else {
			content = JSON.getDeepPropertyValue(header.attribute, data)
		}
		return formatContent(header, content)

		return content
	}, [data, header])

	const headerClassName = useMemo(() => {
		if (header && Function.isFunction(header.className)) {
			return header.className(data, header)
		} else if (String.isString(header.className)) {
			return header.className
		}
		return ""
	}, [header, data])

	if (header.collapse) {
		return (
			<TableCell
				className={headerClassName}
				style={{
					width: header.width || null,
					minWidth: header.minWidth || null,
					maxWidth: header.maxWidth || null,
				}}
				ref={ref}
			>
				<Tooltip title={onClickCollapseIcon ? "Shrink" : "Expand"}>
					<IconButton aria-label="expand row" size="small" onClick={onClickCollapseIcon}>
						{onClickCollapseIcon ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
					</IconButton>
				</Tooltip>
			</TableCell>
		)
	} else if (header.boolean) {
		return (
			<TableCell className={`text-sm text-center ${headerClassName ? headerClassName : ""}`} padding="checkbox" ref={ref}>
				{Boolean(content) && <CheckIcon fontSize="inherit" color="primary" />}
				{/* <Checkbox
						checked={Boolean(content)}
					/> */}
			</TableCell>
		)
	} else if (header.checkbox) {
		return (
			<TableCell className={`text-sm text-center ${headerClassName ? headerClassName : ""}`} padding="checkbox" ref={ref}>
				<Checkbox checked={selected} disabled={checkboxDisabled} />
			</TableCell>
		)
	} else if (header.component) {
		return (
			<TableCell
				className={headerClassName}
				align={header.numeric ? "right" : "left"}
				style={{
					width: header.width || null,
					minWidth: header.minWidth || null,
					maxWidth: header.maxWidth || null,
				}}
				onClick={event => (header.stopPropagation ? event.stopPropagation() : {})}
				ref={ref}
			>
				{header.component(data)}
			</TableCell>
		)
	} else if (header.html) {
		return (
			<TableCell
				className={headerClassName}
				align={header.numeric ? "right" : "left"}
				dangerouslySetInnerHTML={{
					__html: htmlContent,
				}}
				style={{
					width: header.width || null,
					minWidth: header.minWidth || null,
					maxWidth: header.maxWidth || null,
				}}
				ref={ref}
			/>
		)
	} else if (header.actions) {
		return (
			<TableCell
				className={headerClassName}
				style={{
					width: header.width || null,
					minWidth: header.minWidth || null,
					maxWidth: header.maxWidth || null,
				}}
				ref={ref}
			>
				<div className="flex">
					{header.actions.map(
						(
							{
								id,
								icon,
								Icon,
								confirmationRequired,
								restricted,
								Component,
								hideCondition,
								linkProps,
								disableCondition,
								onClick,
								uri,
								color,
								tooltip,
								label,
								...action
							},
							actionIndex
						) =>
							(!hideCondition || (Function.isFunction(hideCondition) && !hideCondition(data))) && (
								<span key={`${actionIndex}`}>
									{!!Component && (
										<Component
											style={{
												color: disableCondition && disableCondition(data) ? grey[400] : color || "currentColor",
											}}
											size={"small"}
											{...action}
											data={data}
										/>
									)}
									{!Component && (!!Icon || !!icon) && (
										<Tooltip key={id} title={tooltip || label}>
											<span>
												{!!uri && (
													<Link to={Function.isFunction(uri) ? uri(data) : uri} {...linkProps}>
														<IconButton
															aria-label={id}
															style={{
																color:
																	(disableCondition && disableCondition(data)) || disabled
																		? grey[400]
																		: color || "currentColor",
															}}
															disabled={(disableCondition && disableCondition(data)) || disabled}
															size={"small"}
															{...action}
														>
															{!!Icon ? <Icon fontSize={"inherit"} /> : icon}
														</IconButton>
													</Link>
												)}
												{!uri && (
													<IconButton
														aria-label={id}
														onClick={event => {
															event.stopPropagation()
															if (Function.isFunction(onClick)) {
																onClick(event, data)
															}
														}}
														href={Function.isFunction(uri) ? uri(data) : uri}
														style={{
															color:
																disableCondition && disableCondition(data)
																	? grey[400]
																	: color || "currentColor",
														}}
														disabled={(disableCondition && disableCondition(data)) || disabled}
														size={"small"}
														{...action}
													>
														{!!Icon ? <Icon fontSize={"inherit"} /> : icon}
													</IconButton>
												)}
											</span>
										</Tooltip>
									)}
								</span>
							)
					)}
				</div>
			</TableCell>
		)
	} else {
		return (
			<TableCell
				className={`relative ${headerClassName}`}
				align={header.numeric ? "right" : "left"}
				sx={{
					width: header.width || "auto",
					minWidth: header.minWidth || "auto",
					maxWidth: header.maxWidth || "auto",
					"& .cell-actions-box": {
						visibility: "hidden",
						opacity: 0,
					},
					"&:hover .cell-actions-box": {
						visibility: "visible",
						opacity: 1,
					},
				}}
				ref={ref}
			>
				<Box className="relative" onClick={onClick}>
					{(JSON.isJSON(content) || Array.isArray(content)) && !React.isValidElement(content) ? (
						<JSONView src={content} view="decorated" showTabs={false} collapsed />
					) : (
						content
					)}
					<Box
						className="absolute flex items-center justify-center transition-all cell-actions-box "
						sx={{
							top: "auto",
							right: 0,
							bottom: 0,
							backgroundColor: "transparent",
						}}
					>
						{!disableCopyToClipboard && !!content && !React.isValidElement(content) && (
							<CopyToClipboardButton
								sx={{
									backgroundColor: theme => theme.palette.background.paper,
									"&:hover": {
										color: theme => theme.palette.background.paper,
										backgroundColor: theme => theme.palette.accent.main,
									},
								}}
								color="accent"
								size="small"
								fontSize="inherit"
								className="copy-cell-value text-xs mx-1"
								value={
									!Function.isFunction(header?.resolveReferenceText) && (JSON.isJSON(content) || Array.isArray(content))
										? JSON.stringify(content, null, 4)
										: `${
												truncateSize > 0 &&
												String.isString(data[header.attribute]) &&
												data[header.attribute].length > truncateSize
													? data[header.attribute]
													: content
										  }`
								}
							/>
						)}
					</Box>
				</Box>
			</TableCell>
		)
	}


});

export default DataTableCell;
