import React from "react";
import withRoot from 'utils/withRoot';
import { Link } from "react-router-dom";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/Button";
import Typography from "components/Typography";
import {app} from "assets/jss/app-theme";




class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		document.title = app.title("Recruitment");
	}


	render() {
		const { classes, ...rest } = this.props;
		return (
					<GridContainer className="" style={{minHeight: "90vh"}} alignItems="center" justify="center">
						<GridItem xs={12} md={9}>
							<GridContainer alignItems="center" justify="center">
								<GridItem xs={12} sm={12} >
									<Typography bold variant="h3">
										Welcome to the Realfield and join us in the fight against fake news and false facts!
									</Typography>
								</GridItem>
							</GridContainer>


							<GridContainer alignItems="center" justify="center">
								<GridItem xs={12} sm={12} >
									<Typography variant="body1" paragraph gutterBottom>
										Accurate and timely information is absolutely essential for today’s decision makers, yet solid gold 
										data has never  been more rare. Realfield is a fresh tech  start-up revolutionizing data collection 
										through our online platform providing automated face-to-face (F2F) data collection services.
									</Typography>
									<Typography variant="body1" paragraph gutterBottom>  
										Our unyielding dedication to ethical data collection and data privacy combines the most robust data 
										collection methods with online convenience and usability giving our clients real-time access to real 
										data from real people at a price that compares with online tools.
									</Typography>

									<Typography variant="body1" paragraph gutterBottom> 
										We are now recruiting Data Collectors (Fielders) for upcoming projects around the country.   If you 
										are  interested  in  working  with  an  exciting  startup  with  an  important,  ethical  mission  in <a href="https://www.mercycorps.org/research/kenya-gigeconomy" target="_blank" rel="noopener noreferrer"> Kenya’s 
										rapidly growing  gig-economy</a>, and have a reputation for fast, reliable and efficient work turnaround 
										time - Realfield is looking for you!
									</Typography>
								</GridItem>
							</GridContainer>

							<GridContainer alignItems="center" justify="center">
								<GridItem xs={12} sm={12}>
									<Link to={"/apply".toUriWithLandingPagePrefix()} color="inherit" >				
										<Button color="accent" size="lg" right>
											Apply
										</Button>
									</Link>
								</GridItem>
							</GridContainer>


							
						</GridItem>
					</GridContainer>
		);
	}
}

export default withRoot(Page);
