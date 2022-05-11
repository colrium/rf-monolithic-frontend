/** @format */
import React from "react";
import Hidden from "@mui/material/Hidden";
import Grid from '@mui/material/Grid';
;
import ProjectComposerSection from "views/sections/LandingPage/ProjectComposer";


const ComposeProject = (props) => {
	return (
		<Grid container className="p-0">
			<Grid item  xs={12} className="p-0 relative">
				<ProjectComposerSection />
			</Grid>
		</Grid>
	)
}

export default ComposeProject;
