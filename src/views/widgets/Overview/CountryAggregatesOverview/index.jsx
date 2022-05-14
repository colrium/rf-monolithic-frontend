/** @format */

import world from "assets/maps/json/world.json";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
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
			<Card elevation={0}>
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
					<Grid container className="p-0 m-0">
						<VectorMap
							{...world}
							color="#CCCCCC"
							colors={{ Kenya: "#004d3e" }}
							labels={{ Kenya: "Total : 1" }}
							enableSelect={false}
						/>
					</Grid>
				</CardContent>
				<CardActions>
					<Grid container className="p-0 m-0">
						<Grid item  xs={12}>
							<Typography variant="body2">
								{" "}
								{definations.surveys.label} by Country Overview{" "}
							</Typography>
						</Grid>
					</Grid>
				</CardActions>
			</Card>
		);
	}
}

export default (CountryAggregatesOverview);
