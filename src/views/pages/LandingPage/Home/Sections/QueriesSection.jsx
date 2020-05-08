/** @format */

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import homePageStyle from "assets/jss/realfield/views/homePage.jsx";
// @material-ui/icons
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";



class QueriesSection extends React.Component {
	render() {
		return (
			<GridContainer className="secondary">
				<GridContainer>
					<GridItem xs={11} sm={11} md={11}>
						<GridContainer>
							<GridItem xs={12} sm={12} md={4}>
								<Typography color="accent" variant="h4" bold>
									quickfire.
								</Typography>
								<Typography bold doublespaced>
									it is a long established fact that a reader
									will be distracted by the readable content
									of a page when looking at its layout. The
								</Typography>
							</GridItem>

							<GridItem xs={12} sm={12} md={4}>
								<Typography color="accent" variant="h4" bold>
									budget.
								</Typography>
								<Typography bold doublespaced>
									it is a long established fact that a reader
									will be distracted by the readable content
									of a page when looking at its layout. The
								</Typography>
							</GridItem>

							<GridItem xs={12} sm={12} md={4}>
								<Typography color="accent" variant="h4" bold>
									reassurance.
								</Typography>
								<Typography bold doublespaced>
									it is a long established fact that a reader
									will be distracted by the readable content
									of a page when looking at its layout. The
								</Typography>
							</GridItem>
						</GridContainer>

						<GridContainer>
							<GridItem xs={12} sm={12} md={4}>
								<Typography color="accent" variant="h4" bold>
									reach.
								</Typography>
								<Typography bold doublespaced>
									it is a long established fact that a reader
									will be distracted by the readable content
									of a page when looking at its layout. The
								</Typography>
							</GridItem>

							<GridItem xs={12} sm={12} md={4}>
								<Typography color="accent" variant="h4" bold>
									scope.
								</Typography>
								<Typography bold doublespaced>
									it is a long established fact that a reader
									will be distracted by the readable content
									of a page when looking at its layout. The
								</Typography>
							</GridItem>

							<GridItem xs={12} sm={12} md={4}>
								<Typography color="accent" variant="h4" bold>
									pricing.
								</Typography>
								<Typography bold doublespaced>
									it is a long established fact that a reader
									will be distracted by the readable content
									of a page when looking at its layout. The
								</Typography>
							</GridItem>
						</GridContainer>
					</GridItem>
					<GridItem xs={1} sm={1} md={1} className="inverse">
						<img
							src={require("assets/img/realfield/surveys-vertical.jpg")}
							alt="Realfield"
							style={{
								width: "50%",
								height: "auto",
								margin: "auto",
							}}
						/>
					</GridItem>
				</GridContainer>
			</GridContainer>
		);
	}
}

export default withStyles(homePageStyle)(QueriesSection);
