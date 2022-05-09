/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";

import ApplySection from "views/sections/LandingPage/Apply";



class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Apply");
	}

	render() {
		const { classes, ...rest } = this.props;
		return (
			<GridContainer
				style={{ minHeight: "90vh" }}
				className={"p-0"}
			>
				<GridItem xs={12} className={"p-0"}>
					<ApplySection />
				</GridItem>
			</GridContainer>
		);
	}
}

export default (Page);
