import React from "react";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { Link } from 'react-router-dom';
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/Button";
import Typography from "components/Typography";
import withRoot from "utils/withRoot";

class RequestError extends React.Component {
	render() {
		const { icon, code, title, description, color, link } = this.props;

		return (
			<GridContainer direction="row" justify="center" alignItems="center" className="h-full"  >
				<GridItem className="h-full" xs={12} md={8} lg={6}>
					<GridContainer className="h-full" direction="column" justify="center" alignItems="center">
						<GridItem xs={12}>
							<Typography color="error" className="text-6xl" variant="h1" center fullWidth>
								{icon}
							</Typography>
						</GridItem>
						<GridItem xs={12}>
							<Typography color="grey" className="text-3xl" variant="h3" center fullWidth>
								{code}
							</Typography>
						</GridItem>
						<GridItem xs={12}>
							<Typography color={color} variant="h4" center fullWidth>
								{title}
							</Typography>
						</GridItem>

						<GridItem xs={12}>
							<Typography color="default" variant="body1" center fullWidth>
								{description}
								</Typography>
						</GridItem>

						<GridItem xs={12}>
							<Typography color="error" variant="body1" center fullWidth>
								<Link to={link}> <Button variant="text" color="default" simple> Back </Button> </Link>
							</Typography>
						</GridItem>
					</GridContainer>
				</GridItem>
			</GridContainer>
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

export default withRoot(RequestError);
