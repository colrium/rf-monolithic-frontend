import React from "react";
import withRoot from 'utils/withRoot';
import { Link } from "react-router-dom";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/Button";
import Typography from "components/Typography";
import CatalogView from "views/widgets/Ecommerce/Catalog";
import {app} from "assets/jss/app-theme";




class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		document.title = app.title("Catalog");
	}

	

	render() {
		const { classes, ...rest } = this.props;
		return (
					<GridContainer style={{minHeight: "90vh"}} className="relative">
						<GridItem xs={12} sm={12} md={10} className="m-auto" >
							<CatalogView className="w-full"/>
						</GridItem>
					</GridContainer>
		);
	}
}

export default withRoot(Page);
