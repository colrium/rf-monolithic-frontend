/** @format */
import React from "react"
import { connect } from "react-redux"
import Typography from "@mui/material/Typography"
import GridContainer from "components/Grid/GridContainer"
import Card from "components/Card"
import GridItem from "components/Grid/GridItem"
import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget(props) {
	const { app } = props
	let settings = app.settings.reading
	const {
		TextField,
		Checkbox,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "reading-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				reading: { ...settings, ...values },
			})
		}
	}, [values, errors, settings])

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Reading
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Checkbox name="enable-blog" label="Enable Blog" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<Checkbox name="enable-press" label="Enable Press" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<Checkbox name="enable-faq" label="Enable FAQ" />
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
})

export default connect(mapStateToProps, {})(React.memo(Widget))
