/** @format */

import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
//
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import PropTypes from "prop-types";
import React from "react";
import { UtilitiesHelper } from "hoc/Helpers";
import withRoot from "hoc/withRoot";

import DefinationView from "./components/DefinationView";
import GenerationView from "./components/GenerationView";
import styles from "./styles";

class DynamicInput extends React.Component {
	state = {
		contextDialogOpen: false,
		addContextMenuAnchor: null,
		context: {},
		active: false,
	};

	constructor(props) {
		super(props);
		const {
			mode,
			blueprint,
			value,
			onChange,
			label,
			name,
			readOnly,
			required,
			disabled,
			icon,
			helperText,
			enableGrouping,
			appendProps,
		} = props;
		this.state = {
			...this.state,
			mode: mode,
			blueprint: blueprint,
			value: value,
			onChange: onChange,
			label: label,
			name: name,
			readOnly: readOnly,
			required: required,
			disabled: disabled,
			icon: icon,
			helperText: helperText,
			enableGrouping: enableGrouping,
			appendProps: appendProps,
		};
	}

	componentDidMount() {}

	getSnapshotBeforeUpdate(prevProps) {
		return { refreshRequired: !Object.areEqual(prevProps, this.props) };
	}

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		if (!Object.areEqual(prevProps, this.props)) {
			this.state = JSON.updateJSON(this.state, this.props);
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		/*const { mode, blueprint, value, onChange, label, name, readOnly, required, disabled, icon, helperText, enableGrouping, appendProps } = this.props;
		if ( snapshot.refreshRequired ) {
			this.setState( prevState => ( {
				mode: mode,
				blueprint: blueprint,
				value: value,
				onChange: onChange,
				label: label,
				name: name,
				readOnly: readOnly,
				required: required,
				disabled: disabled,
				icon: icon,
				helperText: helperText,
				enableGrouping: enableGrouping,
				appendProps: appendProps,
			}));
		}*/
	}

	render() {
		const { classes, className, variant } = this.props;

		const {
			mode,
			label,
			readOnly,
			required,
			disabled,
			active,
		} = this.state;
		return (
			<Card
				elevation={0}
				className={
					"p-0 m-0 bg-transparent" +
					(variant === "outlined" && mode === "defination"
						? active
							? "border-2 primary outlined"
							: " border border-gray-400 hover:border-black"
						: "")
				}
			>
				{String.isString(label) && (
					<CardHeader
						title={
							label && (
								<Typography
									color={
										disabled || readOnly
											? "grey"
											: active
											? "primary"
											: "grey"
									}
								>
									{label} {required && <span> * </span>}
								</Typography>
							)
						}
					/>
				)}

				<CardContent className="p-0 m-0">
					{mode === "defination" && (
						<DefinationView className={className} {...this.state} />
					)}
					{mode === "generation" && (
						<GenerationView className={className} {...this.props} />
					)}
				</CardContent>
			</Card>
		);
	}
}

DynamicInput.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	blueprint: PropTypes.object,
	value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	onChange: PropTypes.func,
	label: PropTypes.any,
	name: PropTypes.string,
	readOnly: PropTypes.bool,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	helperText: PropTypes.string,
	variant: PropTypes.string,
	error: PropTypes.string,
	icon: PropTypes.node,
	enableGrouping: PropTypes.bool,
	mode: PropTypes.oneOf(["defination", "generation"]),
	appendProps: PropTypes.object,
};

DynamicInput.defaultProps = {
	blueprint: {},
	value: {},
	label: "",
	name: "",
	readOnly: false,
	disabled: false,
	required: true,
	variant: "outlined",
	enableGrouping: true,
	mode: "defination",
};

export default withRoot(withStyles(styles)(DynamicInput));
