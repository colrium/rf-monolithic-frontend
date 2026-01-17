/** @format */


import { app } from "assets/jss/app-theme";
//
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";

import ApiService from "services/Api";

//

class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Resource Not Found");
	}

	render() {

		return (
			<Grid container
				className="flex flex-row justify-center items-center"
				style={{ height: "80vh" }}
			>
				<Grid item  xs={12} md={8} lg={6}>
					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
						style={{ padding: "10%" }}
					>
						<img
							alt="Under development"
							style={{ width: "50%" }}
							src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/not_found.svg")}
						/>
					</Grid>

					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography
							variant="h1"
							color="grey"
						>
							404
						</Typography>
					</Grid>

					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography
							variant="body1"
							color="grey"
						>
							Page Not Found
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}
const mapStateToProps = state => ({
	user: state.user,
});

export default compose(connect(mapStateToProps, {}))(Page);
