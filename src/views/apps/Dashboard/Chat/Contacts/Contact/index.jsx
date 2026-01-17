/** @format */

import React, { useRef, useCallback } from "react"
import { useTheme } from "@mui/material/styles"
import { useSelector, useDispatch } from "react-redux"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemIcon from "@mui/material/ListItemIcon"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import Avatar from "@mui/material/Avatar"
import Badge from "@mui/material/Badge"
import { useNetworkServices } from "contexts"
import Typography from "@mui/material/Typography"
import PersonIcon from "@mui/icons-material/Person"
import CheckIcon from "@mui/icons-material/Check"
import { useDeepMemo, useDidUpdate, useSetState } from "hooks"
const Contact = (props, ref) => {
	const { data, className, selected, focused, onClick, onContextMenu, ...rest } = props
	const theme = useTheme()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const { SocketIO, Api: ApiService } = useNetworkServices()

	const [state, setState] = useSetState({
		selected: selected,
		focused: focused,
	})

	// useDidUpdate(() => setState({ selected: selected }), [selected])
	// useDidUpdate(() => setState({ focused: focused }), [focused])

	const details = useDeepMemo(() => {
		let primaryText = `${data?.first_name || ""} ${data?.last_name || ""}`
		let avatar = data.avatar?._id || data.avatar
		let secondaryText = (data.role || "Contact").humanize()
		let presence = (data.presence || "offline").humanize()

		return {
			primaryText: String.capitalize(primaryText),
			avatar: avatar,
			secondaryText,
			presence,
		}
	}, [data])

	const handleOnClick = useCallback(
		event => {
			setState(prevState => ({ selected: !prevState.selected, focused: !prevState.selected }))
			if (Function.isFunction(onClick)) {
				onClick(event)
			}
		},
		[onClick]
	)

	const handleOnContextMenu = useCallback(
		event => {
			setState(prevState => ({ focused: true }))
			if (Function.isFunction(onContextMenu)) {
				onContextMenu(event)
			}
		},
		[onContextMenu]
	)

	return (
		<ListItemButton
			className={` transition transition-colors bg-transparent focus:bg-opacity-10 ${
				state.focused ? "bg-gray-400 bg-opacity-5" : ""
			}  ${className ? className : ""} ${state.selected ? "bg-gray-400 bg-opacity-25 focus:bg-opacity-25" : ""} `}
			onClick={handleOnClick}
			onContextMenu={handleOnContextMenu}
			{...rest}
			ref={ref}
		>
			<ListItemAvatar>
				<Badge
					variant="dot"
					badgeContent=" "
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					classes={{
						dot: details?.presence === "online" ? "bg-green-600" : details?.presence === "away" ? "bg-yellow-600" : "hidden",
					}}
				>
					{details.avatar && (
						<Avatar
							src={ApiService.getAttachmentFileUrl(details.avatar)}
							alt={details.primaryText}
							className={`text-base`}
							sx={{
								backgroundColor: theme => theme.palette.action.selected,
								color: theme => theme.palette.text.primary,
							}}
						/>
					)}
					{!details.avatar && (
						<Avatar
							sx={{
								backgroundColor: theme => theme.palette.action.selected,
								color: theme => theme.palette.text.primary,
							}}
							className={`text-sm`}
						>
							{details.primaryText.length > 0 ? (
								details.primaryText.charAt(0).toUpperCase()
							) : (
								<PersonIcon fontSize="inherit" />
							)}
						</Avatar>
					)}
				</Badge>
			</ListItemAvatar>

			<ListItemText
				className="flex flex-col justify-center flex-1"
				primary={
					<Typography variant="caption" color="textPrimary" className={"capitalize font-bold"}>
						{details.primaryText}
					</Typography>
				}
				secondary={
					<div className="w-full flex flex-col">
						{details.secondaryText && (
							<Typography variant="body2" component={"div"} className="text-muted" sx={{ fontSize: "0.7rem" }}>
								{details.secondaryText}
							</Typography>
						)}

						<Typography variant="caption" component={"div"} sx={{ fontSize: "0.7rem" }}>
							<span>Staff ID</span>
							<span className="px-2 text-bold">{data.staff_id}</span>
						</Typography>
					</div>
				}
			/>
			{(details.presence === "online" || details.presence === "away" || state.selected) && (
				<ListItemIcon
					className={`flex justify-end ${
						details.presence === "online" ? "text-green-500" : details.presence === "away" ? "text-yellow-500" : "text-gray-600"
					}`}
				>
					{state.selected ? <CheckIcon fontSize="inherit" /> : <FiberManualRecordIcon fontSize="inherit" />}
				</ListItemIcon>
			)}
		</ListItemButton>
	)
}

export default React.forwardRef(Contact)
