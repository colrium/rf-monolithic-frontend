import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {ArrowBack, Send} from '@material-ui/icons';
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";
import {proposalrequests as defination} from "definations";
import {proposalrequests as service} from "services";
import BaseForm from "views/forms/BaseForm";


class Step extends React.Component {
	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<GridContainer className="p-0 m-0">
							<GridItem xs={12}>
								<Typography variant="body2" className="default_text">Enter proposal details below</Typography>	
							</GridItem>
							<GridItem xs={12}>
								<BaseForm 
									defination={defination} 
									service={service} 
									form="landingpage_proposal_request"
									show_title={false}
									fields={["requesting_email", "institution", "requirements", "deadline"]}
									SubmitBtn= {Button}
									onSubmitSuccess={onComplete}
									submitBtnProps={{
										children: <div><Send /> Submit Proposal Request</div>,
										color: "primary",
										round: true,
										outlined: false
									}}
									DiscardBtn= {Button}
									discardBtnProps={{
										children: <div><ArrowBack /> Back</div>,
										onClick: onCancel,
										color: "warning",
										round: true,
										outlined: false
									}}
								/>
							</GridItem>

			</GridContainer>
		);
	}
}

export default withRoot(Step);
