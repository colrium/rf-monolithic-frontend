/** @format */

import NotFoundImage from "assets/img/not_found.svg";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import LazyImage from "components/LazyImage";
import Typography from "components/Typography";
import React from "react";
import { withErrorHandler } from "hoc/ErrorHandler";

class NotFound extends React.Component {
	render() {
		const { image, title, description, color } = this.props;

		return (
			<GridContainer
				direction="row"
				justify="center"
				alignItems="center"
				className="h-full"
			>
				<GridItem xs={12} md={8} lg={6}>
					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
					>
						<LazyImage
							alt="Not Found"
							style={{ width: "50%" }}
							src={image}
						/>
					</GridContainer>

					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography variant="h1" color={color}>
							{title}
						</Typography>
					</GridContainer>

					<GridContainer
						direction="column"
						justify="center"
						alignItems="center"
					>
						<Typography variant="body1" color={color}>
							{description}
						</Typography>
					</GridContainer>
				</GridItem>
			</GridContainer>
		);
	}
}

NotFound.defaultProps = {
	title: "404",
	description: "Not Found",
	image: NotFoundImage,
	color: "grey",
};

export default withErrorHandler(NotFound);
