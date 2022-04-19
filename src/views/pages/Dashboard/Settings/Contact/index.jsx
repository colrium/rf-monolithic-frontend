/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import GridContainer from "components/Grid/GridContainer"
import Card from "components/Card"
import GridItem from "components/Grid/GridItem"
import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget(props) {
	const settings = useSelector(state => ({ ...state?.app?.contact }))
	const {
		TextField,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "contact-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				contact: { ...settings, ...values },
			})
		}
	}, [values, errors, settings])

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Contact Settings
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<TextField name="phone" label="Phone" />
					</GridItem>

					<GridItem xs={12} className="mb-1">
						<TextField name="email" label="email" />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="address" label="Address" multiline minRows={5} />
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}

export default React.memo(Widget)
