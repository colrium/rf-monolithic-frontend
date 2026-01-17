/** @format */

import { app } from "assets/jss/app-theme";
import Grid from '@mui/material/Grid';
;
import React from "react";

import CatalogView from "views/widgets/Ecommerce/Catalog";

class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		document.title = app.title("Catalog");
	}

	render() {
		const { classes, ...rest } = this.props;
		return (
			<Grid container style={{ minHeight: "90vh" }} className="relative">
				<Grid item  xs={12} sm={12} md={10} className="m-auto">
					<CatalogView className="w-full" />
				</Grid>
			</Grid>
		);
	}
}

export default (Page);
