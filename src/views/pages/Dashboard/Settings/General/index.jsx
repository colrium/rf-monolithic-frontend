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
	let settings = app.settings.general
	const {
		TextField,
		RadioGroup,
		values,
		setValue,
		formState: { errors },
	} = usePersistentForm({
		name: "general-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			console.log("values", values)
			EventRegister.emit("change-settings", {
				general: { ...settings, ...values },
			})
		}
	}, [values])

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						General
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							SEO
						</Typography>
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField
							name="seo-title"
							label="SEO Title"
							rules={{
								required: true,
							}}
						/>
					</GridItem>

					<GridItem xs={12} className="mb-1">
						<TextField
							name="seo-tagline"
							label="SEO Tagline"
							rules={{
								required: true,
							}}
							multiline={true}
							minRows={4}
						/>
					</GridItem>
					<GridItem xs={12} className="mb-2">
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							Ownership
						</Typography>
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField
							name="copyright"
							label="Copyright"
							rules={{
								required: true,
							}}
						/>
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField
							name="trademark"
							label="Trademark"
							rules={{
								required: true,
							}}
						/>
					</GridItem>
					<GridItem xs={12} className="mb-2">
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							Routing
						</Typography>
					</GridItem>
					<GridItem xs={12} className="mb-4">
						<RadioGroup
							name="landing-page-routing"
							label="Landing page routing"
							options={{ sections: "# (Hash) aware Sections", normal: "Normal" }}
							rules={{
								required: true,
							}}
						/>
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
