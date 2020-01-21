import React from "react";
import withRoot from 'utils/withRoot';
import { Link } from "react-router-dom";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/Button";
import Typography from "components/Typography";
import CheckoutView from "views/widgets/Ecommerce/Checkout";
import {app} from "assets/jss/app-theme";




class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		document.title = app.title("Checkout");
	}


	render() {
		const { classes, ...rest } = this.props;
		return (
					<GridContainer className="relative min-h-screen">
						<GridItem xs={12} sm={10} md={8} className="m-auto" >
							<CheckoutView className="w-full"/>
						</GridItem>
					</GridContainer>
		);
	}
}

export default withRoot(Page);
