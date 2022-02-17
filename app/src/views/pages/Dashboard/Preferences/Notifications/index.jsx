/** @format */
import React from "react";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card";
import GridItem from "components/Grid/GridItem";
import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget(props) {
	const { app } = props
	let preferences = app.preferences.notifications
	const {
		Checkbox,
		values,
		setValue,
		formState: { errors },
	} = usePersistentForm({
		name: "notifications-preferences",
		volatile: true,
		defaultValues: {
			...preferences,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-preferences", {
				notifications: { ...preferences, ...values },
			})
		}
	}, [values])

	const toggleAllOthers = (type) => (e) => {

		setValue(`activity.${type}`, Boolean(e?.target?.checked))
		setValue(`features.${type}`, Boolean(e?.target?.checked))
		setValue(`financial.${type}`, Boolean(e?.target?.checked))
		setValue(`subscriptions.${type}`, Boolean(e?.target?.checked))
	}

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3">Notifications</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							All
						</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox
							name="all.push"
							label="Push"
							onChange={toggleAllOthers("push")}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox
							name="all.sms"
							label="SMS"
							onChange={toggleAllOthers("sms")}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox
							name="all.email"
							label="Email"
							onChange={toggleAllOthers("email")}
						/>
					</GridItem>
				</GridContainer>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							Activity
						</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="activity.push" label="Push" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="activity.sms" label="SMS" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="activity.email" label="Email" />
					</GridItem>
				</GridContainer>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							Subscriptions
						</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="subscriptions.push" label="Push" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="subscriptions.sms" label="SMS" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="subscriptions.email" label="Email" />
					</GridItem>
				</GridContainer>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							New Feature Releases
						</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="features.push" label="Push" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="features.sms" label="SMS" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="features.email" label="Email" />
					</GridItem>
				</GridContainer>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							Financial
						</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="financial.push" label="Push" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="financial.sms" label="SMS" />
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<Checkbox name="financial.email" label="Email" />
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default (connect(mapStateToProps, {})(React.memo(Widget)));
