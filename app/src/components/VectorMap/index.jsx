/** @format */


import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
//
import { colors } from "assets/jss/app-theme";
import Color from "color";
// Externals
import PropTypes from "prop-types";
import React, { Component } from "react";

// Component styles



class VectorMap extends Component {
	state = {
		selectedLayers: null,
		initialSelectedLayers: null,
		highlightedLayers: null,
		initialHighlightedLayers: null,
		disabledLayers: null,
	};

	constructor(props) {
		super(props);
		const {
			layers,
			selectedLayers,
			highlightedLayers,
			disabledLayers,
		} = this.props;

		let selectedLayersNodes = [];
		let highlightedLayersNodes = [];
		let disabledLayersNodes = [];

		for (var i = 0; i < layers.length; i++) {
			if (Array.isArray(selectedLayers)) {
				if (
					selectedLayers.includes(layers[i].id) ||
					selectedLayers.includes(layers[i].name)
				) {
					selectedLayersNodes.push(layers[i]);
				}
			}
			if (Array.isArray(highlightedLayers)) {
				if (
					highlightedLayers.includes(layers[i].id) ||
					highlightedLayers.includes(layers[i].name)
				) {
					highlightedLayersNodes.push(layers[i]);
				}
			}
			if (Array.isArray(disabledLayers)) {
				if (
					disabledLayers.includes(layers[i].id) ||
					disabledLayers.includes(layers[i].name)
				) {
					disabledLayersNodes.push(layers[i]);
				}
			}
		}

		this.state.selectedLayers = selectedLayersNodes;
		this.state.initialSelectedLayers = selectedLayersNodes;
		this.state.highlightedLayers = highlightedLayersNodes;
		this.state.initialHighlightedLayers = highlightedLayersNodes;
		this.state.disabledLayers = disabledLayersNodes;

		this.handleSelect = this.handleSelect.bind(this);
		this.handleUnselect = this.handleUnselect.bind(this);
		this.handleHighlight = this.handleHighlight.bind(this);
		this.handleUnhighlight = this.handleUnhighlight.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		const { onLayerSelectionChange } = this.props;
		let callOnLayerSelectChange = false;
		if (onLayerSelectionChange) {
			if (
				Array.isArray(prevState.selectedLayers) &&
				Array.isArray(this.state.selectedLayers)
			) {
				callOnLayerSelectChange = !prevState.selectedLayers.equals(
					this.state.selectedLayers
				);
			}
			if (callOnLayerSelectChange) {
				onLayerSelectionChange(this.state.selectedLayers);
			}
		}
	}

	handleSelect = layer => event => {
		const { multiselect } = this.props;
		if (multiselect) {
			this.setState(state => ({
				selectedLayers: Array.isArray(state.selectedLayers)
					? state.selectedLayers.concat([layer])
					: [layer.id],
			}));
		} else {
			this.setState(state => ({ selectedLayers: [layer] }));
		}
	};

	handleUnselect = layer => event => {
		const { multiselect } = this.props;
		if (multiselect) {
			this.setState(state => ({
				selectedLayers: Array.isArray(state.selectedLayers)
					? state.selectedLayers.removeItem(layer)
					: state.selectedLayers,
			}));
		} else {
			this.setState(state => ({ selectedLayers: [] }));
		}
	};

	handleHighlight = layer => event => {
		this.setState(state => ({
			highlightedLayers: state.initialHighlightedLayers.concat([layer]),
		}));
	};

	handleUnhighlight = event => {
		this.setState(state => ({
			highlightedLayers: state.initialHighlightedLayers,
		}));
	};

	renderLayer(layer) {
		const {
			tabIndex,
			colors,
			color,
			highlightColor,
			selectedColor,
			disabledColor,
			borderStrokeWidth,
			borderStrokeColor,
			multiselect,
			showLabels,
			enableSelect,
			labels,
		} = this.props;

		let layer_styles = {
			fill: color,
			stroke: borderStrokeColor,
			strokeWidth: borderStrokeWidth + "px",
		};
		let disabled =
			(Array.isArray(this.state.disabledLayers) &&
				this.state.disabledLayers.includes(layer)) ||
			(this.state.disabledLayers && this.state.disabledLayers === layer);
		let selected =
			(enableSelect &&
				Array.isArray(this.state.selectedLayers) &&
				this.state.selectedLayers.includes(layer)) ||
			(this.state.selectedLayers && this.state.selectedLayers === layer);
		let highlighted =
			(Array.isArray(this.state.highlightedLayers) &&
				this.state.highlightedLayers.includes(layer)) ||
			(this.state.highlightedLayers &&
				this.state.highlightedLayers === layer);

		if (disabled) {
			layer_styles.fill = disabledColor;
			layer_styles.stroke = disabledColor;
		}
		if (highlighted) {
			layer_styles.fill = highlightColor;
			layer_styles.stroke = highlightColor;
		}
		if (selected) {
			layer_styles.fill = selectedColor;
			if (multiselect) {
				layer_styles.stroke = selectedColor;
			}
		}

		if (colors && !selected && !highlighted) {
			let color_keys = Object.keys(colors);
			if (Array.isArray(color_keys)) {
				if (color_keys.includes(layer.id)) {
					layer_styles.fill = colors[layer.id];
				} else if (color_keys.includes(layer.name)) {
					layer_styles.fill = colors[layer.name];
				}
			}
		}

		if (showLabels) {
			let label = layer.name;
			if (labels) {
				let label_keys = Object.keys(labels);
				if (Array.isArray(label_keys)) {
					if (label_keys.includes(layer.id)) {
						label = (
							<Box>
								<Typography color="inherit">
									{layer.name}
								</Typography>
								{labels[layer.id]}
							</Box>
						);
					} else if (label_keys.includes(layer.name)) {
						label = (
							<Box>
								<Typography color="inherit">
									{layer.name}
								</Typography>
								{labels[layer.name]}
							</Box>
						);
					}
				}
			}
			return (
				<Tooltip
					title={label}
					placement="top"
					color={layer_styles.fill}
					key={layer.id}
				>
					<path
						id={layer.id}
						tabIndex={tabIndex}
						aria-label={layer.name}
						aria-selected={selected}
						aria-current={highlighted}
						onClick={
							enableSelect && !disabled && !selected
								? this.handleSelect(layer)
								: !disabled
									? this.handleUnselect(layer)
									: event => event.preventDefault
						}
						onMouseEnter={
							enableSelect && !disabled && !highlighted
								? this.handleHighlight(layer)
								: event => event.preventDefault
						}
						onMouseLeave={
							enableSelect && !disabled && highlighted
								? this.handleUnhighlight
								: event => event.preventDefault
						}
						style={{
							...layer_styles,
							cursor: disabled ? "none" : "pointer",
							"& :hover": {
								fill: disabled ? disabledColor : highlightColor,
							},
						}}
						{...layer}
					/>
				</Tooltip>
			);
		} else {
			return (
				<path
					key={layer.id}
					tabIndex={tabIndex}
					aria-label={layer.name}
					aria-selected={selected}
					aria-current={highlighted}
					onClick={
						!disabled && !selected
							? this.handleSelect(layer)
							: !disabled
								? this.handleUnselect(layer)
								: event => event.preventDefault
					}
					onMouseEnter={
						!disabled && !highlighted
							? this.handleHighlight(layer)
							: event => event.preventDefault
					}
					onMouseLeave={
						!disabled && highlighted
							? this.handleUnhighlight
							: event => event.preventDefault
					}
					style={{
						...layer_styles,
						cursor: disabled ? "none" : "pointer",
						"& :hover": {
							fill: disabled ? disabledColor : highlightColor,
						},
					}}
					{...layer}
				/>
			);
		}
	}

	render() {
		const {
			classes,
			id,
			name,
			viewBox,
			layers,
			tabIndex,
			selectedLayers,
			highlightedLayers,
		} = this.props;
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={viewBox}
				width="100%"
				height="100%"
				id={id}
				name={name}
				key={id}
			>
				{layers.map(layer => this.renderLayer(layer))}
			</svg>
		);
	}
}

VectorMap.propTypes = {

	id: PropTypes.string.isRequired,
	name: PropTypes.string,
	viewBox: PropTypes.string.isRequired,
	layers: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string,
			d: PropTypes.string.isRequired,
		})
	).isRequired,
	tabIndex: PropTypes.string,
	selectedLayers: PropTypes.arrayOf(PropTypes.string),
	highlightedLayers: PropTypes.arrayOf(PropTypes.string),
	disabledLayers: PropTypes.arrayOf(PropTypes.string),
	colors: PropTypes.object,
	color: PropTypes.string,
	highlightColor: PropTypes.string,
	selectedColor: PropTypes.string,
	disabledColor: PropTypes.string,
	borderStrokeWidth: PropTypes.number,
	borderStrokeColor: PropTypes.string,
	multiselect: PropTypes.bool,
	showLabels: PropTypes.bool,
	labels: PropTypes.object,
	enableSelect: PropTypes.bool,
	onLayerSelectionChange: PropTypes.func,
	onLayerHighlightChange: PropTypes.func,
};

VectorMap.defaultProps = {
	name: null,
	tabIndex: "0",
	selectedLayers: [],
	highlightedLayers: [],
	disabledLayers: [],
	color: colors.hex.grey,
	highlightColor: Color(colors.hex.grey)
		.darken(0.3)
		.hex(),
	selectedColor: colors.hex.primarydark,
	borderStrokeWidth: 0.5,
	borderStrokeColor: colors.hex.inverse,
	multiselect: false,
	showLabels: true,
	enableSelect: true,
};
export default (VectorMap);
