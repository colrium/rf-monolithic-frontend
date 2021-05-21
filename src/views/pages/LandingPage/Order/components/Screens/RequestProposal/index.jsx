/** @format */

import { ArrowBack, Send } from "@material-ui/icons";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import { quoterequests as defination } from "definations";
import React from "react";
import ApiService from "services/Api";
import withRoot from "hoc/withRoot";
import BaseForm from "views/forms/BaseForm";

class Step extends React.Component {
	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<GridItem xs={12}>
					<Typography variant="body2" className="default_text">
						Enter Quote details below
					</Typography>
				</GridItem>
				<GridItem xs={12}>
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
				</GridItem>
			</GridContainer>
		);
	}
}

export default withRoot(Step);
