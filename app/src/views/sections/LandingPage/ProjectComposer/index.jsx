/** @format */
import React from "react";
import Hidden from "@mui/material/Hidden";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import ProgressSidebar from "./Progress/Sidebar";
import ProgressMobile from "./Progress/Mobile";
import Stages from "./Stages";



const ComposeProject = (props) => {
	return (
		<GridContainer className="p-0">
			<GridContainer
				className="p-0 relative"
				sx={{
					backgroundColor: ( theme ) => `${ theme.palette.background.default }`,
					display: {
						xs: 'none',
						md: 'flex'
					}
				}}
			>
				<GridItem xs={12} md={2} className="p-0 py-4 secondary relative">
					<ProgressSidebar />
				</GridItem>
				<GridItem xs={12} md={10} className="p-0 relative">
					<Stages />
				</GridItem>
			</GridContainer>

			<GridContainer
				className="p-0 relative"
				sx={{
					backgroundColor: ( theme ) => `${ theme.palette.background.default }`,
					display: {
						md: 'none',
						xs: 'block'
					}
				}}
			>

				<GridItem xs={12} className="p-0 py-4 relative">
					<ProgressMobile />
				</GridItem>

				<GridItem xs={12} className="p-0 relative">

					<Stages />


				</GridItem>
			</GridContainer>
		</GridContainer>
	)
}

export default ComposeProject;
