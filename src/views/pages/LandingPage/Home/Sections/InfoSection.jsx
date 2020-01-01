import React from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';


import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";

import homePageStyle from "assets/jss/realfield/views/homePage.jsx";


class InfoSection extends React.Component {
	render() {
		const { classes} = this.props;
		return (
			<div style={{backgroundColor:"#ffffff"}}>
				<GridContainer>
					<GridContainer>
						<GridItem xs={12} sm={12} md={6}  style={{textAlign:"center"}}>
							{/*<img src={require('assets/img/realfield/chat.png')} style={{width:"50%", height:"auto"}} alt=""/>*/}
						</GridItem>

						<GridItem xs={12} sm={12} md={6} style={{textAlign:"left"}}>
							<Typography bold variant="h3" color="accent">Managing your project</Typography>
							<br />
							<Typography bold variant="body1" doublespaced>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent condimentum auctor leo, a semper urna dignissim ut. Ut ullamcorper, nibh at aliquam porta, tortor tortor finibus mauris, sit amet ornare tellus erat vel purus. Phasellus non elit volutpat, aliquam tortor vitae, aliquam eros. Proin elit tortor, mollis in tincidunt eu, malesuada non turpis. Proin at auctor mauris. Donec sit amet libero nec eros posuere condimentum. Phasellus at tellus libero. Donec ut hendrerit dolor, in gravida felis. Nam quis tincidunt nisl.
							</Typography>
							<br />
							<List className={classes.root}>
								<ListItem>
									<Avatar>
										<ImageIcon />
									</Avatar>
									<ListItemText primary="Sed mximus" secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent condimentum auctor leo, a semper urna dignissim ut." />
								</ListItem>
								
								<ListItem>
									<Avatar>
										<ImageIcon />
									</Avatar>
									<ListItemText primary="Rhoncus sed" secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent condimentum auctor leo, a semper urna dignissim ut." />
								</ListItem>
								
								<ListItem>
									<Avatar>
										<ImageIcon />
									</Avatar>
									<ListItemText primary="Vulpatate" secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent condimentum auctor leo, a semper urna dignissim ut." />
								</ListItem>
								<ListItem>
									<Avatar>
										<ImageIcon />
									</Avatar>
									<ListItemText primary="Vel laoreet" secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent condimentum auctor leo, a semper urna dignissim ut." />
								</ListItem>
							</List>
						</GridItem>
					</GridContainer>

					<GridContainer style={{textAlign:"center"}}>
						<GridContainer>
							<GridItem xs={12} sm={12} md={12} >
								<Typography bold variant="h5">Join those in the know</Typography>
								<br />
							</GridItem>
						</GridContainer>
					</GridContainer>

					<GridContainer style={{textAlign:"center", padding:"10px"}} color="primary">
						{/*<GridContainer padded>
							<GridItem xs={12} sm={6} md={2}>
								<img src={require('assets/img/realfield/clients/keurig.png')} style={{width:"50px", height:"auto"}} alt=""/>
							</GridItem>
							<GridItem xs={12} sm={6} md={2}>
								<img src={require('assets/img/realfield/clients/pepsico.png')}  style={{width:"50px", height:"auto"}} alt=""/>
							</GridItem>
							<GridItem xs={12} sm={6} md={2}>
								<img src={require('assets/img/realfield/clients/verizon.png')}  style={{width:"50px", height:"auto"}} alt=""/>
							</GridItem>
							<GridItem xs={12} sm={6} md={2}>
								<img src={require('assets/img/realfield/clients/mcdonalds.png')}  style={{width:"50px", height:"auto"}} alt=""/>
							</GridItem>
							<GridItem xs={12} sm={6} md={2}>
								<img src={require('assets/img/realfield/clients/amazon.png')}  style={{width:"50px", height:"auto"}} alt=""/>
							</GridItem>
							<GridItem xs={12} sm={6} md={2}>
								<img src={require('assets/img/realfield/clients/exp.png')}  style={{width:"50px", height:"auto"}} alt=""/>
							</GridItem>
						</GridContainer>*/}
					</GridContainer>

					<GridContainer style={{textAlign:"center"}} className="inverse">
						<GridContainer>
							<GridItem xs={12} sm={12} md={12} style={{textAlign:"center"}}>
								<Typography variant="h3">Base your decisions on <b>Realfield</b> data</Typography>
								<br />
							</GridItem>

							<GridItem xs={12} sm={12} md={12} style={{textAlign:"center"}}>
								<Typography variant="body1">statistically data collected in the realfield is 63% more accurate than online data</Typography>
							</GridItem>
						</GridContainer>

						<GridContainer>
							<GridItem xs={12} sm={6} md={6} style={{textAlign:"right"}}>
								<Button color="accent" size="md" href="https://survey.realfield.io" target="_blank" rel="noopener noreferrer"  style={{margin: "auto"}}>
									get started
								</Button>
							</GridItem>

							<GridItem xs={12} sm={6} md={6} style={{textAlign:"left"}}>
								<Link to="/request-demo" color="inherit">				
									<Button color="primary" size="md" simple outlined style={{margin: "auto"}}>
										request demo
									</Button>
								</Link>
											
							</GridItem>
										
						</GridContainer>
						
					</GridContainer>
				</GridContainer>
			</div>				
		);
	}
}

export default withStyles(homePageStyle)(InfoSection);
