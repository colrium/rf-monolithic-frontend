/** @format */
//
import Grid from '@mui/material/Grid';
;
import LazyImage from "components/LazyImage";
import Typography from '@mui/material/Typography';
import React from "react";

import { Api as ApiService } from "services";

class NotFound extends React.Component {
	render() {
		const { image = ("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/not_found.svg"), title, description, color } = this.props;

		return (
			<Grid container
				direction="row"
				justify="center"
				alignItems="center"
				className="h-full"
			>
				<Grid item  xs={12} md={8} lg={6}>
					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<LazyImage
							alt="Not Found"
							style={{ width: "50%" }}
							src={image}
						/>
					</Grid>

					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography variant="h1" color={color}>
							{title}
						</Typography>
					</Grid>

					<Grid container
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography variant="body1" color={color}>
							{description}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

NotFound.defaultProps = {
	title: "404",
	description: "Not Found",
	color: "grey",
};

export default (NotFound);
