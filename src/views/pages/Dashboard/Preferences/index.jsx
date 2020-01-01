import React, { Component } from "react";
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { Password } from "./components";
import { app } from "assets/jss/app-theme";
import withRoot from "utils/withRoot";




class Settings extends Component {
	componentDidMount() {
		document.title = app.title("Preferences");
	}

	render() {
		const { classes } = this.props;

		return (
			<GridContainer  spacing={4}>
				<GridItem lg={5} xs={12}>
					<Password />
				</GridItem>
				{/*<Grid item lg={7} xs={12} >
							<Notifications />
						</Grid>*/}
			</GridContainer>
		);
	}
}


export default withRoot(Settings);
