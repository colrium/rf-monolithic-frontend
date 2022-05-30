/** @format */

import React from "react"
import Grid from "@mui/material/Grid"

const Form = React.forwardRef(({ children, sx, ...rest }, ref) => {
	return (
		<Grid
			container
			component="form"
			sx={{
				"& .MuiFormHelperText-root": {
					marginLeft: `2px !important`,
					marginRight: `2px !important`,
					"& .MuiFormHelperText-root": {
						marginLeft: `0px !important`,
						marginRight: `0px !important`,
					},
				},
				...sx,
			}}
			{...rest}
			ref={ref}
		>
			<Grid item xs={12}>
				{children}
			</Grid>
		</Grid>
	)
})
export default Form
