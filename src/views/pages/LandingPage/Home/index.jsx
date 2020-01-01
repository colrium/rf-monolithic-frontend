import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import compose from "recompose/compose";
import withStyles from "@material-ui/core/styles/withStyles";
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/Button";
import Typography from "components/Typography";
import AnimatedChevronMap from "views/widgets/AnimatedChevronMap";

import {app, alignments, colors} from "assets/jss/app-theme.jsx";


// Sections for this page
/*import SurveysQueriesSection from "./Sections/SurveysQueriesSection.jsx";
import QueriesSection from "./Sections/QueriesSection.jsx";
import StartProjectSection from "./Sections/StartProjectSection.jsx";
import InfoSection from "./Sections/InfoSection.jsx";*/


const styles = theme => ({
	root: {
		zIndex: "12",
		color: colors.hex.text,
		position: "relative",
		minHeight: "100vh",
	},
	container: {
		color: colors.hex.default,
	},
	title: {
		display: "inline-block",
		position: "relative",
		marginTop: "30px",
		minHeight: "32px",
		color: colors.hex.default,
		textDecoration: "none"
	},
	subtitle: {
		fontSize: "1.313rem",
		margin: "10px auto 0"
	},
	titleWrapper: {
		position: "relative",
	},
	titleContainer: {
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
		padding: "0",
	},
	main: {
		background: colors.hex.inverse,
		position: "relative",
		zIndex: "3"
	},
	mainRaised: {
		margin: "-60px 30px 0px",
		borderRadius: "6px",
		boxShadow: "0 16px 24px 2px rgba("+colors.rgb.text+", 0.14), 0 6px 30px 5px rgba("+colors.rgb.text+", 0.12), 0 8px 10px -5px rgba("+colors.rgb.text+", 0.2)"
	},
});

class Page extends React.Component {
	componentDidMount(){
		document.title = app.title("Home");
	}
	
	render() {
		const { classes, auth, ...rest } = this.props;
		return (
			<div>
				<GridContainer className={classes.root} direction="column" alignItems="center" justify="center">
					<GridContainer className={classes.container}>
							<GridItem xs={12} sm={12} md={12}>
								<GridContainer alignItems="center" justify="center">
									<GridItem xs={12} sm={12} md={5} className={classes.titleWrapper}>
										<GridContainer>
											<GridItem xs={12}>
												<Typography variant="h3" center> Get <b>Real</b> time research in the  <b>Field</b> </Typography>
											</GridItem>

											<GridItem xs={12}>
												<Typography bold doublespaced center>
													Reaching remote areas that the internet cannot, asking real questions that the internet cannot...... An impactful statement explaining why realfield, with link to backup
												</Typography>
											</GridItem>
										</GridContainer>
									</GridItem>

									<GridItem xs={12} sm={12} md={7}>
										<AnimatedChevronMap />
									</GridItem>
								</GridContainer>
								<GridContainer>
									<GridItem xs={12} sm={12} md={5}>
										<GridContainer>
											<GridItem xs={12} sm={6} md={6} style={{textAlign: "center"}} >
												<Link to="/order" color="inherit">				
													<Button color="accent" style={{margin: "auto"}}>
														Get started
													</Button>
												</Link>
											</GridItem>

											<GridItem xs={12} sm={6} md={6} style={{textAlign: "center"}} >
												<Link to="/request-demo" color="inherit">				
													<Button color="primary" outlined style={{margin: "auto"}}>
														Request demo
													</Button>
												</Link>
													
											</GridItem>
												
										</GridContainer>
									</GridItem>
								</GridContainer>
										
							</GridItem>

							
					</GridContainer>
				</GridContainer>

				
				{/*<GridContainer className={classes.main} paddless>
					<SurveysQueriesSection />
					<QueriesSection />
					{auth.isAuthenticated? (
						<GridItem xs={12} style={{textAlign: "center"}}>
							<Button color="accent" size="lg" round href="https://survey.realfield.io" target="_blank" rel="noopener noreferrer" style={{margin: "auto"}}>
								Start survey
							</Button> 
						</GridItem>) : (
						<StartProjectSection />
					)}
					
					<InfoSection />
				</GridContainer>*/}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default withRoot(compose(connect(mapStateToProps, {}), withStyles(styles))(Page));