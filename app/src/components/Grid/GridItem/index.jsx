/** @format */

import Grid from "@mui/material/Grid";
import React from "react";

const GridItem = React.forwardRef((props, ref) => {
	const {
		children,
		className,
		...rest
	} = props;
	return (
		<Grid
			xs={12}
			sx={{ padding: theme => theme.spacing() }}
			className={`${className ? className : ""}`}
			ref={ref}
			{...rest}
			item>
			{children}
		</Grid>
	);
})


export default React.memo(GridItem);
