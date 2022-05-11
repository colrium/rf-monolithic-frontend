/** @format */

import Hidden from "@mui/material/Hidden";
import { app } from "assets/jss/app-theme";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import { environment } from "config";
import React from "react";
import { connect } from "react-redux";
import { addToCart, closeDialog, openDialog, removeFromCart, setOrderProgress } from "state/actions";

import asyncComponent from "views/widgets/asyncComponent";
import Stepper from "./components/Stepper";

const StartScreen = asyncComponent(() => import("./components/Screens/Start"));
const RequestProposal = asyncComponent(() =>
	import("./components/Screens/RequestProposal")
);
const LoginRegisterScreen = asyncComponent(() =>
	import("./components/Screens/LoginRegister")
);
const AccountScreen = asyncComponent(() =>
	import("./components/Screens/Account")
);
const SelectItems = asyncComponent(() =>
	import("./components/Screens/SelectItems")
);
const ConfirmOrder = asyncComponent(() =>
	import("./components/Screens/ConfirmOrder")
);
const Checkout = asyncComponent(() => import("./components/Screens/Checkout"));

class Page extends React.Component {
	state = {
		step: 0,
		steps: {},
		completedSteps: [],
		steps_data: {},
		context: null,
		context_view: null,
	};

	typeSteps = {
		unauthenticated: {
			start: "Start",
			select_items: "Select Items",
			signin_signup: "Signin/Signup",
			checkout: "Checkout",
		},
		authenticated: {
			start: "Start",
			select_items: "Select Items",
			checkout: "Checkout",
		},
		proposalRequest: {
			start: "Start",
			request_proposal: "Request Proposal",
			thankyou: "Complete",
		},
	};

	constructor(props) {
		super(props);
		const { auth } = props;
		this.state.steps = this.typeSteps.unauthenticated;
		if (auth.isAuthenticated) {
			this.state.steps = this.typeSteps.authenticated;
		}

		this.state.step_name = Object.keys(this.state.steps)[this.state.step];

		this.recoverAbadonedOrder = this.recoverAbadonedOrder.bind(this);
		this.handleStepNavigation = this.handleStepNavigation.bind(this);
		this.handleOnStepComplete = this.handleOnStepComplete.bind(this);
		this.handleOnStepCancel = this.handleOnStepCancel.bind(this);
		this.handleOnContextChange = this.handleOnContextChange.bind(this);
		this.handleOnAddToCart = this.handleOnAddToCart.bind(this);
	}

	componentDidMount() {
		const {
			auth,
			order_progress,
			setOrderProgress,
			closeDialog,
			openDialog,
		} = this.props;

		if (
			auth.isAuthenticated &&
			order_progress.step_name !== this.state.step_name
		) {
			if (environment === "development") {
				this.recoverAbadonedOrder();
			} else {
				openDialog({
					title: "Heads Up! We found an abadoned order",
					body:
						"We found some progress for an order you were making. Would you like to recover and proceed from where you left off?",
					actions: {
						cancel: {
							text: "Dismiss",
							color: "grey",
							onClick: closeDialog,
						},
						proceed: {
							text: "Yes please",
							color: "primarydark",
							onClick: () => {
								closeDialog();
								this.recoverAbadonedOrder();
							},
						},
					},
				});
			}
		}

		document.title = app.title("Order");
	}

	recoverAbadonedOrder() {
		const { order_progress, auth } = this.props;
		let steps = this.typeSteps.unauthenticated;
		if (auth.isAuthenticated) {
			steps = this.typeSteps.authenticated;
		}
		if (order_progress.step_name === "request_proposal") {
			steps = this.typeSteps.proposalRequest;
		}
		this.setState(prevState => ({
			step: JSON.positionOfKey(steps, order_progress.step_name),
			step_name: order_progress.step_name,
			steps: steps,
			steps_data: order_progress.steps_data,
		}));
	}

	handleStepNavigation(prev, current) { }

	handleOnStepComplete(data = {}) {
		const { auth, order_progress, setOrderProgress } = this.props;

		let steps = this.typeSteps.unauthenticated;
		if (auth.isAuthenticated) {
			steps = this.typeSteps.authenticated;
		}
		if (this.state.step_name === "request_proposal") {
			steps = this.typeSteps.proposalRequest;
		}

		if (this.state.step === 0) {
			setOrderProgress({
				step_name: Object.keys(steps)[1],
				steps_data: { [Object.keys(steps)[1]]: {} },
			});
			this.setState(prevState => ({
				step: 1,
				step_name: Object.keys(steps)[1],
				steps: steps,
			}));
		} else if (Object.size(steps) - 1 < this.state.step) {
			let steps_data = {};
			if (JSON.isJSON(order_progress.steps_data)) {
				steps_data = JSON.parse(
					JSON.stringify(order_progress.steps_data)
				);
			}
			steps_data[this.state.step_name] = data;
			setOrderProgress({
				step_name: Object.keys(steps)[this.state.step + 1],
				steps_data: steps_data,
			});
			this.setState(prevState => ({
				step: prevState.step + 1,
				step_name: Object.keys(steps)[prevState.step + 1],
				steps: steps,
			}));
		} else {
			setOrderProgress({ step_name: "start", steps_data: {} });
			this.setState(prevState => ({
				step: 0,
				step_name: Object.keys(steps)[0],
				steps: steps,
				order_complete: true,
			}));
		}
	}

	handleOnStepCancel() {
		const { auth, order_progress, setOrderProgress } = this.props;
		let steps = this.typeSteps.unauthenticated;
		if (auth.isAuthenticated) {
			steps = this.typeSteps.authenticated;
		}
		if (this.state.step === 0) {
			steps = this.typeSteps.proposalRequest;
			setOrderProgress({
				step_name: Object.keys(steps)[1],
				steps_data: { [Object.keys(steps)[1]]: {} },
			});
			this.setState(prevState => ({
				step: 1,
				step_name: "request_proposal",
				steps: steps,
			}));
		} else {
			let steps_data = {};
			if (JSON.isJSON(order_progress.steps_data)) {
				steps_data = JSON.parse(
					JSON.stringify(order_progress.steps_data)
				);
			}
			if (this.state.step_name in steps_data) {
				delete steps_data[this.state.step_name];
			}

			setOrderProgress({
				step_name: Object.keys(steps)[this.state.step - 1],
				steps_data: steps_data,
			});
			this.setState(prevState => ({
				steps: steps,
				step: prevState.step - 1,
				step_name: Object.keys(steps)[prevState.step - 1],
			}));
		}
	}

	handleOnContextChange(context, view) {
		const { setOrderProgress, order_progress } = this.props;
		setOrderProgress({
			step_name: Object.keys(this.state.steps)[this.state.step],
			steps_data: {
				...this.state.steps_data,
				[Object.keys(this.state.steps)[this.state.step]]: {
					...this.state.steps_data[
					Object.keys(this.state.steps)[this.state.step]
					],
					context: context,
					view: view,
				},
			},
		});
		this.setState(prevState => ({
			steps_data: {
				...this.state.steps_data,
				[Object.keys(this.state.steps)[this.state.step]]: {
					...this.state.steps_data[
					Object.keys(this.state.steps)[this.state.step]
					],
					context: context,
					view: view,
				},
			},
		}));
	}

	handleOnAddToCart(entry) {
		const { addToCart } = this.props;
		addToCart(entry);
	}

	render() {
		let step_data = JSON.isJSON(this.state.steps_data[this.state.step_name])
			? this.state.steps_data[this.state.step_name]
			: {};
		return (
			<Grid container className="p-0 m-0 md:relative md:mb-8 md:h-screen bg-gray-100 md:overflow-x-hidden md:overflow-y-hidden">
				<Grid item
					xs={12}
					md={3}
					className="inverse md:absolute md:top-0 md:left-0 md:right-auto md:h-screen"
				>
					<Grid container className="absolute center">
						<Grid item >
							<Hidden smDown>
								<Stepper
									color="grey"
									activeColor="primary"
									type="default"
									step={this.state.step}
									steps={this.state.steps}
									onStep={this.handleStepNavigation}
								/>
							</Hidden>

							<Hidden mdUp>
								<Stepper
									color="grey"
									activeColor="primary"
									type="mobile"
									step={this.state.step}
									steps={this.state.steps}
									onStep={this.handleStepNavigation}
								/>
							</Hidden>
						</Grid>
					</Grid>
				</Grid>
				<Grid item
					xs={12}
					md={9}
					className="md:p-4 md:pt-8 md:absolute md:top-0 md:right-0 md:h-screen "
				>
					<Grid container className="px-8 h-16 md:absolute md:top-0">
						<Grid item  xs={12} md={8} className="p-2">
							<Typography
								variant="h4"
								className="default_text text-left"
							>
								{" "}
								{this.state.steps[this.state.step_name]}{" "}
							</Typography>
						</Grid>

						<Grid item  xs={12} md={4} className="p-2">
							<Typography
								variant="h6"
								className="grey_text text-right font-bold uppercase"
							>
								Step {this.state.step + 1} /{" "}
								{Object.size(this.state.steps)}{" "}
							</Typography>
						</Grid>
					</Grid>

					<Grid container className="xs:px1 md:px-8 h-full mt-8 overflow-y-auto overflow-x-hidden">
						{this.state.step_name === "start" && (
							<StartScreen
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
						{this.state.step_name === "select_items" && (
							<SelectItems
								onContextChange={this.handleOnContextChange}
								onAddToCart={this.handleOnAddToCart}
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
						{this.state.step_name === "request_proposal" && (
							<RequestProposal
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
						{this.state.step_name === "signin_signup" && (
							<LoginRegisterScreen
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
						{this.state.step_name === "account" && (
							<AccountScreen
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
						{this.state.step_name === "confirm" && (
							<ConfirmOrder
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
						{this.state.step_name === "checkout" && (
							<Checkout
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
						{this.state.step_name === "thankyou" && (
							<Checkout
								onComplete={this.handleOnStepComplete}
								onCancel={this.handleOnStepCancel}
								{...step_data}
							/>
						)}
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	order_progress: state.ecommerce.order_progress,
});

export default (
	connect(mapStateToProps, {
		setOrderProgress,
		addToCart,
		removeFromCart,
		closeDialog,
		openDialog,
	})(Page)
);
