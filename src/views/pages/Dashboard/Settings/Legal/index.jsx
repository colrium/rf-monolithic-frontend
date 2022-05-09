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
	const settings = useSelector(state => ({ ...state?.app?.legal }))
	const {
		TextField,
		WysiwygEditor,
		values,
		setValue,
		formState: { errors },
	} = usePersistentForm({
		name: "legal-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				legal: { ...settings, ...values },
			})
		}
	}, [values])

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Legal
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<WysiwygEditor name="terms-of-use" label="Terms of use" multiline={true} minRows={4} />
					</GridItem>

					<GridItem xs={12} className="mb-1">
						<TextField name="end-user-agreement" label="End user agreement" multiline={true} minRows={4} />
					</GridItem>
					<GridItem xs={12} className="mb-1">
						<TextField name="privacy-policy" label="Privacy policy" multiline={true} minRows={8} />
					</GridItem>

					<GridItem xs={12} className="mb-1">
						<TextField name="cookies-consent" label="Cookies consent" multiline={true} minRows={8} />
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}

export default React.memo(Widget)
