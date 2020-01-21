import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Check from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBack';
import withRoot from 'utils/withRoot';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";
import ScrollBars from "components/ScrollBars";
import { setOrderProgress, addToCart, removeFromCart, closeDialog, openDialog } from "state/actions";
import GridView from "./GridView";
import ItemView from "views/widgets/Ecommerce/Item";


class Widget extends React.Component {
	state = {
		view: "gridview",
		prev_view: "gridview",
		items: [],
		context: null,
		params: {}
	};

	constructor(props) {
		super(props);
		const {context, view} = props;
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

	componentDidMount(){
		
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { context, view } = this.props;
		if (!Object.areEqual(this.state.context, context) || !Object.areEqual(this.state.view, view)) {
			this.setState({view: view, context: context});
		}
	}

	handleOnItemSelect = (item, event)=> {
		const { onContextChange } = this.props;
		this.setState(prevState => ({ view : "itemview", context : item, prev_view: prevState.view }));		
	}

	handleOnItemAdd = selection => {
		const { addToCart } = this.props;
		if (Function.isFunction(addToCart)) {
			addToCart(selection);
		}
		this.setState(prevState => ({ view : prevState.prev_view, prev_view: prevState.view, context:{} }));
	}

	handleOnBackClick = event => {
		this.setState(prevState => ({ view : prevState.prev_view, prev_view: prevState.view}));

	}

	render() {
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer className="p-0 m-0">
					{!["gridview"].includes(this.state.view) && <GridItem xs={6} className="float-left">
						<IconButton aria-label="back" onClick={this.handleOnBackClick}>
							<BackIcon fontSize="inherit" />
						</IconButton>
					</GridItem>}
				</GridContainer>
				<GridContainer className="p-0 m-0">
					{ this.state.view === "gridview" && <GridView onItemSelect={this.handleOnItemSelect} params={this.state.params }/> }
					{ this.state.view === "itemview" && <ItemView onItemAdd={this.handleOnItemAdd} item={this.state.context }/> }
				</GridContainer>

			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	order_progress: state.ecommerce.order_progress,
});

export default withRoot(connect(mapStateToProps, { addToCart, removeFromCart, closeDialog, openDialog })(Widget));
