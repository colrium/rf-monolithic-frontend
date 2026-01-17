/** @format */

import Check from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";

import Profile from "views/pages/Dashboard/Account/components/Profile";

class Step extends React.Component {
	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<Grid container className="p-0 m-0">
				<Grid container>
					<Grid item  xs={12}>
						<Typography variant="h3" className="primary_text">
							Account
						</Typography>
					</Grid>
				</Grid>

				<Grid container className="flex justify-center">
					<Grid item  xs={12}>
						<Profile />
					</Grid>
				</Grid>

				<Grid container className="p-4">
					<Grid item  xs={12} md={6} className="flex justify-start">
						<Button onClick={onComplete} color="primary" round>
							<Check /> Proceed with this Account
						</Button>
					</Grid>
					<Grid item  xs={12} md={6} className="flex justify-end">
						<Button onClick={onCancel} color="inverse" round>
							{" "}
							Switch to another Account{" "}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export default Step;
