/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";

import CartView from "views/widgets/Ecommerce/Cart";

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.onProceedToCheckout = this.onProceedToCheckout.bind(this);
	}

	componentDidMount() {
		document.title = app.title("Cart");
	}

	onProceedToCheckout() {
		const { history } = this.props;
		if (history) {
			history.push("/checkout".toUriWithLandingPagePrefix());
		}
	}

	render() {
		const { classes, ...rest } = this.props;
		return (
			<GridContainer className="relative min-h-screen">
				<GridItem xs={12} sm={10} md={8} className="m-auto">
					<CartView
						className="w-full"
						onProceedToCheckout={this.onProceedToCheckout}
					/>
				</GridItem>
			</GridContainer>
		);
	}
}

export default (Page);
