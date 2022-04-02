/** @format */

import world from "assets/maps/json/world.json";
import Avatar from "components/Avatar";
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import VectorMap from "components/VectorMap";
import * as definations from "definations";
import React from "react";


const wrapperStyles = {
	width: "100%",
	maxWidth: 980,
	margin: "0 auto",
};

class CountryAggregatesOverview extends React.Component {
	render() {
		return (
			<Card elevation={0} outlineColor="#cfd8dc">
				<CardHeader
					avatar={
						<Avatar
							aria-label={definations.surveys.label}
							style={{ background: definations.surveys.color }}
						>
							{definations.surveys.icon}
						</Avatar>
					}
					title="Country Data Overview"
					subheader={definations.surveys.label}
				></CardHeader>

				<CardContent>
					<GridContainer className="p-0 m-0">
						<VectorMap
							{...world}
							color="#CCCCCC"
							colors={{ Kenya: "#004d3e" }}
							labels={{ Kenya: "Total : 1" }}
							enableSelect={false}
						/>
					</GridContainer>
				</CardContent>
				<CardActions>
					<GridContainer className="p-0 m-0">
						<GridItem xs={12}>
							<Typography variant="body2">
								{" "}
								{definations.surveys.label} by Country Overview{" "}
							</Typography>
						</GridItem>
					</GridContainer>
				</CardActions>
			</Card>
		);
	}
}

export default (CountryAggregatesOverview);
