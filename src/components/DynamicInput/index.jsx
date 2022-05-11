
import Card from "components/Card";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";
import React from "react";


import DefinationView from "./components/DefinationView";
import GenerationView from "./components/GenerationView";


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

	componentDidMount() { }

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
		const { className, variant } = this.props;

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

export default (DynamicInput);
