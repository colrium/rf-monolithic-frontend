/** @format */

import { app } from "assets/jss/app-theme";
import Grid from '@mui/material/Grid';
;
import React from "react";

import ApplySection from "views/sections/LandingPage/Apply";



class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Apply");
	}

	render() {
		const { classes, ...rest } = this.props;
		return (
			<Grid container
				style={{ minHeight: "90vh" }}
				className={"p-0"}
			>
				<Grid item  xs={12} className={"p-0"}>
					<ApplySection />
				</Grid>
			</Grid>
		);
	}
}

export default (Page);
