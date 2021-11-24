/** @format */

import Check from "@mui/icons-material/Check";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
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
			<GridContainer className="p-0 m-0">
				<GridContainer className="flex-2">
					<GridItem xs={12}>
						<Typography variant="h3" className="primary_text">
							Order Items
						</Typography>
					</GridItem>
				</GridContainer>

				<GridContainer className="p-4">
					<GridItem xs={12} md={6} className="flex justify-start">
						<Button onClick={onComplete} color="primary" round>
							<Check /> Proceed to Checkout
						</Button>
					</GridItem>
					<GridItem xs={12} md={6} className="flex justify-end">
						<Button onClick={onCancel} color="inverse" round>
							{" "}
							Back{" "}
						</Button>
					</GridItem>
				</GridContainer>
			</GridContainer>
		);
	}
}

export default Step;
