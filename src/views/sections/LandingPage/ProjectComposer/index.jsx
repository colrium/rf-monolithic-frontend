/** @format */
import React from "react";
import Hidden from "@mui/material/Hidden";
import Grid from '@mui/material/Grid';
;

import ProgressSidebar from "./Progress/Sidebar";
import ProgressMobile from "./Progress/Mobile";
import Stages from "./Stages";



const ComposeProject = (props) => {
	return (
		<Grid container className="p-0">
			<Grid container
				className="p-0 relative"
				sx={{
					backgroundColor: ( theme ) => `${ theme.palette.background.default }`,
					display: {
						xs: 'none',
						md: 'flex'
					}
				}}
			>
				<Grid item  xs={12} md={2} className="p-0 py-4 secondary relative">
					<ProgressSidebar />
				</Grid>
				<Grid item  xs={12} md={10} className="p-0 relative">
					<Stages />
				</Grid>
			</Grid>

			<Grid container
				className="p-0 relative"
				sx={{
					backgroundColor: ( theme ) => `${ theme.palette.background.default }`,
					display: {
						md: 'none',
						xs: 'block'
					}
				}}
			>

				<Grid item  xs={12} className="p-0 py-4 relative">
					<ProgressMobile />
				</Grid>

				<Grid item  xs={12} className="p-0 relative">

					<Stages />


				</Grid>
			</Grid>
		</Grid>
	)
}

export default ComposeProject;
