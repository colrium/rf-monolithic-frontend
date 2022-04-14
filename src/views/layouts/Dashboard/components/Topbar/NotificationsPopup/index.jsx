/** @format */

import * as React from "react"
import Snackbar from "@mui/material/Snackbar"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import CloseIcon from "@mui/icons-material/Close"
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"
import { EventRegister } from "utils"
import { useDidMount, useSetState } from "hooks"
import MuiAlert from "@mui/material/Alert"

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const NotificationsPopups = () => {
	const [state, setState] = useSetState({open: false, title: "", subtitle: ""})

	const handleOnNotification = (event) => {
		setState({ ...event.detail, open: true })
	}

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setState({ open: false })
	}

	useDidMount(() => {
		const onNotificationListener = EventRegister.on("notification", handleOnNotification)

		return () => {
			onNotificationListener.remove()
		}
	})



	return (
		<Snackbar open={state.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
			<Alert
				iconMapping={{
					message: <ForumOutlinedIcon fontSize="inherit" />,
				}}
				onClose={handleClose}
				severity={state.type || "success"}
				sx={{ width: "60%" }}
			>
				<Stack sx={{ width: "100%" }}>
					{state.title && <Typography variant="body1">{state.title}</Typography>}
					{state.content && <Typography variant="body2">{state.content}</Typography>}
				</Stack>
			</Alert>
		</Snackbar>
	)
}

export default React.memo(NotificationsPopups)
