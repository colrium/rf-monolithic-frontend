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
		const { icon, title, description, color, link, linkText } = this.props;

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
						<GridItem xs={12} className={"flex justify-center"}>
							<Typography
								color="error"
								style={{fontSize: "12rem"}}
								variant="h1"
							>
								{icon}
							</Typography>
						</GridItem>
						<GridItem xs={12}  className={"flex justify-center"}>
							<Typography
								color={color}
								variant="h3"
								className={"text-center"}
							>
								{title}
							</Typography>
						</GridItem>

						<GridItem xs={12} className={"flex justify-center"}>
							<Typography
								color="default"
								variant="body1"
								className={"text-center"}
							>
								{description}
							</Typography>
						</GridItem>

						<GridItem xs={12} className={"flex justify-center"}>
							<Link to={link}>
									<Button
										variant="text"
										color="default"
										simple
									>
										{linkText}
									</Button>
								</Link>
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
		"Sorry! Access to this resource has been denied since you lack required priviledges. \n Please contact the system administrator for further details.",
	icon: <WarningRoundedIcon fontSize="inherit" />,
	color: "grey",
	link: "home".toUriWithDashboardPrefix(),
	linkText: "Home",
};

export default withErrorHandler(AccessDenied);
