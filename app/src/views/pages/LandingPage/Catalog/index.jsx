/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
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
			<GridContainer style={{ minHeight: "90vh" }} className="relative">
				<GridItem xs={12} sm={12} md={10} className="m-auto">
					<CatalogView className="w-full" />
				</GridItem>
			</GridContainer>
		);
	}
}

export default (Page);
