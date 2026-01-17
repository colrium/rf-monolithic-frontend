/** @format */

import { ArrowBack, Send } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import { quoterequests as defination } from "definations";
import React from "react";
import ApiService from "services/Api";

import BaseForm from "views/forms/BaseForm";

class Step extends React.Component {
	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<Grid container className="p-0 m-0">
				<Grid item  xs={12}>
					<Typography variant="body2" className="default_text">
						Enter Quote details below
					</Typography>
				</Grid>
				<Grid item  xs={12}>
					<BaseForm
						defination={defination}
						form="landingpage_proposal_request"
						show_title={false}
						fields={[
							"requesting_email",
							"institution",
							"requirements",
							"deadline",
						]}
						SubmitBtn={Button}
						onSubmitSuccess={onComplete}
						submitBtnProps={{
							children: (
								<div>
									<Send /> Submit Quote Request
								</div>
							),
							color: "primary",
							round: true,
							outlined: false,
						}}
						DiscardBtn={Button}
						discardBtnProps={{
							children: (
								<div>
									<ArrowBack /> Back
								</div>
							),
							onClick: onCancel,
							color: "warning",
							round: true,
							outlined: false,
						}}
					/>
				</Grid>
			</Grid>
		);
	}
}

export default Step;
