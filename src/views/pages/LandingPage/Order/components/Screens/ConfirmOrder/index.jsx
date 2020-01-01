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

	loadItems(params){
		retailItemsService.getRecords(params).then(res => {
			console.log("retailItemsService res", res);
			this.setState(prevState=>({retailitems: res.body.data, loading: false, load_err: null}));
		}).catch(err => {
			this.setState(prevState=>({retailitems: [], loading: false, load_err: err}));
		});
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
				{ this.state.loading && <GridContainer className="flex-10" justify="center" alignItems="center">
					<ProgressIndicator size={34} thickness={2} type="logo" color="secondary" />
				</GridContainer> }

				{ !this.state.loading && Array.isArray(this.state.retailitems) && <ScrollBars className="flex-10 overflow-x-hidden overflow-y-scroll">
					<GridContainer className="p-4 m-0">
						{this.state.retailitems.map((retailitem, cursor) => (
							retailitem.available && <GridItem xs={12} md={4} className="flex flex-col" key={retailitem._id}>
								<div className="bg-white shadow-xl rounded-lg overflow-hidden">
									<div className="bg-cover bg-center h-56 p-0">
										<LazyImage className="w-full h-full" src={retailitem.featured_image? AttachmentsService.getAttachmentFileUrl(retailitem.featured_image) : LogoChevron } />
									</div>
									<div className="p-4">
										<p className="uppercase truncate tracking-wide text-sm  text-gray-700">{retailitem.name}</p>
										{ retailitem.cost > 0 && JSON.isJSON(retailitem.currency) && <p className="text-3xl text-gray-900 my-4">{retailitem.currency.html_symbol +" "+retailitem.cost }</p> }
										<p className="text-gray-700">{retailitem.description? retailitem.description.shorten(50) : ""}</p>
									</div>
									<div className="flex p-4 border-t border-gray-300 text-gray-700">
										<div className="flex-1 inline-flex items-center">											
											<p className=" text-gray-900 font-bold">Type</p>
										</div>
										<div className="flex-1 inline-flex items-left">
											<p className="capitalize">{ retailitem.item_type }</p>
										</div>
									</div>
									<div className="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
										<Button className="w-full" color="primary">View</Button>
									</div>
								</div>
							</GridItem> ))}
					</GridContainer> 
				</ScrollBars>}

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
