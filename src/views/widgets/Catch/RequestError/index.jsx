/** @format */

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Button from "@mui/material/Button";
//
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";
import { Link } from "react-router-dom";


class RequestError extends React.Component {
	render() {
		const { icon, code, title, description, color, link } = this.props;

		return (
			<Grid container
				direction="row"
				justify="center"
				alignItems="center"
				className="h-full"
			>
				<Grid item  className="h-full" xs={12} md={8} lg={6}>
					<Grid container
						className="h-full"
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Grid item  xs={12}>
							<Typography
								color="error"
								className="text-6xl"
								variant="h1"
																fullWidth
							>
								{icon}
							</Typography>
						</Grid>
						<Grid item  xs={12}>
							<Typography
								color="grey"
								className="text-3xl"
								variant="h3"
																fullWidth
							>
								{code}
							</Typography>
						</Grid>
						<Grid item  xs={12}>
							<Typography
								color={color}
								variant="h4"
																fullWidth
							>
								{title}
							</Typography>
						</Grid>

						<Grid item  xs={12}>
							<Typography

								variant="body1"
																fullWidth
							>
								{description}
							</Typography>
						</Grid>

						<Grid item  xs={12}>
							<Typography
								color="error"
								variant="body1"
																fullWidth
							>
								<Link to={link}>
									{" "}
									<Button
										variant="text"


									>
										{" "}
										Back{" "}
									</Button>{" "}
								</Link>
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

RequestError.defaultProps = {
	title: "Request Failed!",
	description: "Something went wrong! Request Failed.",
	icon: <WarningRoundedIcon className="text-6xl" />,
	color: "grey",
	code: 503,
	link: "/",
};

export default (RequestError);
