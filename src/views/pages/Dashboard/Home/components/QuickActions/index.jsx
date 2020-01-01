import React from "react";
// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withStyles from "@material-ui/core/styles/withStyles";
import {app} from "assets/jss/app-theme";
import { Link } from 'react-router-dom';
//Redux imports
import { connect } from 'react-redux';
//
import withRoot from 'utils/withRoot';
import styles from 'views/pages/styles';
//
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';

import Avatar from 'components/Avatar';

import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardContent from 'components/Card/CardContent';
import CardActions from 'components/Card/CardActions';

import Button from 'components/Button';
import Typography from 'components/Typography';
import AddIcon from '@material-ui/icons/Add';

import {colors} from "assets/jss/app-theme";
import * as definations from 'definations';


class QuickActions extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount(){

	}

	render() {
		const { auth } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<Card elevation={0} outlineColor="#cfd8dc">

					<CardHeader avatar={ <Avatar aria-label="Shortcuts" style={{background:colors.hex.default}}> <AddIcon/> </Avatar> }
						title="Shortcuts"
						subheader="Create New Record" >
										
					</CardHeader>

					<CardContent >
						<GridContainer className="p-0 m-0">
							{Object.entries(definations).map(([name, defination], index) => (
								!defination.access.actions.create.restricted(auth.user) &&  <GridItem xs={3} sm={2} lg={1} key={"shortcut-"+index}>
									<Link to={defination.access.actions.create.uri}>
										<Typography variant="h3" component="h3" display="block" paragraph center style={{color: defination.color, "&:hover": { color: defination.color }}}>{defination.icon}</Typography>
										<Typography variant="body2" component="p"  display="block" className="grey_text" paragraph center>New {defination.label}</Typography>
									</Link>
								</GridItem>
							))}
																				
						</GridContainer>
					</CardContent>
					<CardActions>
						<GridContainer className="p-0 m-0">
							<GridItem xs={12}>
								<Typography className="grey_text" variant="body2" component="p"  display="block" color="default">Quick Links</Typography>
							</GridItem>													
						</GridContainer>
						
					</CardActions>
								
				</Card>
			</GridContainer>
		);
	}
}


QuickActions.propTypes = {
	//classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	auth: state.auth
});

export default compose(connect(mapStateToProps, {}))(QuickActions);

