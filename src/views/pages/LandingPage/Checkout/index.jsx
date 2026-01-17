/** @format */

import { app } from "assets/jss/app-theme";
import Grid from '@mui/material/Grid';
;
import React from "react";

import CheckoutView from "views/widgets/Ecommerce/Checkout";

class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		document.title = app.title("Checkout");
	}

	render() {
		const { classes, ...rest } = this.props;
		return (
			<Grid container className="relative min-h-screen">
				<Grid item  xs={12} sm={10} md={8} className="m-auto">
					<CheckoutView className="w-full" />
				</Grid>
			</Grid>
		);
	}
}

export default (Page);
