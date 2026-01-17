/** @format */

import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";

import LoginForm from "views/forms/Auth/Login";

class Step extends React.Component {
	render() {
		const { onComplete } = this.props;
		return (
			<Grid container className="p-0 m-0">
				<Grid container>
					<Grid item  xs={12}>
						<Typography
							variant="h3"
							className="primary_text"
													>
							Login
						</Typography>
					</Grid>
				</Grid>

				<Grid container className="flex justify-center">
					<Grid item  xs={12} md={6}>
						<LoginForm onLogin={onComplete} />
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export default Step;
