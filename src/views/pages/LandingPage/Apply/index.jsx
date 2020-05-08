/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import defination from "definations/applications";
import React from "react";
import service from "services/applications";
import { withErrorHandler } from "hoc/ErrorHandler";
import BaseForm from "views/forms/BaseForm";



class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Apply");
	}

	render() {
		const { classes, ...rest } = this.props;
		return (
			<GridContainer
				style={{ minHeight: "90vh" }}
				alignItems="center"
				justify="center"
			>
				<GridItem xs={12} md={11}>
					<GridContainer alignItems="center" justify="center">
						<GridItem xs={12} sm={12} md={10}>
							<Typography variant="h3" bold>
								Fielder Registration
							</Typography>
						</GridItem>
					</GridContainer>

					<GridContainer alignItems="center" justify="center">
						<GridItem xs={12} sm={12} md={10}>
							<Typography variant="body1">
								Its great to meet you! Please complete all
								fields within the form below to register your
								interest in becoming a Real Fielder. All
								applications will be reviewed and you will be
								contacted by our Team with further details.
								Thanks! We look forward to working with you!!
							</Typography>
						</GridItem>
					</GridContainer>

					<GridContainer alignItems="center" justify="center">
						<GridItem xs={12} sm={12} md={10}>
							<BaseForm
								defination={defination}
								service={service}
								form="applications-form"
								show_title={false}
								text_fields_variant="outlined"
								onSubmitSuccessMessage="Your Application has been submitted."
							/>
						</GridItem>
					</GridContainer>
				</GridItem>
			</GridContainer>
		);
	}
}

export default withErrorHandler(Page);
