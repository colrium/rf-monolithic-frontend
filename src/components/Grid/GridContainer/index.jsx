/** @format */

import Grid from "@mui/material/Grid";
import React from "react";

const GridContainer = React.forwardRef((props, ref) => {

	let {
		children,
		...rest
	} = props;
	return (
		<Grid container ref={ref} {...rest}>
			{children}
		</Grid>
	);
});


export default (React.memo(GridContainer));
