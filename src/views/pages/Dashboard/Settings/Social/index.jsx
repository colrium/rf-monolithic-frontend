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
	let settings = app.settings.social
	const {
		TextField,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "social-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				social: { ...settings, ...values },
			})
		}
	}, [values, errors, settings])

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Social Networks
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<TextField name="facebook" label="Facebook" />
					</GridItem>

					<GridItem xs={12} className="mb-1">
						<TextField name="twitter" label="Twitter" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="instagram" label="Instagram" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="youtube" label="Youtube" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="linkedin" label="Linkedin" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="whatsapp" label="Whatsapp" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="instagram" label="Instagram" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="google_plus" label="Google +" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="pinterest" label="Pinterest" />
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
