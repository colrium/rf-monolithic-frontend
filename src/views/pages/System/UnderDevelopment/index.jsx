/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import UnderConstructionImage from "assets/img/under_development.svg";
import { app } from "assets/jss/app-theme";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import PropTypes from "prop-types";
import React from "react";
//Context Views Imports
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";
import { withErrorHandler } from "hoc/ErrorHandler";
//
import styles from "views/pages/styles";

class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Under Development");
	}

	render() {
		const { classes } = this.props;

		return (
			<GridContainer
				className={classes.root}
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
					>
						<Typography
							variant="h4"
							className={classes.main_title}
							color="grey"
						>
							Resource Under Development
						</Typography>
					</GridContainer>

					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
						style={{ padding: "10%" }}
					>
						<img
							alt="Under development"
							className={classes.image}
							style={{ width: "80%" }}
							src={UnderConstructionImage}
						/>
					</GridContainer>

					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography variant="body2">
							We are still developing this resource, please check
							back soon
						</Typography>
					</GridContainer>
				</GridItem>
			</GridContainer>
		);
	}
}
Page.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(
		withStyles(styles),
		connect(mapStateToProps, { appendNavHistory })
	)(Page)
);
