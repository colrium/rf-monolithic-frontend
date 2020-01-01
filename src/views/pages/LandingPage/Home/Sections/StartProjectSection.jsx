import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";

import homePageStyle from "assets/jss/realfield/views/homePage.jsx";

import SignupForm from "views/forms/SignupForm";


class StartProjectSection extends React.Component {
	render() {
		const { classes} = this.props;
		return (
			<div className={classes.container}>
				<GridContainer>
					<GridContainer>
						<GridItem xs={12} sm={12} md={12}>
							<Typography bold variant="h3" style={{textAlign:"center"}}>Start a project</Typography>
						</GridItem>

						<GridItem xs={12} sm={12} md={12}  style={{textAlign:"center"}}>
							<Typography bold variant="h5">
								Create an account to start commissioning surveys
							</Typography>
						</GridItem>
					</GridContainer>

					<GridContainer paddless>
						<GridItem xs={12} sm={12} md={12}>
							<SignupForm />
						</GridItem>
					</GridContainer>
				</GridContainer>
			</div>				
		);
	}
}

export default withStyles(homePageStyle)(StartProjectSection);
