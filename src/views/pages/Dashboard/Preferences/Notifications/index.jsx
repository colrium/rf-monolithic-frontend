/** @format */
import React from "react";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Card from "@mui/material/Card";
;
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
			<Grid container className="px-8">
				<Grid item  xs={12} className="mb-2">
					<Typography variant="h3">Notifications</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							All
						</Typography>
					</Grid>
					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox
							name="all.push"
							label="Push"
							onChange={toggleAllOthers("push")}
						/>
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox
							name="all.sms"
							label="SMS"
							onChange={toggleAllOthers("sms")}
						/>
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox
							name="all.email"
							label="Email"
							onChange={toggleAllOthers("email")}
						/>
					</Grid>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							Activity
						</Typography>
					</Grid>
					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="activity.push" label="Push" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="activity.sms" label="SMS" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="activity.email" label="Email" />
					</Grid>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							Subscriptions
						</Typography>
					</Grid>
					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="subscriptions.push" label="Push" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="subscriptions.sms" label="SMS" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="subscriptions.email" label="Email" />
					</Grid>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							New Feature Releases
						</Typography>
					</Grid>
					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="features.push" label="Push" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="features.sms" label="SMS" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="features.email" label="Email" />
					</Grid>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<Typography variant="h5" color="accent">
							Financial
						</Typography>
					</Grid>
					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="financial.push" label="Push" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="financial.sms" label="SMS" />
					</Grid>

					<Grid item  xs={12} md={4} className="mb-1">
						<Checkbox name="financial.email" label="Email" />
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default (connect(mapStateToProps, {})(React.memo(Widget)));
