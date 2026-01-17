/** @format */

import IconButton from "@mui/material/IconButton";
import BackIcon from "@mui/icons-material/ArrowBack";
import Check from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
;
import React from "react";

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

	componentDidMount() { }

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
			<Grid container className="p-0 m-0">
				<Grid container className="p-0 m-0">
					{!["gridview"].includes(this.state.view) && (
						<Grid item  xs={6} className="float-left">
							<IconButton
								aria-label="back"
								onClick={this.handleOnBackClick}
							>
								<BackIcon fontSize="inherit" />
							</IconButton>
						</Grid>
					)}
				</Grid>
				<Grid container className="p-0 m-0">
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
				</Grid>
				<Grid container className="p-4">
					{this.state.items.length > 0 && (
						<Grid item  xs={12} md={6} className="flex justify-start">
							<Button onClick={onComplete} color="primary" round>
								<Check /> Proceed{" "}
							</Button>
						</Grid>
					)}
					<Grid item
						xs={12}
						md={this.state.items.length > 0 ? 6 : 12}
						className="flex justify-end"
					>
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
