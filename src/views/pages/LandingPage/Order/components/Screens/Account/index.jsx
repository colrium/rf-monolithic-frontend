import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Check from '@material-ui/icons/Check';
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";
import Profile from "views/pages/Dashboard/Account/components/Profile";



class Step extends React.Component {

	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer>
					<GridItem xs={12}>
						<Typography variant="h3" className="primary_text">Account</Typography>	
					</GridItem>
				</GridContainer>

				<GridContainer className="flex justify-center">
					<GridItem xs={12}>
						<Profile />	
					</GridItem>
				</GridContainer>

				<GridContainer className="p-4">
					<GridItem xs={12} md={6} className="flex justify-start">
						<Button onClick={onComplete} color="primary" round ><Check /> Proceed with this Account</Button>
					</GridItem>
					<GridItem xs={12} md={6} className="flex justify-end">
						<Button onClick={onCancel} color="inverse" round > Switch to another Account </Button>
					</GridItem>
				</GridContainer>

			</GridContainer>
		);
	}
}

export default withRoot(Step);
