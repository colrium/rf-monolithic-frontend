/** @format */

import * as React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

const ErrorFallback = props => {
	const { error, resetErrorBoundary } = props
	return (
		<Card className="w-full">
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="error" gutterBottom>
					Something went wrong:
				</Typography>
				<Typography variant="h5" component="pre" className="w-full">
					{error.message}
				</Typography>
			</CardContent>
			{Function.isFunction(resetErrorBoundary) && (
				<CardActions>
					<Button onClick={resetErrorBoundary} size="small">
						Try again
					</Button>
				</CardActions>
			)}
		</Card>
	)
}
export default ErrorFallback
