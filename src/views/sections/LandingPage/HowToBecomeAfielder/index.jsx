/** @format */


import Button from '@mui/material/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@mui/material/Typography";
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";
import { Link } from "react-router-dom";
import Hidden from '@mui/material/Hidden';



import ApiService from "services/Api";

const styles = theme => ({


});

const SectionComponent = (props) => {
	const { theme } = props;
	return (
		<Section className={"p-0  md:pt-2 "} id="being-a-fielder">
			<GridContainer className={"p-0"}>
				<GridItem xs={12} className={"p-0"}>
					<Typography variant="h4" color="text.secondary">
						Being a Fielder
					</Typography>
				</GridItem>
			</GridContainer>

			<GridContainer className={"p-0 py-6"}>
				<GridItem xs={12} className={"p-0 flex flex-row items-center justify-center relative"} sx={{ height: "50vh !important" }}>
					<iframe
						width="853"
						height="480"
						src={`https://www.youtube.com/embed/hRf_WPDOPv4`}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="relative left-0 top-0 w-full"
						title="Embedded youtube"
					/>
				</GridItem>
			</GridContainer>
		</Section>
	)
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default compose(connect(mapStateToProps, {}), withTheme)(SectionComponent);
