/** @format */

import ThankyouIcon from "@mui/icons-material/ThumbUpOutlined";
import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import { connect } from "react-redux";
import { resetEcommerce } from "state/actions";
import { withGlobals } from "contexts/Globals";


class Page extends React.Component {
	constructor(props) {
		super(props);

		let { checkout_data, resetEcommerce, cart, history } = props;
		if (cart.entries.length > 0 && Object.size(checkout_data) > 0) {
			resetEcommerce();
		} else {
			if (history) {
				history.push("/cart".toUriWithLandingPagePrefix());
			} else {
				window.location.href = "/cart".toUriWithLandingPagePrefix();
			}
		}
	}

	componentDidMount() {
		document.title = app.title("Thank you");
	}

	render() {
		const { classes, ...rest } = this.props;
		return (
			<GridContainer className="relative min-h-screen">
				<GridItem xs={12} sm={10} md={8} className="m-auto">
					<Typography
						variant="h1"
						className="w-full text-center mb-16"
					>
						{" "}
						<ThankyouIcon className="text-6xl m-auto text-gray-500" />
					</Typography>
					<Typography
						variant="h1"
						className="w-full text-center text-gray-500"
					>
						{" "}
						Thank you
					</Typography>
					<Typography
						variant="subtitle2"
						className="w-full text-center mt-8"
					>
						{" "}
						You order was placed.{" "}
					</Typography>
				</GridItem>
			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	cart: state.ecommerce.cart,
	checkout_data: state.ecommerce.checkout_data,
});

export default withGlobals(connect(mapStateToProps, { resetEcommerce })((Page)));
