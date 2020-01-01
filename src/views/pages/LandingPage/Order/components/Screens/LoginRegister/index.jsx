import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Check from '@material-ui/icons/Check';
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";
import LoginForm from "views/forms/LoginForm";



class Step extends React.Component {

	render() {
		const { onComplete } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer>
					<GridItem xs={12}>
						<Typography variant="h3" className="primary_text" center>Login</Typography>	
					</GridItem>
				</GridContainer>

				<GridContainer className="flex justify-center">
					<GridItem xs={12} md={6}>
						<LoginForm onLogin={onComplete} />	
					</GridItem>
				</GridContainer>

			</GridContainer>
		);
	}
}

export default withRoot(Step);
