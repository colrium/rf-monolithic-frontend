import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Check from '@material-ui/icons/Check';
import Hidden from '@material-ui/core/Hidden';
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";
import ScrollBars from "components/ScrollBars";
import Stepper from "./components/Stepper";
import { setLandingPageOrderPageState, closeDialog, openDialog } from "state/actions";
import {app} from "assets/jss/app-theme";

import asyncComponent from "views/widgets/asyncComponent";
const StartScreen = asyncComponent(() => import("./components/Screens/Start"));
const RequestProposal = asyncComponent(() => import("./components/Screens/RequestProposal"));
const LoginRegisterScreen = asyncComponent(() => import("./components/Screens/LoginRegister"));
const AccountScreen = asyncComponent(() => import("./components/Screens/Account"));
const SelectItems = asyncComponent(() => import("./components/Screens/SelectItems"));
const ConfirmOrder = asyncComponent(() => import("./components/Screens/ConfirmOrder"));
const Checkout = asyncComponent(() => import("./components/Screens/Checkout"));




class Page extends React.Component {
	state = {
		step: 0,
		steps: {
			start: "Start",
			select_items: "Select Items",
			signin_signup: "Signin/Signup",
			account: "Account",
			confirm: "Confirm Order",
			checkout: "Checkout",
			thankyou: "Complete",
		},
		completedSteps: [],
	};

	constructor(props) {
		super(props);
		const { auth, orderpage_state, setLandingPageOrderPageState } = props;
		if (auth.isAuthenticated) {
			this.state.steps = {
				start: "Start",
				select_items: "Select Items",
				confirm: "Confirm Order",
				checkout: "Checkout",
				thankyou: "Complete",
			};
		}
		else{
			this.state.steps = {
				start: "Start",
				select_items: "Select Items",
				signin_signup: "Signin/Signup",
				confirm: "Confirm Order",
				checkout: "Checkout",
				thankyou: "Complete",
			};
		}
		
		this.state.step_name = Object.keys(this.state.steps)[this.state.step];
		
		this.proceedWithOrderProgress = this.proceedWithOrderProgress.bind(this);
		this.handleStepNavigation = this.handleStepNavigation.bind(this);
		this.handleOnStepComplete = this.handleOnStepComplete.bind(this);
		this.handleOnStepCancel = this.handleOnStepCancel.bind(this);
	}

	componentDidMount(){
		const { auth, orderpage_state:{ order_progress }, setLandingPageOrderPageState, closeDialog, openDialog } = this.props;
		this.proceedWithOrderProgress();
		
		/*if (auth.isAuthenticated && order_progress.step_name !== this.state.step_name) {
			openDialog({
				title: "Heads Up!",
				body: "We found some progress for an order you were filling in. Would you like to proceed from where you left off?",
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
							this.proceedWithOrderProgress();
						},
					}
				}
			});
		}*/
			
		document.title = app.title("Order");
	}

	proceedWithOrderProgress(){
		const { orderpage_state:{ order_progress }, } = this.props;
		if (order_progress.step_name === "request_proposal") {
			this.setState(prevState=>({step: 1, steps: { start: "Start", request_proposal: "Request Proposal"}, ...order_progress}));
		}
		else{
			this.setState(prevState => ({ step: JSON.positionOfKey(prevState.steps, order_progress.step_name), ...order_progress,  }));
		}
		/*console.log("this.state.steps", this.state.steps, "order_progress.step_name", order_progress.step_name);
		console.log("JSON.positionOfKey(this.state.steps, order_progress.step_name)", JSON.positionOfKey(this.state.steps, order_progress.step_name));*/
	}

	handleStepNavigation(prev, current){
		console.log("handleStepNavigation ", current);
	}

	handleOnStepComplete(data){
		this.setState(prevState=>({step: prevState.step+1, step_name: Object.keys(prevState.steps)[prevState.step+1]}));
	}

	handleOnStepCancel(){
		const { auth, orderpage_state, setLandingPageOrderPageState } = this.props;
		if (this.state.step_name === "start") {
			setLandingPageOrderPageState({order_progress : { step_name: "request_proposal" }});
			this.setState(prevState=>({step: 1, step_name: "request_proposal", steps: { start: "Start", request_proposal: "Request Proposal"}}));
		}
		else if(this.state.step_name === "request_proposal"){
			let steps = {
				start: "Start",
				select_items: "Select Items",
				signin_signup: "Signin/Signup",
				confirm: "Confirm Order",
				checkout: "Checkout",
				thankyou: "Complete",
			};
			if (auth.isAuthenticated) {
				steps = {
					start: "Start",
					select_items: "Select Items",
					confirm: "Confirm Order",
					checkout: "Checkout",
					thankyou: "Complete",
				};
			}
			setLandingPageOrderPageState({order_progress : {step_name: Object.keys(steps)[this.state.step-1]}});
			this.setState(prevState=>({steps: steps, step: prevState.step-1, step_name: Object.keys(prevState.steps)[prevState.step-1]}));
		}
		else{
			setLandingPageOrderPageState({ order_progress : { step_name: Object.keys(this.state.steps)[this.state.step-1] }});
			this.setState(prevState=>({step: prevState.step-1, step_name: Object.keys(prevState.steps)[prevState.step-1]}));
		}
	}

	render() {
		return (
			<GridContainer className="p-0 m-0  bg-gray-100">
				<GridItem xs={12} md={3} className="inverse">
					<GridContainer className="absolute center">
						<GridItem>
							<Hidden smDown>							
								<Stepper color="grey" activeColor="primary" type="default" step={this.state.step} steps={this.state.steps}  onStep={this.handleStepNavigation}/>
							</Hidden>

							<Hidden mdUp>							
								<Stepper color="grey" activeColor="primary" type="mobile" step={this.state.step} steps={this.state.steps} onStep={this.handleStepNavigation} />
							</Hidden>
						</GridItem>
					</GridContainer>	
				</GridItem>
				<GridItem xs={12} md={9} className="md:p-4 md:pt-8 relative">
						<GridContainer className="px-8">
							<GridItem xs={12} md={8}>
								<Typography variant="h2" className="default_text text-left"> {this.state.steps[this.state.step_name]} </Typography>	
							</GridItem>

							<GridItem xs={12} md={4}>
								<Typography variant="h6" className="grey_text text-right font-bold uppercase">Step {this.state.step+1} / {Object.size(this.state.steps)} </Typography>	
							</GridItem>						
						</GridContainer>


						<GridContainer className="px-8">
							{ this.state.step_name === "start" && <StartScreen onComplete={this.handleOnStepComplete}  onCancel={this.handleOnStepCancel}/> }
							{ this.state.step_name === "select_items" && <SelectItems onComplete={this.handleOnStepComplete} onCancel={this.handleOnStepCancel} /> }
							{ this.state.step_name === "request_proposal" && <RequestProposal onComplete={this.handleOnStepComplete} onCancel={this.handleOnStepCancel} /> }
							{ this.state.step_name === "signin_signup" && <LoginRegisterScreen onComplete={this.handleOnStepComplete} onCancel={this.handleOnStepCancel}/> }
							{ this.state.step_name === "account" && <AccountScreen onComplete={this.handleOnStepComplete} onCancel={this.handleOnStepCancel} /> }
							{ this.state.step_name === "confirm" && <ConfirmOrder onComplete={this.handleOnStepComplete} onCancel={this.handleOnStepCancel}/> }
							{ this.state.step_name === "checkout" && <Checkout onComplete={this.handleOnStepComplete} onCancel={this.handleOnStepCancel} /> }
							{ this.state.step_name === "thankyou" && <Checkout onComplete={this.handleOnStepComplete} onCancel={this.handleOnStepCancel} /> }
						</GridContainer>
				</GridItem>
			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	orderpage_state: state.landingpage.orderpage_state,
});

export default withRoot(connect(mapStateToProps, { setLandingPageOrderPageState, closeDialog, openDialog })(Page));
