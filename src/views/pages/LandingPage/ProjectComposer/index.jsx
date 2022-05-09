/** @format */
import React from "react";
import Hidden from "@mui/material/Hidden";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ProjectComposerSection from "views/sections/LandingPage/ProjectComposer";


const ComposeProject = (props) => {
	return (
		<GridContainer className="p-0">
			<GridItem xs={12} className="p-0 relative">
				<ProjectComposerSection />
			</GridItem>
		</GridContainer>
	)
}

export default ComposeProject;
