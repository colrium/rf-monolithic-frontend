/** @format */

import IconButton from "@material-ui/core/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";
import Check from "@material-ui/icons/Check";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import withRoot from "hoc/withRoot";
import GridView from "./GridView";
import ItemView from "./ItemView";

class Step extends React.Component {
	state = {
		view: "gridview",
		prev_view: "gridview",
		items: [],
		context: null,
		params: {},
	};

	constructor(props) {
		super(props);
		const { context, view } = props;
		if (context) {
			this.state.context = context;
		}
		if (view) {
			this.state.view = view;
		}
		this.handleOnItemSelect = this.handleOnItemSelect.bind(this);
		this.handleOnItemAdd = this.handleOnItemAdd.bind(this);
		this.handleOnBackClick = this.handleOnBackClick.bind(this);
	}

	componentDidMount() {}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { context, view } = this.props;
		if (
			!Object.areEqual(this.state.context, context) ||
			!Object.areEqual(this.state.view, view)
		) {
			this.setState({ view: view, context: context });
		}
	}

	handleOnItemSelect = (item, event) => {
        const { onContextChange } = this.props;
        this.setState(prevState => ({
			view: "itemview",
			context: item,
			prev_view: prevState.view,
		}));
        if (Function.isFunction(onContextChange)) {
			onContextChange(item, "itemview");
		}
    };

	handleOnItemAdd = selection => {
		const { onAddToCart, onContextChange } = this.props;
		if (Function.isFunction(onAddToCart)) {
			onAddToCart(selection);
		}
		if (Function.isFunction(onContextChange)) {
			onContextChange(null, this.state.prev_view);
		}
		this.setState(prevState => ({
			view: prevState.prev_view,
			prev_view: prevState.view,
			context: {},
		}));
	};

	handleOnBackClick = event => {
		const { onContextChange } = this.props;
		if (Function.isFunction(onContextChange)) {
			onContextChange(null, this.state.prev_view);
		}
		this.setState(prevState => ({
			view: prevState.prev_view,
			prev_view: prevState.view,
		}));
	};

	handleOnComplete() {
		const { onComplete } = this.props;
		if (Function.isFunction(onComplete)) {
			let completionData = this.state.items;
			onComplete(completionData);
		}
	}

	render() {
		const { onComplete, onCancel } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer className="p-0 m-0">
					{!["gridview"].includes(this.state.view) && (
						<GridItem xs={6} className="float-left">
							<IconButton
								aria-label="back"
								onClick={this.handleOnBackClick}
							>
								<BackIcon fontSize="inherit" />
							</IconButton>
						</GridItem>
					)}
				</GridContainer>
				<GridContainer className="p-0 m-0">
					{this.state.view === "gridview" && (
						<GridView
							onItemSelect={this.handleOnItemSelect}
							params={this.state.params}
						/>
					)}
					{this.state.view === "itemview" && (
						<ItemView
							onItemAdd={this.handleOnItemAdd}
							item={this.state.context}
						/>
					)}
				</GridContainer>
				<GridContainer className="p-4">
					{this.state.items.length > 0 && (
						<GridItem xs={12} md={6} className="flex justify-start">
							<Button onClick={onComplete} color="primary" round>
								<Check /> Proceed{" "}
							</Button>
						</GridItem>
					)}
					<GridItem
						xs={12}
						md={this.state.items.length > 0 ? 6 : 12}
						className="flex justify-end"
					>
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

export default withRoot(Step);
