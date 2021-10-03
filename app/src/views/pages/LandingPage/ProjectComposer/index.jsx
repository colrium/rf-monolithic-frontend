/** @format */
import React from "react";
import Hidden from "@material-ui/core/Hidden";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ProgressSidebar from "./Progress/Sidebar";
import Stages from "./Stages";



const ComposeProject = (props) => {
	return (
		<GridContainer className="p-0">
			<Hidden smDown>
				<GridContainer className="p-0">
					<GridItem md={4} className="p-0 py-4 secondary">
						<ProgressSidebar />
					</GridItem>
					<GridItem md={8} className="p-0 py-4 inverse">
						<Stages />
					</GridItem>
				</GridContainer>
			</Hidden>
		</GridContainer>
	)
}

export default ComposeProject;