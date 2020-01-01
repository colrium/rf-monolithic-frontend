import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";

import Card from "components/Card";
import CardBody from "components/Card/CardBody";

import homePageStyle from "assets/jss/realfield/views/homePage.jsx";

class SurveysQueriesSection extends React.Component {
	render() {
		const { classes} = this.props;
		return (
			<div style={{backgroundColor: "#FFFFFF"}}>
				<GridContainer>
					<GridContainer spacing={24}>
						<GridItem xs={12} sm={12} md={4}>
							<Card color="transparent" style={{width: "100%"}}>
								<CardBody  className="padded" color="inverse" raised hoverraise vinset>
									<Typography bold doublespaced variant="h5">Surveys</Typography>
									<Typography doublespaced>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vulputate est vitae est facilisis gravida. Curabitur elit felis, finibus eget finibus id, pharetra sit amet neque. Integer sit amet pretium libero. Nulla in risus id nisi rutrum hendrerit.
									</Typography>
									<Button color="primary" outlined style={{float:"right"}}>learn more</Button>
								</CardBody>
							</Card>
						</GridItem>

						<GridItem xs={12} sm={12} md={4} className="p-0">
							<Card  color="transparent" style={{width: "100%"}}>
								{/*<img
									style={{height: "180px", width: "100%", display: "block"}}
									className={classes.imgCardTop}
									src={require('assets/img/bg.jpg')}
									alt="Card-img-cap" />*/}
								<CardBody color="inverse" className="padded" raised hoverraise vinset>
									<Typography bold doublespaced variant="h5" >Queries</Typography>
								<Typography doublespaced>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vulputate est vitae est facilisis gravida. Curabitur elit felis, finibus eget finibus id, pharetra sit amet neque. Integer sit amet pretium libero. Nulla in risus id nisi rutrum hendrerit.
								</Typography>
								<Button color="primary" outlined style={{float:"right"}}>learn more</Button>
								</CardBody>
							</Card>
						</GridItem>

						<GridItem xs={12} sm={12} md={4} className="toppadded">
							<Card color="transparent" style={{width: "100%"}}>
								<Typography bold color="accent" variant="h3">
									"Finally traditional research at online prices, it couldn't come soon enough"
								</Typography>

								<Typography variant="h5" >Name. Company</Typography>
							</Card>
						</GridItem>
					</GridContainer>
				</GridContainer>					
			</div>
		);
	}
}

export default withStyles(homePageStyle)(SurveysQueriesSection);
