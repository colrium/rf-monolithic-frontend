import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Check from '@material-ui/icons/Check';
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";
import ScrollBars from "components/ScrollBars";
import ProgressIndicator from "components/ProgressIndicator";
import LazyImage from "components/LazyImage";
import LogoChevron from "assets/img/realfield/logo-chevron.svg";
import { retailitems as retailItemsService, attachments as AttachmentsService } from "services";


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

	componentDidMount(){
		this.loadItems({p:1});
	}


	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer className="flex-2">
					<GridItem xs={12}>
						<Typography variant="h3" className="primary_text">Order Items</Typography>	
					</GridItem>
				</GridContainer>

				<GridContainer className="p-4">
					<GridItem xs={12} md={6} className="flex justify-start">
						<Button onClick={onComplete} color="primary" round ><Check /> Proceed to Checkout</Button>
					</GridItem>
					<GridItem xs={12} md={6} className="flex justify-end">
						<Button onClick={onCancel} color="inverse" round > Back </Button>
					</GridItem>
				</GridContainer>

			</GridContainer>
		);
	}
}

export default withRoot(Step);
