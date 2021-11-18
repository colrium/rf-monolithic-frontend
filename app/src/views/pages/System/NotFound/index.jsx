/** @format */


import { app } from "assets/jss/app-theme";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";

import ApiService from "services/Api";

//

class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Resource Not Found");
	}

	render() {

		return (
			<GridContainer
				direction="row"
				justify="center"
				alignItems="center"
				style={{ height: "80vh" }}
			>
				<GridItem xs={12} md={8} lg={6}>
					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
						style={{ padding: "10%" }}
					>
						<img
							alt="Under development"
							style={{ width: "50%" }}
							src={ApiService.endpoint("/public/img/not_found.svg")}
						/>
					</GridContainer>

					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography
							variant="h1"
							color="grey"
						>
							404
						</Typography>
					</GridContainer>

					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography
							variant="body1"
							color="grey"
						>
							Page Not Found
						</Typography>
					</GridContainer>
				</GridItem>
			</GridContainer>
		);
	}
}
const mapStateToProps = state => ({
	user: state.user,
});

export default compose(connect(mapStateToProps, {}))(Page);
