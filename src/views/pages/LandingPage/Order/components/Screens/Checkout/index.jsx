/** @format */

import Check from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";
import ApiService from "services/Api";


class Step extends React.Component {
	state = {
		gatewayData: {},
		loading: true,
		load_error: false,
	};
	componentDidMount() {
		this.getGatewayData();
	}

	getGatewayData() {
		const data = {
			context: "order",
			order: "5d8898eb5a5b2e18dcce136f",
			currency: "5df1232600437021f4d58786",
			amount: 300,
			reference: "FGTDSSR66M",
			made_by: "5d39a76c9bdc1620ecce5c4b",
			account: "23456787665",
			phone: "+254724146857",
			email: "colrium@gmail.com",
		};
		ApiService.post("/payments/gateway", data)
			.then(res => {
				this.setState(state => ({
					gatewayData: res.body.data,
					load_error: false,
					loading: false,
				}));
			})
			.catch(err => {
				this.setState(state => ({
					gatewayData: {},
					load_error: err,
					loading: false,
				}));
			});
	}

	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<Grid container className="p-0 m-0">
				<Grid container>
					<Grid item  xs={12}>
						<Typography variant="h3" className="primary_text">
							Checkout
						</Typography>
					</Grid>
				</Grid>

				<Grid container className="flex justify-center">
					<Grid item  xs={12}>
						<div className="panel flex flex-col md:flex-row mb-8 shadow-lg">
							<div className="panel-left w-full md:w-2/3 bg-white rounded-l">
								<form action="#">
									<h1 className="text-3xl font-normal p-10 border-b border-solid border-grey-light">
										Checkout
									</h1>
								</form>
							</div>
							<div className="panel-right w-full md:w-1/3 secondary text-white rounded-r">
								<div className="p-10">
									<h2 className="font-bold text-xl mb-4">
										Total
									</h2>
									<div className="mb-4 text-6xl">
										<span className="align-top">$</span>
										<span className="font-light lh-fix">
											99
										</span>
									</div>
									<div className="italic w-3/4 leading-normal mb-8">
										Automatically renews after 1 year
									</div>

									<div className="mb-10 pb-2">
										<div className="mb-2">
											Need{" "}
											<span className="font-bold">
												20
											</span>{" "}
											clients?
										</div>
										<a
											href="#"
											className="text-white font-bold border-b-2 border-solid border-blue-light"
										>
											Switch to the Agency plan.
										</a>
									</div>
									<div className="border-b border-solid border-blue-light"></div>
									<div className="testimonial pt-10 text-lg italic leading-normal mb-4">
										FTP is horrible to deal with.{" "}
										<span className="font-bold">
											WP Pusher
										</span>{" "}
										solves that issue, and the customer
										support is awesome!
									</div>
									<div className="flex items-center">
										<img
											src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/wppusher_avatar.png"
											alt="avatar"
											className="rounded-full mr-2"
										/>
										<div className="text-lg font-bold">
											Kirk Beard
										</div>
									</div>
								</div>
							</div>
						</div>
					</Grid>
				</Grid>

				<Grid container className="p-4">
					<Grid item  xs={12} md={6} className="flex justify-start">
						<form action={this.state.gatewayData.ipn} method="post">
							{Object.entries(this.state.gatewayData).map(
								([name, value], cursor) =>
									name !== "ipn" && (
										<input
											type="hidden"
											name={name}
											value={value}
											key={name}
										/>
									)
							)}
							<Button type="submit" color="primary" round>
								<Check /> Complete Order
							</Button>
						</form>
					</Grid>
					<Grid item  xs={12} md={6} className="flex justify-end">
						<Button onClick={onCancel} color="inverse" round>
							{" "}
							Go back{" "}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export default Step;
