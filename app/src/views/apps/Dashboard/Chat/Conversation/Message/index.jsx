/** @format */

import React, { useMemo, useCallback } from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined"
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import BlockIcon from "@mui/icons-material/Block"
import DoneIcon from "@mui/icons-material/Done"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import ScheduleIcon from "@mui/icons-material/Schedule"
import GridContainer from "components/Grid/GridContainer"
import GridItem from "components/Grid/GridItem"
import IconButton from "@mui/material/IconButton"
import LazyImage from "components/LazyImage"
import LinkPreview from "components/LinkPreview"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "@mui/material/styles"
import { useDidMount, useWillUnmount, useSetState } from "hooks"
import { useNetworkServices } from "contexts"
import { Stack } from "@mui/material"
const Message = React.forwardRef((props, ref) => {
	const {
		conversation,
		data,
		classes,
		className,
		selected,
		focused,
		onContextMenu,
		onClick,
		maxContentWidth = "100%",
		imageWidth = "100%",
		imageHeight = "100%",
		showDateHeader = false,
		showUnreadHeader = false,
		...rest
	} = props
	const theme = useTheme()
	const auth = useSelector(state => state.auth)
	const { Api: ApiService } = useNetworkServices()
	const [state, setState, getState] = useSetState({
		loading: false,
		selected: -1,
	})
	const messageDeleted = useMemo(
		() =>
			(data.state === "deleted-for-sender" &&
				(data.sender === auth.user?._id ||
					data.sender._id === auth.user?._id)) ||
			data.state === "deleted-for-all",
		[data]
	)

	const handleOnClick = useCallback(
		index => event => {
			setState({
				selected: index,
			})
			if (Function.isFunction(onClick)) {
				onClick(event, index, data)
			}
		},
		[onClick, data]
	)
	const handleOnContextMenu = useCallback(
		index => event => {
			setState({
				selected: index,
			})
			if (Function.isFunction(onContextMenu)) {
				onContextMenu(event, index, data)
			}
		},
		[onContextMenu, data]
	)

	return (
		<GridContainer
			onClick={handleOnClick}
			onContextMenu={handleOnContextMenu}
			{...rest}
			className={`${
				className ? className : ""
			} overflow-hidden bg-transparent px-0 `}
			ref={ref}
		>
			{showUnreadHeader &&
				Array.isArray(data.reads) &&
				data.reads.indexOf(auth.user?._id) === -1 && (
					<GridItem
						xs={12}
						className={`flex flex-row items-center p-0`}
					>
						<Box
							component="span"
							sx={
								{
									// border: theme => `0.5px solid ${theme.palette.divider}`,
								}
							}
							className="flex-1 mx-4"
						/>
						<Typography
							variant="body2"
							sx={{
								color: theme => theme.palette.text.disabled,
								padding: theme => theme.spacing(),
								backgroundColor: theme =>
									theme.palette.background.default,
							}}
						>
							{`Unread Message`}
						</Typography>
						<Box
							component="span"
							sx={
								{
									// border: theme => `0.5px solid ${theme.palette.divider}`,
								}
							}
							className="flex-1 mx-4"
						/>
					</GridItem>
				)}
			{showDateHeader && (!!data.timestamp || !!data.created_on) && (
				<GridItem xs={12} className={`flex flex-row items-center p-0`}>
					<Box
						component="span"
						sx={
							{
								// border: theme => `0.5px solid ${theme.palette.divider}`,
							}
						}
						className="flex-1 mx-4"
					/>
					<Typography
						variant="body2"
						className="px-2 py-1 rounded-md"
						sx={{
							color: theme => theme.palette.text.disabled,
							backgroundColor: theme =>
								theme.palette.background.default,
						}}
					>
						{`${Date.prose(
							data.timestamp || data.created_on,
							false
						)}`}
					</Typography>
					<Box
						component="span"
						sx={
							{
								// border: theme => `0.5px solid ${theme.palette.divider}`,
							}
						}
						className="flex-1 mx-4"
					/>
				</GridItem>
			)}
			<GridItem
				xs={12}
				className={`flex cursor-pointer p-0 p-2 ${
					data.sender._id === auth.user?._id ||
					data.sender === auth.user?._id
						? "flex-row-reverse"
						: "flex-row"
				}`}
				sx={
					{
						// height: "fit-content !important",
					}
				}
			>
				<Box
					className={
						"flex flex-col  px-4 py-1  " +
						(data.sender._id === auth.user?._id ||
						data.sender === auth.user?._id
							? "rounded-l-xl rounded-tr-2xl rounded-br-none"
							: "rounded-r-2xl rounded-bl-2xl rounded-tl-none")
					}
					sx={{
						backgroundColor: theme =>
							data.sender?._id === auth.user?._id ||
							data.sender === auth.user?._id
								? theme.palette.teal.lighten_3
								: theme.palette.background.paper,
						maxWidth: maxContentWidth,
						height: "fit-content !important",
					}}
				>
					{!messageDeleted && (
						<div
							className={
								conversation.type !== "individual"
									? "flex flex-row w-full items-center"
									: "flex flex-row-reverse w-full items-center"
							}
						>
							{conversation.type !== "individual" &&
								JSON.isJSON(data.sender) && (
									<Typography
										variant="body1"
										className={
											"flex-grow text-gray-500 font-bold"
										}
									>
										{data.sender.first_name +
											" " +
											data.sender.last_name}
									</Typography>
								)}
						</div>
					)}
					{!messageDeleted &&
						["audio", "file", "video", "image"].includes(
							data.type
						) &&
						Array.isArray(data.attachments) && (
							<div
								className={`flex flex-row flex-1 flex-wrap ${
									data.type === "image"
										? data.attachments.length > 2
											? "grid-cols-2 grid-rows-2"
											: ""
										: ""
								}`}
							>
								{data.attachments.map(
									(attachment, cursor) =>
										cursor <= 3 && (
											<div
												className={
													"mx-auto mb-1 rounded"
												}
												key={"attachment-" + cursor}
											>
												{data.type === "image" && (
													<LazyImage
														className={
															"h-52 w-48 rounded"
														}
														src={ApiService.getAttachmentFileUrl(
															attachment
														)}
														alt={attachment?.name}
													/>
												)}
												{data.type === "audio" && (
													<div
														className={
															"w-full h-auto flex flex-row items-center"
														}
														onClick={e => {
															e.preventDefault()
															let win =
																window.open(
																	ApiService.getAttachmentFileUrl(
																		attachment
																	),
																	"_blank"
																)
															win.focus()
														}}
													>
														<AudiotrackOutlinedIcon
															className={
																"text-2xl"
															}
														/>
														<Typography
															variant="body1"
															color="textPrimary"
															className={
																"flex-grow truncate"
															}
														>
															{attachment.name}
														</Typography>
													</div>
												)}
												{data.type === "video" && (
													<div
														className={
															"w-full h-auto flex flex-row items-center"
														}
														onClick={e => {
															e.preventDefault()
															let win =
																window.open(
																	ApiService.getAttachmentFileUrl(
																		attachment
																	),
																	"_blank"
																)
															win.focus()
														}}
													>
														<MovieOutlinedIcon
															className={
																"text-2xl"
															}
														/>
														<Typography
															variant="body1"
															color="textPrimary"
															className={
																"flex-grow truncate"
															}
														>
															{attachment.name}
														</Typography>
													</div>
												)}
												{data.type === "file" && (
													<div
														className={
															"w-full h-auto flex flex-row items-center"
														}
														onClick={e => {
															e.preventDefault()
															let win =
																window.open(
																	ApiService.getAttachmentFileUrl(
																		attachment
																	),
																	"_blank"
																)
															win.focus()
														}}
													>
														<AttachFileIcon
															className={
																"text-2xl"
															}
														/>
														<Typography
															variant="body1"
															color="textPrimary"
															className={
																"flex-grow truncate"
															}
														>
															{attachment.name}
														</Typography>
													</div>
												)}
											</div>
										)
								)}
							</div>
						)}

					{messageDeleted && (
						<div
							className={"flex flex-row items-center w-full"}
							style={{
								color: theme.palette.divider,
							}}
						>
							<Typography
								variant="body1"
								color="inherit"
								className={"flex-grow"}
							>
								Message deleted
							</Typography>
							<BlockIcon className={"mx-2"} fontSize="small" />
						</div>
					)}

					{!messageDeleted && (
						<Stack className="flex flex-col">
							<Stack xs={12} className="p-0 flex-1">
								<Stack className="m-0 p-0 flex flex-col">
									{String.containsUrl(data.content) && (
										<LinkPreview
											width="100%"
											className="p-0 mb-1"
											imageHeight={10}
											descriptionLength={100}
											url={
												String.getContainedUrl(
													data.content
												)[0]
											}
											openInNewTab
										/>
									)}
									<Typography
										variant="body1"
										color="textPrimary"
										component="div"
										className="flex-1 leading-normal"
									>
										{data.content}
									</Typography>
								</Stack>
							</Stack>
							<Box
								component="div"
								sx={{
									color: theme.palette.text.secondary,
								}}
								className="flex flex-row items-center justify-end text-sm w-full"
							>
								<Typography
									sx={{
										fontSize: theme => theme.spacing(1.3),
									}}
									className={"flex-1 text-right"}
								>
									{`${Date.format(
										data.timestamp || data.created_on,
										"h:i a"
									)}`}
								</Typography>
								{data.state === "pending" &&
									(data.sender._id === auth.user?._id ||
										data.sender === auth.user?._id) && (
										<ScheduleIcon
											className={"ml-2 text-xs"}
											fontSize="small"
										/>
									)}
								{data.state === "sent" &&
									(data.sender._id === auth.user?._id ||
										data.sender === auth.user?._id) && (
										<DoneIcon
											className={"ml-2 text-xs "}
											fontSize="small"
										/>
									)}
								{(data.state === "partially-received" ||
									data.state === "received") &&
									(data.sender._id === auth.user?._id ||
										data.sender === auth.user?._id) && (
										<DoneAllIcon
											className={"ml-2 text-xs"}
											fontSize="small"
										/>
									)}
								{(data.state === "partially-read" ||
									data.state === "read") &&
									(data.sender._id === auth.user?._id ||
										data.sender === auth.user?._id) && (
										<DoneAllIcon
											className={
												"ml-2 text-xs text-blue-500"
											}
											fontSize="small"
										/>
									)}
							</Box>
						</Stack>
					)}
				</Box>
			</GridItem>
		</GridContainer>
	)
})

export default React.memo(Message)
