/** @format */


import { app } from "assets/jss/app-theme";
//
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";
import React from "react";
//Context Views Imports
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";

import ApiService from "services/Api";

class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Under Development");
	}

	render() {

		return (
			<Grid container
				direction="row"
				justify="center"
				alignItems="center"
				style={{ height: "80vh" }}
			>
				<Grid item  xs={12} md={8} lg={6}>
					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography
							variant="h4"
							color="grey"
						>
							Resource Under Development
						</Typography>
					</Grid>

					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
						style={{ padding: "10%" }}
					>
						<img
							alt="Under development"
							style={{ width: "80%" }}
							src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/under_development.svg")}
						/>
					</Grid>

					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography variant="body2">
							We are still developing this resource, please check
							back soon
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}
Page.propTypes = {

};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default (
	compose(

		connect(mapStateToProps, { appendNavHistory })
	)(Page)
);
