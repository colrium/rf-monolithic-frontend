/** @format */

import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import Button from "components/Button";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import { Link } from "react-router-dom";
import { withErrorHandler } from "hoc/ErrorHandler";

class AccessDenied extends React.Component {
	render() {
		const { icon, title, description, color, link } = this.props;

		return (
			<GridContainer
				direction="row"
				justify="center"
				alignItems="center"
				className="h-full"
			>
				<GridItem className="h-full" xs={12} md={8} lg={6}>
					<GridContainer
						className="h-full"
						direction="column"
						justify="center"
						alignItems="center"
					>
						<GridItem xs={12}>
							<Typography
								color="error"
								className="text-4xl"
								variant="h1"
								center
								fullWidth
							>
								{icon}
							</Typography>
						</GridItem>
						<GridItem xs={12}>
							<Typography
								color={color}
								variant="h3"
								center
								fullWidth
							>
								{title}
							</Typography>
						</GridItem>

						<GridItem xs={12}>
							<Typography
								color="default"
								variant="body1"
								center
								fullWidth
							>
								{description}
							</Typography>
						</GridItem>

						<GridItem xs={12}>
							<Typography
								color="error"
								variant="body1"
								center
								fullWidth
							>
								<Link to={link}>
									{" "}
									<Button
										variant="text"
										color="default"
										simple
									>
										{" "}
										Back{" "}
									</Button>{" "}
								</Link>
							</Typography>
						</GridItem>
					</GridContainer>
				</GridItem>
			</GridContainer>
		);
	}
}

AccessDenied.defaultProps = {
	title: "Access Denied!",
	description:
		"Sorry! Access to this resource has been denied since you lack required priviledges. <br /> Please contact the system administrator for further details.",
	icon: <WarningRoundedIcon className="text-6xl" />,
	color: "grey",
	link: "home".toUriWithDashboardPrefix(),
};

export default withErrorHandler(AccessDenied);
