import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import Check from '@material-ui/icons/Check';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";



class Widget extends React.Component {
	state={
		loading: true,
		load_error: false,
	};

	constructor(props) {
		super(props);
		let { checkout_data, history, cart, auth } = props;
		if (cart.entries.length > 0) {
			//do nothing
		}
		else{
			if (history) {
				history.push("/catalog".toUriWithLandingPagePrefix());
			}
			else{
				window.location.href = "/catalog".toUriWithLandingPagePrefix();
			}
		}

	}

	componentDidMount(){

	}


	render() {
		let { checkout_data, cart, auth } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer className="flex justify-center">
					<GridItem xs={12}>
						<div className="panel flex flex-col md:flex-row mb-8">
							<div className="panel-left w-full md:w-4/5 bg-white rounded-l">
								<h1 className="text-3xl font-normal p-10 border-b border-solid border-grey-light">Checkout</h1>
								<h3 className="text-xl font-normal pl-10 truncate">Order: {checkout_data.oid}</h3>

								
									<GridContainer >
										<GridItem xs={12}>
											<List className="w-full">
												{cart.entries.map((entry, index) => {
													let { item } = entry;
													if (!JSON.isJSON(item)) {
														item = {};
													}
													return (
														<ListItem alignItems="flex-start" className="inverse mb-2 rounded" key={"cart-item-"+index}>
															<ListItemText
																primary={item.name}
																secondary={
																	<GridContainer className="p-0">
																		<GridItem xs={12} className="m-0 p-0">
																			<Typography component="div" variant="body2" className="w-full " color="grey" > {item.description} </Typography>
																		</GridItem>
																		<GridItem xs={12} className="m-0 mt-2 p-0">
																			<Typography component="div" variant="body1" className="inline" color="default" > { item.cost } </Typography>
																		</GridItem>
																		
																	</GridContainer>
																}
															/>
														</ListItem>
													);
												})}
											</List>
										</GridItem>
									</GridContainer>
									
							</div>
							<div className="panel-right w-full md:w-1/3 bg-gray-400 relative rounded-r">
								<div className="p-10">
									<h2 className="font-bold text-xl mb-4">Total</h2>
									<div className="mb-4 text-2xl">
										<span className="align-top">{checkout_data.curr}</span>
										<span className="font-light lh-fix">{checkout_data.ttl}</span>
									</div>

								</div>
								<form action={checkout_data.ipn} method="post" target="_blank" className="relative bottom-0 md:mb-8 mx-4">
										{Object.entries(checkout_data).map(([name, value], cursor)=>(
											name !== "ipn" && <input type="hidden" name={name} value={value} key={name}/>
										))}
										<Button type="submit" color="primary" round ><Check /> Complete Order</Button>
								</form>
							</div>
						</div>
					</GridItem>
				</GridContainer>

				

			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	cart: state.ecommerce.cart,
	checkout_data: state.ecommerce.checkout_data,
	sockets: state.sockets,
});

export default withRoot(connect(mapStateToProps, {})(Widget));