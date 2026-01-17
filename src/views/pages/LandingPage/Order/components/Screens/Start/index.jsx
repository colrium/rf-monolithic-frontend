/** @format */

import Check from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";


class Step extends React.Component {
	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<Grid container className="p-0 m-0 inline-block h-auto">
				<Grid container className="p-0 m-0">
					<Grid item  xs={12}>
						<Typography variant="h3" className="primary_text">
							Commission your survey with Realfield!
						</Typography>
					</Grid>
					<Grid item  xs={12}>
						<Typography
							variant="body1"
							className="default_text mb-4"
						>
							Dear Customer,
						</Typography>
						<Typography
							variant="body1"
							className="default_text mb-4"
						>
							We know that data is not only a precious resource in
							today's digital age, but it also drives key decision
							making in almost every field. We therefore take
							every step to ensure the data you get is as
							authentic as possible, reliable and collected as per
							your exact specifications. Our guarantee to you is
							REAL and UNTAINTED responses to your questions,
							collected and delivered to you in a professional and
							timely manner. Simply fill in our form so we can
							capture the information you'd like us to collect,
							then sit back, relax and let us do the heavy
							lifting.
						</Typography>
					</Grid>
				</Grid>

				<Grid container className="p-0 m-0">
					<Grid item  xs={12} md={6}>
						<Button
							onClick={onComplete}
							className="sm:w-full md:w-auto "
							color="primary"
							round
						>
							<Check /> Lets get started
						</Button>
					</Grid>

					<Grid item  xs={12} md={6}>
						<Button
							onClick={onCancel}
							className="sm:w-full md:w-auto float-right"
							color="secondary"
							round
						>
							<Check /> Request Proposal
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export default Step;
