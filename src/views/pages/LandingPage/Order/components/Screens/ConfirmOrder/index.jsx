/** @format */

import Check from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";


class Step extends React.Component {
	state = {
		retailitems: [],
		loading: true,
		load_err: false,
		view: "catalog",
		viewing: "retailitems",
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.loadItems({ p: 1 });
	}

	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<Grid container className="p-0 m-0">
				<Grid container className="flex-2">
					<Grid item  xs={12}>
						<Typography variant="h3" className="primary_text">
							Order Items
						</Typography>
					</Grid>
				</Grid>

				<Grid container className="p-4">
					<Grid item  xs={12} md={6} className="flex justify-start">
						<Button onClick={onComplete} color="primary" round>
							<Check /> Proceed to Checkout
						</Button>
					</Grid>
					<Grid item  xs={12} md={6} className="flex justify-end">
						<Button onClick={onCancel} color="inverse" round>
							{" "}
							Back{" "}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export default Step;
