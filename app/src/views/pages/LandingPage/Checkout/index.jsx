/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import { withErrorHandler } from "hoc/ErrorHandler";
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
			<GridContainer className="relative min-h-screen">
				<GridItem xs={12} sm={10} md={8} className="m-auto">
					<CheckoutView className="w-full" />
				</GridItem>
			</GridContainer>
		);
	}
}

export default withErrorHandler(Page);
