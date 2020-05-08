/** @format */

import Check from "@material-ui/icons/Check";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import withRoot from "hoc/withRoot";

class Step extends React.Component {
	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<GridContainer className="p-0 m-0 inline-block h-auto">
				<GridContainer className="p-0 m-0">
					<GridItem xs={12}>
						<Typography variant="h3" className="primary_text">
							Commission your survey with Realfield!
						</Typography>
					</GridItem>
					<GridItem xs={12}>
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
					</GridItem>
				</GridContainer>

				<GridContainer className="p-0 m-0">
					<GridItem xs={12} md={6}>
						<Button
							onClick={onComplete}
							className="sm:w-full md:w-auto "
							color="primary"
							round
						>
							<Check /> Lets get started
						</Button>
					</GridItem>

					<GridItem xs={12} md={6}>
						<Button
							onClick={onCancel}
							className="sm:w-full md:w-auto float-right"
							color="secondary"
							round
						>
							<Check /> Request Proposal
						</Button>
					</GridItem>
				</GridContainer>
			</GridContainer>
		);
	}
}

export default withRoot(Step);
