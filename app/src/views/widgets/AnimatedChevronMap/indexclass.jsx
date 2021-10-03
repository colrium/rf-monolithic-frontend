/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { withErrorHandler } from "hoc/ErrorHandler";

const styles = theme => ({
	mapWrapper: {
		position: "relative",
		height: "100%",
		width: "100%",
	},
	point: {
		"& polygon": {
			opacity: "0.9",
		},
		"&.active": {
			"& polygon": {
				/* transformOrigin: "center center", */
				animation: "pointBlinkAnim 0.1s",
				animationDelay: "0.15s",
				animationIterationCount: "4",
				opacity: "1",
				"&:nth-child(1)": {
					fill: colors.hex.primary,
					opacity: "1",
				},
				"&:nth-child(2)": {
					fill: colors.hex.secondary,
					opacity: "1",
				},
			},
		},
		"&.ripple": {
			"& polygon": {
				animation: "pointRippleAnim 0.2s",
				animationIterationCount: "6",
				animationTimingFunction: "ease-out",
				"&:nth-child(1)": {
					fill: colors.hex.primary,
					opacity: "0.1",
				},
				"&:nth-child(2)": {
					fill: colors.hex.secondary,
					opacity: "0.1",
				},
			},
		},
	},
	mapPopup: {
		color: theme.palette.background.paper,
		position: "absolute",		
		zIndex: "3",
		fontWeight: "500",
		transform: "scale(0)",
		opacity: "0",
		padding: "5px",
		fontSize: 20,
		textAlign: "center",
		textTransform: [["uppercase"], "!important"],
		verticalAlign: "middle",
		borderRadius: "5px",
		transformOrigin: "top left",
		lineHeight: "1",
		animation: "popupAppearAnim 0.5s",
		"&.active": {
			transform: "scale(1) translateX(-50%)",
			WebkitTransform: "scale(1) translateX(-50%)",
			MsTransform: "scale(1) translateX(-50%)",		
			opacity: "1",
			fontSize: "0.9rem",
			fontWeight: 500,
			textAlign: "center",
			textTransform: [["uppercase"], "!important"],
			verticalAlign: "middle",
			
			background: theme.palette.secondary.main,
			boxShadow:
				"0 14px 26px -12px rgba(253, 176, 6, 0.42), 0 4px 23px 0px rgba(" +
				colors.rgb.default +
				", 0.12), 0 8px 10px -5px rgba(251, 0, 6, 0.2)",
		},
	},
	"@media screen and (min-width: 772px)": {
		mapPopup: {			
			borderRadius: "4px",
			padding: "8px",
		},
	},
	"@keyframes popupAppearAnim": {
		from: {
			opacity: "0",
			transform: "scale(0)",
		},
		to: {
			opacity: "1",
			transform: "scale(1)  translateX(-50%)",
			WebkitTransform: "scale(1) translateX(-50%)",
			MsTransform: "scale(1) translateX(-50%)",
		},
	},
	"@keyframes popupDisappearAnim": {
		from: {
			opacity: "1",
			transform: "scale(1)",
			WebkitTransform: "scale(1)",
			MsTransform: "scale(1)",
		},
		to: {
			opacity: "0",
			transform: "scale(0)",
			WebkitTransform: "scale(0)",
			MsTransform: "scale(0)0",
		},
	},
	"@keyframes pointBlinkAnim": {
		from: {
			opacity: "0.5",
		},
		to: {
			opacity: "1",
		},
	},
	"@keyframes pointRippleAnim": {
		from: {
			opacity: "0.1",
		},
		to: {
			opacity: "0.4",
		},
	},
});



const animations = [
	
	{
		polygonIndex: 315,
		message: "Accurate",
		color: "red",
		width: 120,
	},
	{
		polygonIndex: 308,
		message: "Auditable",
		color: "red",
		width: 120,
	},
	{
		polygonIndex: 231,
		message: "Remote",
		color: "red",
		width: 100,
	},
	{
		polygonIndex: 205,
		message: "Unique",
		color: "red",
		width: 100,
	},
	{
		polygonIndex: 26,
		message: "Timely",
		color: "red",
		width: 100,
	},
	{
		polygonIndex: 41,
		message: "Reliable",
		color: "red",
		width: 100,
	},
	{
		polygonIndex: 116,
		message: "Responsible",
		color: "red",
		width: 120,
	},
	{
		polygonIndex: 10,
		message: "Ethical",
		color: "red",
		width: 100,
	},		
];

class AnimatedChevronMap extends React.Component {
	state = {
		activePoint: 0,
		nearbyPoints: [],
		startTime: 0,
		popup: {
			position: {
				left: 0,
				top: 0,
			},
			width: animations[0].width,
			color: animations[0].color,
			message: animations[0].message,
		},
	};

	nextAnimTimeOut = null;
	activatePopupTimeOut = null;
	activatePointRippleTimeOut = null;

	constructor(props) {
		super(props);
		this.animateMap = this.animateMap.bind(this);
	}

	componentDidMount() {
		// eslint-disable-next-line
		const { classes, mapcolor } = this.props;
		const mapContainer = document.querySelector("." + classes.mapWrapper);
		const mapPopup = document.querySelector("." + classes.mapPopup);
		const points = Array.from(
			mapContainer.querySelectorAll("." + [classes.point])
		);
		var that = this;
		this.setState(
			{
				mapContainer: mapContainer,
				mapPopup: mapPopup,
				points: points,
				pointsClass: [classes.point],
			},
			function() {
				that.animateMap();
			}
		);
	}

	componentWillUnmount() {
		clearTimeout(this.activatePointRippleTimeOut);
		clearTimeout(this.activatePopupTimeOut);
		clearTimeout(this.nextAnimTimeOut);
	}

	identifyClosestPolygons(boundingRect) {
		var points = this.state.points;
		return points.filter(function(item, index) {
			var itemRect = item.getBoundingClientRect();
			var thresholdX = boundingRect.width;
			var thresholdY = boundingRect.height * 1.5;
			var topDiff = Math.max(
				-1 * (boundingRect.top - itemRect.top),
				boundingRect.top - itemRect.top
			);
			var leftDiff = Math.max(
				-1 * (boundingRect.left - itemRect.left),
				boundingRect.left - itemRect.left
			);
			return (
				(topDiff !== 0 || leftDiff !== 0) &&
				topDiff <= thresholdY &&
				leftDiff <= thresholdX
			);
		});
	}

	animateMap() {
		var that = this;
	



		var activePointSelector =
			"." +
			this.state.pointsClass +
			":nth-child(" +
			(animations[this.state.activePoint].polygonIndex+1) +
			")";
		var activePoint = document.querySelector(activePointSelector);
		var nextactivePosition = this.state.activePoint + 1;
		if (activePoint != null) {
			var pointPosition = activePoint.getBoundingClientRect();
			var mapPosition = that.state.mapContainer.getBoundingClientRect();
			var mapPopupPosition = that.state.mapPopup.getBoundingClientRect();
			var relatedPoints = that.identifyClosestPolygons(pointPosition);
			var relativePosition = {
				left: (pointPosition.left - mapPosition.left)+(pointPosition.width/2),
				top: pointPosition.bottom-mapPosition.top,
			};

			
			that.setState({
				nearbyPoints: relatedPoints,
				popup: {
					position: {
						left: relativePosition.left,
						top: relativePosition.top + 5,
					},
					width: animations[that.state.activePoint].width,
					color: animations[that.state.activePoint].color,
					message: animations[that.state.activePoint].message,
				},
			});
			// eslint-disable-next-line
			relatedPoints.map(nearbyPoint => {
				nearbyPoint.classList.add("ripple");
			});

			that.activatePointRippleTimeOut = setTimeout(function() {
				// eslint-disable-next-line
				relatedPoints.map(nearbyPoint => {
					nearbyPoint.classList.remove("ripple");
				});
			}, 350);

			that.activatePopupTimeOut = setTimeout(function() {
				that.state.mapPopup.classList.add("active");
			}, 500);
		}

		that.nextAnimTimeOut = setTimeout(function() {
			that.state.mapPopup.classList.remove("active");
			if (nextactivePosition < animations.length) {
				that.setState({ activePoint: nextactivePosition });
			} else {
				that.setState({ activePoint: 0 });
			}
			that.animateMap();
		}, 7000);
	}

	render() {
		const { classes, mapcolor, popUpStyle } = this.props;

		return (
			<div className={classes.mapWrapper}>
				<div
					className={classes.mapPopup + " ease-in-out avenir text-xl font-extrabold"}
					style={{
						top: this.state.popup.position.top + "px",
						left: this.state.popup.position.left + "px",
						...popUpStyle,
					}}
				>
					{this.state.popup.message}
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 639.65 350.66"
					width="100%"
					height="100%"
				>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 0,
						})}
					>
						<polygon
							points="70.66 95.99 70.66 108.81 62.56 111.44 70.66 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="71.67 95.99 71.67 108.81 79.77 111.44 71.67 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 1,
						})}
					>
						<polygon
							points="87.24 111.44 87.24 98.62 95.34 95.99 87.24 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="86.23 111.44 86.23 98.62 78.13 95.99 86.23 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 2,
						})}
					>
						<polygon
							points="101.81 95.99 101.81 108.81 93.71 111.44 101.81 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 95.99 102.82 108.81 110.92 111.44 102.82 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 3,
						})}
					>
						<polygon
							points="118.39 111.44 118.39 98.62 126.49 95.99 118.39 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 111.44 117.38 98.62 109.28 95.99 117.38 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 4,
						})}
					>
						<polygon
							points="132.96 95.99 132.96 108.81 124.86 111.44 132.96 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 95.99 133.97 108.81 142.07 111.44 133.97 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 5,
						})}
					>
						<polygon
							points="149.54 111.44 149.54 98.62 157.64 95.99 149.54 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 111.44 148.53 98.62 140.43 95.99 148.53 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 6,
						})}
					>
						<polygon
							points="164.11 95.99 164.11 108.81 156.01 111.44 164.11 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 95.99 165.12 108.81 173.22 111.44 165.12 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 7,
						})}
					>
						<polygon
							points="180.7 111.44 180.7 98.62 188.79 95.99 180.7 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 111.44 179.68 98.62 171.59 95.99 179.68 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 8,
						})}
					>
						<polygon
							points="195.26 95.99 195.26 108.81 187.16 111.44 195.26 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 95.99 196.27 108.81 204.37 111.44 196.27 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 9,
						})}
					>
						<polygon
							points="274.15 111.44 274.15 98.62 282.25 95.99 274.15 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="273.14 111.44 273.14 98.62 265.04 95.99 273.14 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 10,
						})}
					>
						<polygon
							points="288.71 95.99 288.71 108.81 280.62 111.44 288.71 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 95.99 289.73 108.81 297.82 111.44 289.73 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 11,
						})}
					>
						<polygon
							points="319.87 95.99 319.87 108.81 311.77 111.44 319.87 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 95.99 320.88 108.81 328.98 111.44 320.88 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 12,
						})}
					>
						<polygon
							points="336.45 111.44 336.45 98.62 344.55 95.99 336.45 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 111.44 335.44 98.62 327.34 95.99 335.44 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 13,
						})}
					>
						<polygon
							points="351.02 95.99 351.02 108.81 342.92 111.44 351.02 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 95.99 352.03 108.81 360.13 111.44 352.03 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 14,
						})}
					>
						<polygon
							points="367.6 111.44 367.6 98.62 375.7 95.99 367.6 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 111.44 366.59 98.62 358.49 95.99 366.59 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 15,
						})}
					>
						<polygon
							points="382.17 95.99 382.17 108.81 374.07 111.44 382.17 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 95.99 383.18 108.81 391.28 111.44 383.18 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 16,
						})}
					>
						<polygon
							points="398.75 111.44 398.75 98.62 406.85 95.99 398.75 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 111.44 397.74 98.62 389.64 95.99 397.74 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 17,
						})}
					>
						<polygon
							points="413.32 95.99 413.32 108.81 405.22 111.44 413.32 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="414.33 95.99 414.33 108.81 422.43 111.44 414.33 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 18,
						})}
					>
						<polygon
							points="429.91 111.44 429.91 98.62 438.01 95.99 429.91 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.89 111.44 428.89 98.62 420.8 95.99 428.89 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 19,
						})}
					>
						<polygon
							points="444.47 95.99 444.47 108.81 436.37 111.44 444.47 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 95.99 445.48 108.81 453.58 111.44 445.48 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 20,
						})}
					>
						<polygon
							points="461.06 111.44 461.06 98.62 469.16 95.99 461.06 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 111.44 460.05 98.62 451.95 95.99 460.05 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 21,
						})}
					>
						<polygon
							points="475.62 95.99 475.62 108.81 467.52 111.44 475.62 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 95.99 476.63 108.81 484.73 111.44 476.63 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 22,
						})}
					>
						<polygon
							points="492.21 111.44 492.21 98.62 500.31 95.99 492.21 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 111.44 491.2 98.62 483.1 95.99 491.2 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 23,
						})}
					>
						<polygon
							points="505.69 95.99 505.69 108.81 497.59 111.44 505.69 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 95.99 506.7 108.81 514.8 111.44 506.7 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 24,
						})}
					>
						<polygon
							points="522.27 111.44 522.27 98.62 530.37 95.99 522.27 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 111.44 521.26 98.62 513.16 95.99 521.26 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 25,
						})}
					>
						<polygon
							points="536.84 95.99 536.84 108.81 528.74 111.44 536.84 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 95.99 537.85 108.81 545.95 111.44 537.85 95.99"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 26,
						})}
					>
						<polygon
							points="584.58 111.44 584.58 98.62 592.67 95.99 584.58 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="583.56 111.44 583.56 98.62 575.47 95.99 583.56 111.44"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 27,
						})}
					>
						<polygon
							points="8.35 63.7 8.35 50.88 0.25 48.25 8.35 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="9.36 63.7 9.36 50.88 17.46 48.25 9.36 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 28,
						})}
					>
						<polygon
							points="24.94 48.25 24.94 61.07 33.04 63.7 24.94 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="23.93 48.25 23.93 61.07 15.83 63.7 23.93 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 29,
						})}
					>
						<polygon
							points="39.5 63.7 39.5 50.88 31.4 48.25 39.5 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="40.52 63.7 40.52 50.88 48.61 48.25 40.52 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 30,
						})}
					>
						<polygon
							points="70.66 63.7 70.66 50.88 62.56 48.25 70.66 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="71.67 63.7 71.67 50.88 79.77 48.25 71.67 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 31,
						})}
					>
						<polygon
							points="87.24 48.25 87.24 61.07 95.34 63.7 87.24 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="86.23 48.25 86.23 61.07 78.13 63.7 86.23 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 32,
						})}
					>
						<polygon
							points="101.81 63.7 101.81 50.88 93.71 48.25 101.81 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 63.7 102.82 50.88 110.92 48.25 102.82 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 33,
						})}
					>
						<polygon
							points="118.39 48.25 118.39 61.07 126.49 63.7 118.39 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 48.25 117.38 61.07 109.28 63.7 117.38 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 34,
						})}
					>
						<polygon
							points="132.96 63.7 132.96 50.88 124.86 48.25 132.96 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 63.7 133.97 50.88 142.07 48.25 133.97 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 35,
						})}
					>
						<polygon
							points="149.54 48.25 149.54 61.07 157.64 63.7 149.54 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 48.25 148.53 61.07 140.43 63.7 148.53 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 36,
						})}
					>
						<polygon
							points="164.11 63.7 164.11 50.88 156.01 48.25 164.11 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 63.7 165.12 50.88 173.22 48.25 165.12 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 37,
						})}
					>
						<polygon
							points="211.85 48.25 211.85 61.07 219.95 63.7 211.85 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="210.84 48.25 210.84 61.07 202.74 63.7 210.84 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 38,
						})}
					>
						<polygon
							points="226.41 63.7 226.41 50.88 218.31 48.25 226.41 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.42 63.7 227.42 50.88 235.52 48.25 227.42 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 39,
						})}
					>
						<polygon
							points="243 48.25 243 61.07 251.1 63.7 243 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="241.99 48.25 241.99 61.07 233.89 63.7 241.99 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 40,
						})}
					>
						<polygon
							points="257.56 63.7 257.56 50.88 249.46 48.25 257.56 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="258.57 63.7 258.57 50.88 266.67 48.25 258.57 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 41,
						})}
					>
						<polygon
							points="351.02 63.7 351.02 50.88 342.92 48.25 351.02 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 63.7 352.03 50.88 360.13 48.25 352.03 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 42,
						})}
					>
						<polygon
							points="444.47 63.7 444.47 50.88 436.37 48.25 444.47 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 63.7 445.48 50.88 453.58 48.25 445.48 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 43,
						})}
					>
						<polygon
							points="461.06 48.25 461.06 61.07 469.16 63.7 461.06 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 48.25 460.05 61.07 451.95 63.7 460.05 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 44,
						})}
					>
						<polygon
							points="475.62 63.7 475.62 50.88 467.52 48.25 475.62 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 63.7 476.63 50.88 484.73 48.25 476.63 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 45,
						})}
					>
						<polygon
							points="492.21 48.25 492.21 61.07 500.31 63.7 492.21 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 48.25 491.2 61.07 483.1 63.7 491.2 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 46,
						})}
					>
						<polygon
							points="505.69 63.7 505.69 50.88 497.59 48.25 505.69 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 63.7 506.7 50.88 514.8 48.25 506.7 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 47,
						})}
					>
						<polygon
							points="522.27 48.25 522.27 61.07 530.37 63.7 522.27 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 48.25 521.26 61.07 513.16 63.7 521.26 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 48,
						})}
					>
						<polygon
							points="536.84 63.7 536.84 50.88 528.74 48.25 536.84 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 63.7 537.85 50.88 545.95 48.25 537.85 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 49,
						})}
					>
						<polygon
							points="553.42 48.25 553.42 61.07 561.52 63.7 553.42 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 48.25 552.41 61.07 544.31 63.7 552.41 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 50,
						})}
					>
						<polygon
							points="567.99 63.7 567.99 50.88 559.89 48.25 567.99 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="569 63.7 569 50.88 577.1 48.25 569 63.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 51,
						})}
					>
						<polygon
							points="584.58 48.25 584.58 61.07 592.67 63.7 584.58 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="583.56 48.25 583.56 61.07 575.47 63.7 583.56 48.25"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 52,
						})}
					>
						<polygon
							points="87.24 143.27 87.24 130.45 95.34 127.82 87.24 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="86.23 143.27 86.23 130.45 78.13 127.82 86.23 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 53,
						})}
					>
						<polygon
							points="101.81 127.82 101.81 140.64 93.71 143.27 101.81 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 127.82 102.82 140.64 110.92 143.27 102.82 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 54,
						})}
					>
						<polygon
							points="118.39 143.27 118.39 130.45 126.49 127.82 118.39 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 143.27 117.38 130.45 109.28 127.82 117.38 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 55,
						})}
					>
						<polygon
							points="132.96 127.82 132.96 140.64 124.86 143.27 132.96 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 127.82 133.97 140.64 142.07 143.27 133.97 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 56,
						})}
					>
						<polygon
							points="149.54 143.27 149.54 130.45 157.64 127.82 149.54 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 143.27 148.53 130.45 140.43 127.82 148.53 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 57,
						})}
					>
						<polygon
							points="164.11 127.82 164.11 140.64 156.01 143.27 164.11 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 127.82 165.12 140.64 173.22 143.27 165.12 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 58,
						})}
					>
						<polygon
							points="288.71 127.82 288.71 140.64 280.62 143.27 288.71 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 127.82 289.73 140.64 297.82 143.27 289.73 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 59,
						})}
					>
						<polygon
							points="305.3 143.27 305.3 130.45 313.4 127.82 305.3 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="304.29 143.27 304.29 130.45 296.19 127.82 304.29 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 60,
						})}
					>
						<polygon
							points="319.87 127.82 319.87 140.64 311.77 143.27 319.87 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 127.82 320.88 140.64 328.98 143.27 320.88 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 61,
						})}
					>
						<polygon
							points="336.45 143.27 336.45 130.45 344.55 127.82 336.45 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 143.27 335.44 130.45 327.34 127.82 335.44 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 62,
						})}
					>
						<polygon
							points="382.17 127.82 382.17 140.64 374.07 143.27 382.17 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 127.82 383.18 140.64 391.28 143.27 383.18 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 63,
						})}
					>
						<polygon
							points="398.75 143.27 398.75 130.45 406.85 127.82 398.75 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 143.27 397.74 130.45 389.64 127.82 397.74 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 64,
						})}
					>
						<polygon
							points="413.32 127.82 413.32 140.64 405.22 143.27 413.32 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="414.33 127.82 414.33 140.64 422.43 143.27 414.33 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 65,
						})}
					>
						<polygon
							points="429.91 143.27 429.91 130.45 438.01 127.82 429.91 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.89 143.27 428.89 130.45 420.8 127.82 428.89 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 66,
						})}
					>
						<polygon
							points="444.47 127.82 444.47 140.64 436.37 143.27 444.47 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 127.82 445.48 140.64 453.58 143.27 445.48 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 67,
						})}
					>
						<polygon
							points="461.06 143.27 461.06 130.45 469.16 127.82 461.06 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 143.27 460.05 130.45 451.95 127.82 460.05 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 68,
						})}
					>
						<polygon
							points="475.62 127.82 475.62 140.64 467.52 143.27 475.62 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 127.82 476.63 140.64 484.73 143.27 476.63 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 69,
						})}
					>
						<polygon
							points="492.21 143.27 492.21 130.45 500.31 127.82 492.21 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 143.27 491.2 130.45 483.1 127.82 491.2 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 70,
						})}
					>
						<polygon
							points="505.69 127.82 505.69 140.64 497.59 143.27 505.69 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 127.82 506.7 140.64 514.8 143.27 506.7 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 71,
						})}
					>
						<polygon
							points="522.27 143.27 522.27 130.45 530.37 127.82 522.27 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 143.27 521.26 130.45 513.16 127.82 521.26 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 72,
						})}
					>
						<polygon
							points="536.84 127.82 536.84 140.64 528.74 143.27 536.84 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 127.82 537.85 140.64 545.95 143.27 537.85 127.82"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 73,
						})}
					>
						<polygon
							points="553.42 143.27 553.42 130.45 561.52 127.82 553.42 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 143.27 552.41 130.45 544.31 127.82 552.41 143.27"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 74,
						})}
					>
						<polygon
							points="87.24 143.73 87.24 156.56 95.34 159.19 87.24 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="86.23 143.73 86.23 156.56 78.13 159.19 86.23 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 75,
						})}
					>
						<polygon
							points="101.81 159.19 101.81 146.36 93.71 143.73 101.81 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 159.19 102.82 146.36 110.92 143.73 102.82 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 76,
						})}
					>
						<polygon
							points="118.39 143.73 118.39 156.56 126.49 159.19 118.39 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 143.73 117.38 156.56 109.28 159.19 117.38 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 77,
						})}
					>
						<polygon
							points="132.96 159.19 132.96 146.36 124.86 143.73 132.96 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 159.19 133.97 146.36 142.07 143.73 133.97 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 78,
						})}
					>
						<polygon
							points="149.54 143.73 149.54 156.56 157.64 159.19 149.54 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 143.73 148.53 156.56 140.43 159.19 148.53 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 79,
						})}
					>
						<polygon
							points="288.71 159.19 288.71 146.36 280.62 143.73 288.71 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 159.19 289.73 146.36 297.82 143.73 289.73 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 80,
						})}
					>
						<polygon
							points="351.02 159.19 351.02 146.36 342.92 143.73 351.02 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 159.19 352.03 146.36 360.13 143.73 352.03 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 81,
						})}
					>
						<polygon
							points="367.6 143.73 367.6 156.56 375.7 159.19 367.6 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 143.73 366.59 156.56 358.49 159.19 366.59 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 82,
						})}
					>
						<polygon
							points="382.17 159.19 382.17 146.36 374.07 143.73 382.17 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 159.19 383.18 146.36 391.28 143.73 383.18 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 83,
						})}
					>
						<polygon
							points="398.75 143.73 398.75 156.56 406.85 159.19 398.75 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 143.73 397.74 156.56 389.64 159.19 397.74 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 84,
						})}
					>
						<polygon
							points="413.32 159.19 413.32 146.36 405.22 143.73 413.32 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="414.33 159.19 414.33 146.36 422.43 143.73 414.33 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 85,
						})}
					>
						<polygon
							points="429.91 143.73 429.91 156.56 438.01 159.19 429.91 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.89 143.73 428.89 156.56 420.8 159.19 428.89 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 86,
						})}
					>
						<polygon
							points="444.47 159.19 444.47 146.36 436.37 143.73 444.47 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 159.19 445.48 146.36 453.58 143.73 445.48 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 87,
						})}
					>
						<polygon
							points="461.06 143.73 461.06 156.56 469.16 159.19 461.06 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 143.73 460.05 156.56 451.95 159.19 460.05 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 88,
						})}
					>
						<polygon
							points="475.62 159.19 475.62 146.36 467.52 143.73 475.62 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 159.19 476.63 146.36 484.73 143.73 476.63 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 89,
						})}
					>
						<polygon
							points="492.21 143.73 492.21 156.56 500.31 159.19 492.21 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 143.73 491.2 156.56 483.1 159.19 491.2 143.73"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 90,
						})}
					>
						<polygon
							points="505.69 159.19 505.69 146.36 497.59 143.73 505.69 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 159.19 506.7 146.36 514.8 143.73 506.7 159.19"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 91,
						})}
					>
						<polygon
							points="163.84 0.51 163.84 13.33 155.74 15.96 163.84 0.51"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="164.85 0.51 164.85 13.33 172.95 15.96 164.85 0.51"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 92,
						})}
					>
						<polygon
							points="180.4 15.96 180.4 3.14 188.5 0.51 180.4 15.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.38 15.96 179.38 3.14 171.29 0.51 179.38 15.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 93,
						})}
					>
						<polygon
							points="226.03 0.51 226.03 13.33 217.93 15.96 226.03 0.51"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.04 0.51 227.04 13.33 235.14 15.96 227.04 0.51"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 94,
						})}
					>
						<polygon
							points="242.59 15.96 242.59 3.14 250.69 0.51 242.59 15.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="241.58 15.96 241.58 3.14 233.48 0.51 241.58 15.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 95,
						})}
					>
						<polygon
							points="257.13 0.51 257.13 13.33 249.03 15.96 257.13 0.51"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="258.14 0.51 258.14 13.33 266.24 15.96 258.14 0.51"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 96,
						})}
					>
						<polygon
							points="132.96 31.87 132.96 19.05 124.86 16.42 132.96 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 31.87 133.97 19.05 142.07 16.42 133.97 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 97,
						})}
					>
						<polygon
							points="149.54 16.42 149.54 29.24 157.64 31.87 149.54 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 16.42 148.53 29.24 140.43 31.87 148.53 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 98,
						})}
					>
						<polygon
							points="164.11 31.87 164.11 19.05 156.01 16.42 164.11 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 31.87 165.12 19.05 173.22 16.42 165.12 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 99,
						})}
					>
						<polygon
							points="180.7 16.42 180.7 29.24 188.79 31.87 180.7 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 16.42 179.68 29.24 171.59 31.87 179.68 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 100,
						})}
					>
						<polygon
							points="195.26 31.87 195.26 19.05 187.16 16.42 195.26 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 31.87 196.27 19.05 204.37 16.42 196.27 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 101,
						})}
					>
						<polygon
							points="211.85 16.42 211.85 29.24 219.95 31.87 211.85 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="210.84 16.42 210.84 29.24 202.74 31.87 210.84 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 102,
						})}
					>
						<polygon
							points="226.41 31.87 226.41 19.05 218.31 16.42 226.41 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.42 31.87 227.42 19.05 235.52 16.42 227.42 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 103,
						})}
					>
						<polygon
							points="243 16.42 243 29.24 251.1 31.87 243 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="241.99 16.42 241.99 29.24 233.89 31.87 241.99 16.42"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 104,
						})}
					>
						<polygon
							points="257.56 31.87 257.56 19.05 249.46 16.42 257.56 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="258.57 31.87 258.57 19.05 266.67 16.42 258.57 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 105,
						})}
					>
						<polygon
							points="475.62 31.87 475.62 19.05 467.52 16.42 475.62 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 31.87 476.63 19.05 484.73 16.42 476.63 31.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 106,
						})}
					>
						<polygon
							points="132.96 32.34 132.96 45.16 124.86 47.79 132.96 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 32.34 133.97 45.16 142.07 47.79 133.97 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 107,
						})}
					>
						<polygon
							points="149.54 47.79 149.54 34.97 157.64 32.34 149.54 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 47.79 148.53 34.97 140.43 32.34 148.53 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 108,
						})}
					>
						<polygon
							points="211.85 47.79 211.85 34.97 219.95 32.34 211.85 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="210.84 47.79 210.84 34.97 202.74 32.34 210.84 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 109,
						})}
					>
						<polygon
							points="226.41 32.34 226.41 45.16 218.31 47.79 226.41 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.42 32.34 227.42 45.16 235.52 47.79 227.42 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 110,
						})}
					>
						<polygon
							points="243 47.79 243 34.97 251.1 32.34 243 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="241.99 47.79 241.99 34.97 233.89 32.34 241.99 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 111,
						})}
					>
						<polygon
							points="257.56 32.34 257.56 45.16 249.46 47.79 257.56 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="258.57 32.34 258.57 45.16 266.67 47.79 258.57 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 112,
						})}
					>
						<polygon
							points="398.75 47.79 398.75 34.97 406.85 32.34 398.75 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 47.79 397.74 34.97 389.64 32.34 397.74 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 113,
						})}
					>
						<polygon
							points="461.06 47.79 461.06 34.97 469.16 32.34 461.06 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 47.79 460.05 34.97 451.95 32.34 460.05 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 114,
						})}
					>
						<polygon
							points="475.62 32.34 475.62 45.16 467.52 47.79 475.62 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 32.34 476.63 45.16 484.73 47.79 476.63 32.34"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 115,
						})}
					>
						<polygon
							points="492.21 47.79 492.21 34.97 500.31 32.34 492.21 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 47.79 491.2 34.97 483.1 32.34 491.2 47.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 116,
						})}
					>
						<polygon
							points="87.24 111.91 87.24 124.73 95.34 127.36 87.24 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="86.23 111.91 86.23 124.73 78.13 127.36 86.23 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 117,
						})}
					>
						<polygon
							points="101.81 127.36 101.81 114.54 93.71 111.91 101.81 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 127.36 102.82 114.54 110.92 111.91 102.82 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 118,
						})}
					>
						<polygon
							points="118.39 111.91 118.39 124.73 126.49 127.36 118.39 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 111.91 117.38 124.73 109.28 127.36 117.38 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 119,
						})}
					>
						<polygon
							points="132.96 127.36 132.96 114.54 124.86 111.91 132.96 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 127.36 133.97 114.54 142.07 111.91 133.97 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 120,
						})}
					>
						<polygon
							points="149.54 111.91 149.54 124.73 157.64 127.36 149.54 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 111.91 148.53 124.73 140.43 127.36 148.53 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 121,
						})}
					>
						<polygon
							points="164.11 127.36 164.11 114.54 156.01 111.91 164.11 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 127.36 165.12 114.54 173.22 111.91 165.12 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 122,
						})}
					>
						<polygon
							points="180.7 111.91 180.7 124.73 188.79 127.36 180.7 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 111.91 179.68 124.73 171.59 127.36 179.68 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 123,
						})}
					>
						<polygon
							points="195.26 127.36 195.26 114.54 187.16 111.91 195.26 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 127.36 196.27 114.54 204.37 111.91 196.27 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 124,
						})}
					>
						<polygon
							points="288.71 127.36 288.71 114.54 280.62 111.91 288.71 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 127.36 289.73 114.54 297.82 111.91 289.73 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 125,
						})}
					>
						<polygon
							points="305.3 111.91 305.3 124.73 313.4 127.36 305.3 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="304.29 111.91 304.29 124.73 296.19 127.36 304.29 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 126,
						})}
					>
						<polygon
							points="319.87 127.36 319.87 114.54 311.77 111.91 319.87 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 127.36 320.88 114.54 328.98 111.91 320.88 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 127,
						})}
					>
						<polygon
							points="336.45 111.91 336.45 124.73 344.55 127.36 336.45 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 111.91 335.44 124.73 327.34 127.36 335.44 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 128,
						})}
					>
						<polygon
							points="351.02 127.36 351.02 114.54 342.92 111.91 351.02 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 127.36 352.03 114.54 360.13 111.91 352.03 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 129,
						})}
					>
						<polygon
							points="367.6 111.91 367.6 124.73 375.7 127.36 367.6 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 111.91 366.59 124.73 358.49 127.36 366.59 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 130,
						})}
					>
						<polygon
							points="382.17 127.36 382.17 114.54 374.07 111.91 382.17 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 127.36 383.18 114.54 391.28 111.91 383.18 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 131,
						})}
					>
						<polygon
							points="398.75 111.91 398.75 124.73 406.85 127.36 398.75 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 111.91 397.74 124.73 389.64 127.36 397.74 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 132,
						})}
					>
						<polygon
							points="413.32 127.36 413.32 114.54 405.22 111.91 413.32 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="414.33 127.36 414.33 114.54 422.43 111.91 414.33 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 133,
						})}
					>
						<polygon
							points="429.91 111.91 429.91 124.73 438.01 127.36 429.91 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.89 111.91 428.89 124.73 420.8 127.36 428.89 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 134,
						})}
					>
						<polygon
							points="444.47 127.36 444.47 114.54 436.37 111.91 444.47 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 127.36 445.48 114.54 453.58 111.91 445.48 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 135,
						})}
					>
						<polygon
							points="461.06 111.91 461.06 124.73 469.16 127.36 461.06 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 111.91 460.05 124.73 451.95 127.36 460.05 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 136,
						})}
					>
						<polygon
							points="475.62 127.36 475.62 114.54 467.52 111.91 475.62 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 127.36 476.63 114.54 484.73 111.91 476.63 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 137,
						})}
					>
						<polygon
							points="492.21 111.91 492.21 124.73 500.31 127.36 492.21 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 111.91 491.2 124.73 483.1 127.36 491.2 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 138,
						})}
					>
						<polygon
							points="505.69 127.36 505.69 114.54 497.59 111.91 505.69 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 127.36 506.7 114.54 514.8 111.91 506.7 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 139,
						})}
					>
						<polygon
							points="522.27 111.91 522.27 124.73 530.37 127.36 522.27 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 111.91 521.26 124.73 513.16 127.36 521.26 111.91"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 140,
						})}
					>
						<polygon
							points="536.84 127.36 536.84 114.54 528.74 111.91 536.84 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 127.36 537.85 114.54 545.95 111.91 537.85 127.36"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 141,
						})}
					>
						<polygon
							points="8.35 64.16 8.35 76.98 0.25 79.61 8.35 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="9.36 64.16 9.36 76.98 17.46 79.61 9.36 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 142,
						})}
					>
						<polygon
							points="24.94 79.61 24.94 66.79 33.04 64.16 24.94 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="23.93 79.61 23.93 66.79 15.83 64.16 23.93 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 143,
						})}
					>
						<polygon
							points="39.5 64.16 39.5 76.98 31.4 79.61 39.5 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="40.52 64.16 40.52 76.98 48.61 79.61 40.52 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 144,
						})}
					>
						<polygon
							points="56.09 79.61 56.09 66.79 64.19 64.16 56.09 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="55.08 79.61 55.08 66.79 46.98 64.16 55.08 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 145,
						})}
					>
						<polygon
							points="70.66 64.16 70.66 76.98 62.56 79.61 70.66 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="71.67 64.16 71.67 76.98 79.77 79.61 71.67 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 146,
						})}
					>
						<polygon
							points="87.24 79.61 87.24 66.79 95.34 64.16 87.24 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="86.23 79.61 86.23 66.79 78.13 64.16 86.23 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 147,
						})}
					>
						<polygon
							points="101.81 64.16 101.81 76.98 93.71 79.61 101.81 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 64.16 102.82 76.98 110.92 79.61 102.82 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 148,
						})}
					>
						<polygon
							points="118.39 79.61 118.39 66.79 126.49 64.16 118.39 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 79.61 117.38 66.79 109.28 64.16 117.38 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 149,
						})}
					>
						<polygon
							points="132.96 64.16 132.96 76.98 124.86 79.61 132.96 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 64.16 133.97 76.98 142.07 79.61 133.97 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 150,
						})}
					>
						<polygon
							points="211.85 79.61 211.85 66.79 219.95 64.16 211.85 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="210.84 79.61 210.84 66.79 202.74 64.16 210.84 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 151,
						})}
					>
						<polygon
							points="226.41 64.16 226.41 76.98 218.31 79.61 226.41 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.42 64.16 227.42 76.98 235.52 79.61 227.42 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 152,
						})}
					>
						<polygon
							points="243 79.61 243 66.79 251.1 64.16 243 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="241.99 79.61 241.99 66.79 233.89 64.16 241.99 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 153,
						})}
					>
						<polygon
							points="274.15 79.61 274.15 66.79 282.25 64.16 274.15 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="273.14 79.61 273.14 66.79 265.04 64.16 273.14 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 154,
						})}
					>
						<polygon
							points="319.87 64.16 319.87 76.98 311.77 79.61 319.87 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 64.16 320.88 76.98 328.98 79.61 320.88 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 155,
						})}
					>
						<polygon
							points="336.45 79.61 336.45 66.79 344.55 64.16 336.45 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 79.61 335.44 66.79 327.34 64.16 335.44 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 156,
						})}
					>
						<polygon
							points="351.02 64.16 351.02 76.98 342.92 79.61 351.02 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 64.16 352.03 76.98 360.13 79.61 352.03 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 157,
						})}
					>
						<polygon
							points="367.6 79.61 367.6 66.79 375.7 64.16 367.6 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 79.61 366.59 66.79 358.49 64.16 366.59 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 158,
						})}
					>
						<polygon
							points="382.17 64.16 382.17 76.98 374.07 79.61 382.17 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 64.16 383.18 76.98 391.28 79.61 383.18 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 159,
						})}
					>
						<polygon
							points="398.75 79.61 398.75 66.79 406.85 64.16 398.75 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 79.61 397.74 66.79 389.64 64.16 397.74 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 160,
						})}
					>
						<polygon
							points="413.32 64.16 413.32 76.98 405.22 79.61 413.32 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="414.33 64.16 414.33 76.98 422.43 79.61 414.33 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 161,
						})}
					>
						<polygon
							points="429.91 79.61 429.91 66.79 438.01 64.16 429.91 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.89 79.61 428.89 66.79 420.8 64.16 428.89 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 162,
						})}
					>
						<polygon
							points="444.47 64.16 444.47 76.98 436.37 79.61 444.47 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 64.16 445.48 76.98 453.58 79.61 445.48 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 163,
						})}
					>
						<polygon
							points="461.06 79.61 461.06 66.79 469.16 64.16 461.06 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 79.61 460.05 66.79 451.95 64.16 460.05 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 164,
						})}
					>
						<polygon
							points="475.62 64.16 475.62 76.98 467.52 79.61 475.62 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 64.16 476.63 76.98 484.73 79.61 476.63 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 165,
						})}
					>
						<polygon
							points="492.21 79.61 492.21 66.79 500.31 64.16 492.21 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 79.61 491.2 66.79 483.1 64.16 491.2 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 166,
						})}
					>
						<polygon
							points="505.69 64.16 505.69 76.98 497.59 79.61 505.69 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 64.16 506.7 76.98 514.8 79.61 506.7 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 167,
						})}
					>
						<polygon
							points="522.27 79.61 522.27 66.79 530.37 64.16 522.27 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 79.61 521.26 66.79 513.16 64.16 521.26 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 168,
						})}
					>
						<polygon
							points="536.84 64.16 536.84 76.98 528.74 79.61 536.84 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 64.16 537.85 76.98 545.95 79.61 537.85 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 169,
						})}
					>
						<polygon
							points="553.42 79.61 553.42 66.79 561.52 64.16 553.42 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 79.61 552.41 66.79 544.31 64.16 552.41 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 170,
						})}
					>
						<polygon
							points="567.99 64.16 567.99 76.98 559.89 79.61 567.99 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="569 64.16 569 76.98 577.1 79.61 569 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 171,
						})}
					>
						<polygon
							points="584.58 79.61 584.58 66.79 592.67 64.16 584.58 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="583.56 79.61 583.56 66.79 575.47 64.16 583.56 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 172,
						})}
					>
						<polygon
							points="599.14 64.16 599.14 76.98 591.04 79.61 599.14 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="600.15 64.16 600.15 76.98 608.25 79.61 600.15 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 173,
						})}
					>
						<polygon
							points="615.73 79.61 615.73 66.79 623.83 64.16 615.73 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="614.72 79.61 614.72 66.79 606.62 64.16 614.72 79.61"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 174,
						})}
					>
						<polygon
							points="630.29 64.16 630.29 76.98 622.19 79.61 630.29 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="631.3 64.16 631.3 76.98 639.4 79.61 631.3 64.16"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 175,
						})}
					>
						<polygon
							points="8.35 95.53 8.35 82.71 0.25 80.08 8.35 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="9.36 95.53 9.36 82.71 17.46 80.08 9.36 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 176,
						})}
					>
						<polygon
							points="24.94 80.08 24.94 92.9 33.04 95.53 24.94 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="23.93 80.08 23.93 92.9 15.83 95.53 23.93 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 177,
						})}
					>
						<polygon
							points="39.5 95.53 39.5 82.71 31.4 80.08 39.5 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="40.52 95.53 40.52 82.71 48.61 80.08 40.52 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 178,
						})}
					>
						<polygon
							points="56.09 80.08 56.09 92.9 64.19 95.53 56.09 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="55.08 80.08 55.08 92.9 46.98 95.53 55.08 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 179,
						})}
					>
						<polygon
							points="70.66 95.53 70.66 82.71 62.56 80.08 70.66 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="71.67 95.53 71.67 82.71 79.77 80.08 71.67 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 180,
						})}
					>
						<polygon
							points="87.24 80.08 87.24 92.9 95.34 95.53 87.24 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="86.23 80.08 86.23 92.9 78.13 95.53 86.23 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 181,
						})}
					>
						<polygon
							points="101.81 95.53 101.81 82.71 93.71 80.08 101.81 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 95.53 102.82 82.71 110.92 80.08 102.82 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 182,
						})}
					>
						<polygon
							points="118.39 80.08 118.39 92.9 126.49 95.53 118.39 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 80.08 117.38 92.9 109.28 95.53 117.38 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 183,
						})}
					>
						<polygon
							points="164.11 95.53 164.11 82.71 156.01 80.08 164.11 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 95.53 165.12 82.71 173.22 80.08 165.12 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 184,
						})}
					>
						<polygon
							points="274.15 80.08 274.15 92.9 282.25 95.53 274.15 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="273.14 80.08 273.14 92.9 265.04 95.53 273.14 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 185,
						})}
					>
						<polygon
							points="288.71 95.53 288.71 82.71 280.62 80.08 288.71 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 95.53 289.73 82.71 297.82 80.08 289.73 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 186,
						})}
					>
						<polygon
							points="319.87 95.53 319.87 82.71 311.77 80.08 319.87 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 95.53 320.88 82.71 328.98 80.08 320.88 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 187,
						})}
					>
						<polygon
							points="336.45 80.08 336.45 92.9 344.55 95.53 336.45 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 80.08 335.44 92.9 327.34 95.53 335.44 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 188,
						})}
					>
						<polygon
							points="351.02 95.53 351.02 82.71 342.92 80.08 351.02 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 95.53 352.03 82.71 360.13 80.08 352.03 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 189,
						})}
					>
						<polygon
							points="367.6 80.08 367.6 92.9 375.7 95.53 367.6 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 80.08 366.59 92.9 358.49 95.53 366.59 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 190,
						})}
					>
						<polygon
							points="382.17 95.53 382.17 82.71 374.07 80.08 382.17 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 95.53 383.18 82.71 391.28 80.08 383.18 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 191,
						})}
					>
						<polygon
							points="398.75 80.08 398.75 92.9 406.85 95.53 398.75 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 80.08 397.74 92.9 389.64 95.53 397.74 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 192,
						})}
					>
						<polygon
							points="413.32 95.53 413.32 82.71 405.22 80.08 413.32 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="414.33 95.53 414.33 82.71 422.43 80.08 414.33 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 193,
						})}
					>
						<polygon
							points="429.91 80.08 429.91 92.9 438.01 95.53 429.91 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.89 80.08 428.89 92.9 420.8 95.53 428.89 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 194,
						})}
					>
						<polygon
							points="444.47 95.53 444.47 82.71 436.37 80.08 444.47 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 95.53 445.48 82.71 453.58 80.08 445.48 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 195,
						})}
					>
						<polygon
							points="461.06 80.08 461.06 92.9 469.16 95.53 461.06 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 80.08 460.05 92.9 451.95 95.53 460.05 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 196,
						})}
					>
						<polygon
							points="475.62 95.53 475.62 82.71 467.52 80.08 475.62 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 95.53 476.63 82.71 484.73 80.08 476.63 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 197,
						})}
					>
						<polygon
							points="492.21 80.08 492.21 92.9 500.31 95.53 492.21 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 80.08 491.2 92.9 483.1 95.53 491.2 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 198,
						})}
					>
						<polygon
							points="505.69 95.53 505.69 82.71 497.59 80.08 505.69 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 95.53 506.7 82.71 514.8 80.08 506.7 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 199,
						})}
					>
						<polygon
							points="522.27 80.08 522.27 92.9 530.37 95.53 522.27 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 80.08 521.26 92.9 513.16 95.53 521.26 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 200,
						})}
					>
						<polygon
							points="536.84 95.53 536.84 82.71 528.74 80.08 536.84 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 95.53 537.85 82.71 545.95 80.08 537.85 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 201,
						})}
					>
						<polygon
							points="553.42 80.08 553.42 92.9 561.52 95.53 553.42 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 80.08 552.41 92.9 544.31 95.53 552.41 80.08"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 202,
						})}
					>
						<polygon
							points="567.99 95.53 567.99 82.71 559.89 80.08 567.99 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="569 95.53 569 82.71 577.1 80.08 569 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 203,
						})}
					>
						<polygon
							points="599.14 95.53 599.14 82.71 591.04 80.08 599.14 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="600.15 95.53 600.15 82.71 608.25 80.08 600.15 95.53"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 204,
						})}
					>
						<polygon
							points="164.11 255.13 164.11 267.95 156.01 270.58 164.11 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 255.13 165.12 267.95 173.22 270.58 165.12 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 205,
						})}
					>
						<polygon
							points="180.7 270.58 180.7 257.76 188.79 255.13 180.7 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 270.58 179.68 257.76 171.59 255.13 179.68 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 206,
						})}
					>
						<polygon
							points="195.26 255.13 195.26 267.95 187.16 270.58 195.26 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 255.13 196.27 267.95 204.37 270.58 196.27 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 207,
						})}
					>
						<polygon
							points="211.85 270.58 211.85 257.76 219.95 255.13 211.85 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="210.84 270.58 210.84 257.76 202.74 255.13 210.84 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 208,
						})}
					>
						<polygon
							points="226.41 255.13 226.41 267.95 218.31 270.58 226.41 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.42 255.13 227.42 267.95 235.52 270.58 227.42 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 209,
						})}
					>
						<polygon
							points="319.87 255.13 319.87 267.95 311.77 270.58 319.87 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 255.13 320.88 267.95 328.98 270.58 320.88 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 210,
						})}
					>
						<polygon
							points="336.45 270.58 336.45 257.76 344.55 255.13 336.45 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 270.58 335.44 257.76 327.34 255.13 335.44 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 211,
						})}
					>
						<polygon
							points="351.02 255.13 351.02 267.95 342.92 270.58 351.02 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 255.13 352.03 267.95 360.13 270.58 352.03 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 212,
						})}
					>
						<polygon
							points="367.6 270.58 367.6 257.76 375.7 255.13 367.6 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 270.58 366.59 257.76 358.49 255.13 366.59 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 213,
						})}
					>
						<polygon
							points="536.84 255.13 536.84 267.95 528.74 270.58 536.84 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 255.13 537.85 267.95 545.95 270.58 537.85 255.13"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 214,
						})}
					>
						<polygon
							points="553.42 270.58 553.42 257.76 561.52 255.13 553.42 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 270.58 552.41 257.76 544.31 255.13 552.41 270.58"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 215,
						})}
					>
						<polygon
							points="149.54 207.39 149.54 220.21 157.64 222.84 149.54 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.53 207.39 148.53 220.21 140.43 222.84 148.53 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 216,
						})}
					>
						<polygon
							points="164.11 222.84 164.11 210.02 156.01 207.39 164.11 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 222.84 165.12 210.02 173.22 207.39 165.12 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 217,
						})}
					>
						<polygon
							points="180.7 207.39 180.7 220.21 188.79 222.84 180.7 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 207.39 179.68 220.21 171.59 222.84 179.68 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 218,
						})}
					>
						<polygon
							points="195.26 222.84 195.26 210.02 187.16 207.39 195.26 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 222.84 196.27 210.02 204.37 207.39 196.27 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 219,
						})}
					>
						<polygon
							points="274.15 207.39 274.15 220.21 282.25 222.84 274.15 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="273.14 207.39 273.14 220.21 265.04 222.84 273.14 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 220,
						})}
					>
						<polygon
							points="288.71 222.84 288.71 210.02 280.62 207.39 288.71 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 222.84 289.73 210.02 297.82 207.39 289.73 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 221,
						})}
					>
						<polygon
							points="305.3 207.39 305.3 220.21 313.4 222.84 305.3 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="304.29 207.39 304.29 220.21 296.19 222.84 304.29 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 222,
						})}
					>
						<polygon
							points="319.87 222.84 319.87 210.02 311.77 207.39 319.87 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 222.84 320.88 210.02 328.98 207.39 320.88 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 223,
						})}
					>
						<polygon
							points="336.45 207.39 336.45 220.21 344.55 222.84 336.45 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 207.39 335.44 220.21 327.34 222.84 335.44 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 224,
						})}
					>
						<polygon
							points="351.02 222.84 351.02 210.02 342.92 207.39 351.02 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 222.84 352.03 210.02 360.13 207.39 352.03 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 225,
						})}
					>
						<polygon
							points="367.6 207.39 367.6 220.21 375.7 222.84 367.6 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 207.39 366.59 220.21 358.49 222.84 366.59 207.39"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 226,
						})}
					>
						<polygon
							points="382.17 222.84 382.17 210.02 374.07 207.39 382.17 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 222.84 383.18 210.02 391.28 207.39 383.18 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 227,
						})}
					>
						<polygon
							points="475.62 222.84 475.62 210.02 467.52 207.39 475.62 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 222.84 476.63 210.02 484.73 207.39 476.63 222.84"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 228,
						})}
					>
						<polygon
							points="180.7 302.41 180.7 289.59 188.79 286.96 180.7 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 302.41 179.68 289.59 171.59 286.96 179.68 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 229,
						})}
					>
						<polygon
							points="195.26 286.96 195.26 299.78 187.16 302.41 195.26 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 286.96 196.27 299.78 204.37 302.41 196.27 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 230,
						})}
					>
						<polygon
							points="319.87 286.96 319.87 299.78 311.77 302.41 319.87 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 286.96 320.88 299.78 328.98 302.41 320.88 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 231,
						})}
					>
						<polygon
							points="336.45 302.41 336.45 289.59 344.55 286.96 336.45 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 302.41 335.44 289.59 327.34 286.96 335.44 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 232,
						})}
					>
						<polygon
							points="351.02 286.96 351.02 299.78 342.92 302.41 351.02 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 286.96 352.03 299.78 360.13 302.41 352.03 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 233,
						})}
					>
						<polygon
							points="505.69 286.96 505.69 299.78 497.59 302.41 505.69 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 286.96 506.7 299.78 514.8 302.41 506.7 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 234,
						})}
					>
						<polygon
							points="522.27 302.41 522.27 289.59 530.37 286.96 522.27 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 302.41 521.26 289.59 513.16 286.96 521.26 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 235,
						})}
					>
						<polygon
							points="536.84 286.96 536.84 299.78 528.74 302.41 536.84 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 286.96 537.85 299.78 545.95 302.41 537.85 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 236,
						})}
					>
						<polygon
							points="553.42 302.41 553.42 289.59 561.52 286.96 553.42 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 302.41 552.41 289.59 544.31 286.96 552.41 302.41"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 237,
						})}
					>
						<polygon
							points="567.99 286.96 567.99 299.78 559.89 302.41 567.99 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="569 286.96 569 299.78 577.1 302.41 569 286.96"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 238,
						})}
					>
						<polygon
							points="180.7 302.87 180.7 315.69 188.79 318.32 180.7 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 302.87 179.68 315.69 171.59 318.32 179.68 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 239,
						})}
					>
						<polygon
							points="195.26 318.32 195.26 305.5 187.16 302.87 195.26 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 318.32 196.27 305.5 204.37 302.87 196.27 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 240,
						})}
					>
						<polygon
							points="336.45 302.87 336.45 315.69 344.55 318.32 336.45 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 302.87 335.44 315.69 327.34 318.32 335.44 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 241,
						})}
					>
						<polygon
							points="505.69 318.32 505.69 305.5 497.59 302.87 505.69 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 318.32 506.7 305.5 514.8 302.87 506.7 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 242,
						})}
					>
						<polygon
							points="522.27 302.87 522.27 315.69 530.37 318.32 522.27 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 302.87 521.26 315.69 513.16 318.32 521.26 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 243,
						})}
					>
						<polygon
							points="536.84 318.32 536.84 305.5 528.74 302.87 536.84 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 318.32 537.85 305.5 545.95 302.87 537.85 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 244,
						})}
					>
						<polygon
							points="553.42 302.87 553.42 315.69 561.52 318.32 553.42 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 302.87 552.41 315.69 544.31 318.32 552.41 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 245,
						})}
					>
						<polygon
							points="567.99 318.32 567.99 305.5 559.89 302.87 567.99 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="569 318.32 569 305.5 577.1 302.87 569 318.32"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 246,
						})}
					>
						<polygon
							points="615.73 302.87 615.73 315.69 623.83 318.32 615.73 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="614.72 302.87 614.72 315.69 606.62 318.32 614.72 302.87"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 247,
						})}
					>
						<polygon
							points="101.64 159.65 101.64 172.47 93.54 175.1 101.64 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.65 159.65 102.65 172.47 110.75 175.1 102.65 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 248,
						})}
					>
						<polygon
							points="118.2 175.1 118.2 162.28 126.3 159.65 118.2 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.19 175.1 117.19 162.28 109.09 159.65 117.19 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 249,
						})}
					>
						<polygon
							points="132.74 159.65 132.74 172.47 124.64 175.1 132.74 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.75 159.65 133.75 172.47 141.85 175.1 133.75 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 250,
						})}
					>
						<polygon
							points="149.3 175.1 149.3 162.28 157.4 159.65 149.3 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="148.29 175.1 148.29 162.28 140.19 159.65 148.29 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 251,
						})}
					>
						<polygon
							points="273.69 175.1 273.69 162.28 281.79 159.65 273.69 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="272.68 175.1 272.68 162.28 264.58 159.65 272.68 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 252,
						})}
					>
						<polygon
							points="288.23 159.65 288.23 172.47 280.13 175.1 288.23 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.24 159.65 289.24 172.47 297.33 175.1 289.24 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 253,
						})}
					>
						<polygon
							points="304.78 175.1 304.78 162.28 312.88 159.65 304.78 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="303.77 175.1 303.77 162.28 295.67 159.65 303.77 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 254,
						})}
					>
						<polygon
							points="319.32 159.65 319.32 172.47 311.22 175.1 319.32 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.33 159.65 320.33 172.47 328.43 175.1 320.33 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 255,
						})}
					>
						<polygon
							points="335.88 175.1 335.88 162.28 343.98 159.65 335.88 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="334.87 175.1 334.87 162.28 326.77 159.65 334.87 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 256,
						})}
					>
						<polygon
							points="350.42 159.65 350.42 172.47 342.32 175.1 350.42 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="351.43 159.65 351.43 172.47 359.53 175.1 351.43 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 257,
						})}
					>
						<polygon
							points="366.98 175.1 366.98 162.28 375.08 159.65 366.98 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="365.97 175.1 365.97 162.28 357.87 159.65 365.97 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 258,
						})}
					>
						<polygon
							points="381.52 159.65 381.52 172.47 373.42 175.1 381.52 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="382.53 159.65 382.53 172.47 390.63 175.1 382.53 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 259,
						})}
					>
						<polygon
							points="398.07 175.1 398.07 162.28 406.17 159.65 398.07 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.06 175.1 397.06 162.28 388.96 159.65 397.06 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 260,
						})}
					>
						<polygon
							points="412.61 159.65 412.61 172.47 404.51 175.1 412.61 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="413.62 159.65 413.62 172.47 421.72 175.1 413.62 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 261,
						})}
					>
						<polygon
							points="429.17 175.1 429.17 162.28 437.27 159.65 429.17 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.16 175.1 428.16 162.28 420.06 159.65 428.16 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 262,
						})}
					>
						<polygon
							points="443.71 159.65 443.71 172.47 435.61 175.1 443.71 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="444.72 159.65 444.72 172.47 452.82 175.1 444.72 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 263,
						})}
					>
						<polygon
							points="460.27 175.1 460.27 162.28 468.37 159.65 460.27 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="459.26 175.1 459.26 162.28 451.16 159.65 459.26 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 264,
						})}
					>
						<polygon
							points="474.81 159.65 474.81 172.47 466.71 175.1 474.81 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="475.82 159.65 475.82 172.47 483.92 175.1 475.82 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 265,
						})}
					>
						<polygon
							points="491.37 175.1 491.37 162.28 499.46 159.65 491.37 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="490.36 175.1 490.36 162.28 482.26 159.65 490.36 175.1"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 266,
						})}
					>
						<polygon
							points="505.9 159.65 505.9 172.47 497.8 175.1 505.9 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.92 159.65 506.92 172.47 515.01 175.1 506.92 159.65"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 267,
						})}
					>
						<polygon
							points="101.81 191.01 101.81 178.19 93.71 175.56 101.81 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="102.82 191.01 102.82 178.19 110.92 175.56 102.82 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 268,
						})}
					>
						<polygon
							points="118.39 175.56 118.39 188.38 126.49 191.01 118.39 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 175.56 117.38 188.38 109.28 191.01 117.38 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 269,
						})}
					>
						<polygon
							points="274.15 175.56 274.15 188.38 282.25 191.01 274.15 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="273.14 175.56 273.14 188.38 265.04 191.01 273.14 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 270,
						})}
					>
						<polygon
							points="288.71 191.01 288.71 178.19 280.62 175.56 288.71 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 191.01 289.73 178.19 297.82 175.56 289.73 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 271,
						})}
					>
						<polygon
							points="305.3 175.56 305.3 188.38 313.4 191.01 305.3 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="304.29 175.56 304.29 188.38 296.19 191.01 304.29 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 272,
						})}
					>
						<polygon
							points="319.87 191.01 319.87 178.19 311.77 175.56 319.87 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 191.01 320.88 178.19 328.98 175.56 320.88 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 273,
						})}
					>
						<polygon
							points="336.45 175.56 336.45 188.38 344.55 191.01 336.45 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 175.56 335.44 188.38 327.34 191.01 335.44 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 274,
						})}
					>
						<polygon
							points="351.02 191.01 351.02 178.19 342.92 175.56 351.02 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 191.01 352.03 178.19 360.13 175.56 352.03 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 275,
						})}
					>
						<polygon
							points="367.6 175.56 367.6 188.38 375.7 191.01 367.6 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 175.56 366.59 188.38 358.49 191.01 366.59 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 276,
						})}
					>
						<polygon
							points="382.17 191.01 382.17 178.19 374.07 175.56 382.17 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 191.01 383.18 178.19 391.28 175.56 383.18 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 277,
						})}
					>
						<polygon
							points="398.75 175.56 398.75 188.38 406.85 191.01 398.75 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="397.74 175.56 397.74 188.38 389.64 191.01 397.74 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 278,
						})}
					>
						<polygon
							points="429.91 175.56 429.91 188.38 438.01 191.01 429.91 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="428.89 175.56 428.89 188.38 420.8 191.01 428.89 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 279,
						})}
					>
						<polygon
							points="444.47 191.01 444.47 178.19 436.37 175.56 444.47 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 191.01 445.48 178.19 453.58 175.56 445.48 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 280,
						})}
					>
						<polygon
							points="461.06 175.56 461.06 188.38 469.16 191.01 461.06 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="460.05 175.56 460.05 188.38 451.95 191.01 460.05 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 281,
						})}
					>
						<polygon
							points="475.62 191.01 475.62 178.19 467.52 175.56 475.62 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 191.01 476.63 178.19 484.73 175.56 476.63 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 282,
						})}
					>
						<polygon
							points="492.21 175.56 492.21 188.38 500.31 191.01 492.21 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 175.56 491.2 188.38 483.1 191.01 491.2 175.56"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 283,
						})}
					>
						<polygon
							points="505.69 191.01 505.69 178.19 497.59 175.56 505.69 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 191.01 506.7 178.19 514.8 175.56 506.7 191.01"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 284,
						})}
					>
						<polygon
							points="118.39 206.93 118.39 194.11 126.49 191.48 118.39 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="117.38 206.93 117.38 194.11 109.28 191.48 117.38 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 285,
						})}
					>
						<polygon
							points="132.96 191.48 132.96 204.3 124.86 206.93 132.96 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="133.97 191.48 133.97 204.3 142.07 206.93 133.97 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 286,
						})}
					>
						<polygon
							points="274.15 206.93 274.15 194.11 282.25 191.48 274.15 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="273.14 206.93 273.14 194.11 265.04 191.48 273.14 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 287,
						})}
					>
						<polygon
							points="288.71 191.48 288.71 204.3 280.62 206.93 288.71 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="289.73 191.48 289.73 204.3 297.82 206.93 289.73 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 288,
						})}
					>
						<polygon
							points="305.3 206.93 305.3 194.11 313.4 191.48 305.3 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="304.29 206.93 304.29 194.11 296.19 191.48 304.29 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 289,
						})}
					>
						<polygon
							points="319.87 191.48 319.87 204.3 311.77 206.93 319.87 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 191.48 320.88 204.3 328.98 206.93 320.88 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 290,
						})}
					>
						<polygon
							points="336.45 206.93 336.45 194.11 344.55 191.48 336.45 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 206.93 335.44 194.11 327.34 191.48 335.44 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 291,
						})}
					>
						<polygon
							points="351.02 191.48 351.02 204.3 342.92 206.93 351.02 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 191.48 352.03 204.3 360.13 206.93 352.03 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 292,
						})}
					>
						<polygon
							points="367.6 206.93 367.6 194.11 375.7 191.48 367.6 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 206.93 366.59 194.11 358.49 191.48 366.59 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 293,
						})}
					>
						<polygon
							points="382.17 191.48 382.17 204.3 374.07 206.93 382.17 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 191.48 383.18 204.3 391.28 206.93 383.18 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 294,
						})}
					>
						<polygon
							points="444.47 191.48 444.47 204.3 436.37 206.93 444.47 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="445.48 191.48 445.48 204.3 453.58 206.93 445.48 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 295,
						})}
					>
						<polygon
							points="475.62 191.48 475.62 204.3 467.52 206.93 475.62 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="476.63 191.48 476.63 204.3 484.73 206.93 476.63 191.48"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 296,
						})}
					>
						<polygon
							points="492.21 206.93 492.21 194.11 500.31 191.48 492.21 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 206.93 491.2 194.11 483.1 191.48 491.2 206.93"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 297,
						})}
					>
						<polygon
							points="180.7 271.05 180.7 283.87 188.79 286.5 180.7 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 271.05 179.68 283.87 171.59 286.5 179.68 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 298,
						})}
					>
						<polygon
							points="195.26 286.5 195.26 273.68 187.16 271.05 195.26 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 286.5 196.27 273.68 204.37 271.05 196.27 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 299,
						})}
					>
						<polygon
							points="211.85 271.05 211.85 283.87 219.95 286.5 211.85 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="210.84 271.05 210.84 283.87 202.74 286.5 210.84 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 300,
						})}
					>
						<polygon
							points="226.41 286.5 226.41 273.68 218.31 271.05 226.41 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.42 286.5 227.42 273.68 235.52 271.05 227.42 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 301,
						})}
					>
						<polygon
							points="319.87 286.5 319.87 273.68 311.77 271.05 319.87 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 286.5 320.88 273.68 328.98 271.05 320.88 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 302,
						})}
					>
						<polygon
							points="336.45 271.05 336.45 283.87 344.55 286.5 336.45 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 271.05 335.44 283.87 327.34 286.5 335.44 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 303,
						})}
					>
						<polygon
							points="351.02 286.5 351.02 273.68 342.92 271.05 351.02 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 286.5 352.03 273.68 360.13 271.05 352.03 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 304,
						})}
					>
						<polygon
							points="382.17 286.5 382.17 273.68 374.07 271.05 382.17 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="383.18 286.5 383.18 273.68 391.28 271.05 383.18 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 305,
						})}
					>
						<polygon
							points="505.69 286.5 505.69 273.68 497.59 271.05 505.69 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 286.5 506.7 273.68 514.8 271.05 506.7 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 306,
						})}
					>
						<polygon
							points="522.27 271.05 522.27 283.87 530.37 286.5 522.27 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 271.05 521.26 283.87 513.16 286.5 521.26 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 307,
						})}
					>
						<polygon
							points="536.84 286.5 536.84 273.68 528.74 271.05 536.84 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="537.85 286.5 537.85 273.68 545.95 271.05 537.85 286.5"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 308,
						})}
					>
						<polygon
							points="553.42 271.05 553.42 283.87 561.52 286.5 553.42 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 271.05 552.41 283.87 544.31 286.5 552.41 271.05"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 309,
						})}
					>
						<polygon
							points="164.11 223.3 164.11 236.13 156.01 238.75 164.11 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 223.3 165.12 236.13 173.22 238.75 165.12 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 310,
						})}
					>
						<polygon
							points="180.7 238.75 180.7 225.93 188.79 223.3 180.7 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 238.75 179.68 225.93 171.59 223.3 179.68 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 311,
						})}
					>
						<polygon
							points="195.26 223.3 195.26 236.13 187.16 238.75 195.26 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 223.3 196.27 236.13 204.37 238.75 196.27 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 312,
						})}
					>
						<polygon
							points="319.87 223.3 319.87 236.13 311.77 238.75 319.87 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 223.3 320.88 236.13 328.98 238.75 320.88 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 313,
						})}
					>
						<polygon
							points="336.45 238.75 336.45 225.93 344.55 223.3 336.45 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 238.75 335.44 225.93 327.34 223.3 335.44 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 314,
						})}
					>
						<polygon
							points="351.02 223.3 351.02 236.13 342.92 238.75 351.02 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 223.3 352.03 236.13 360.13 238.75 352.03 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 315,
						})}
					>
						<polygon
							points="367.6 238.75 367.6 225.93 375.7 223.3 367.6 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 238.75 366.59 225.93 358.49 223.3 366.59 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 316,
						})}
					>
						<polygon
							points="492.21 238.75 492.21 225.93 500.31 223.3 492.21 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="491.2 238.75 491.2 225.93 483.1 223.3 491.2 238.75"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 317,
						})}
					>
						<polygon
							points="505.69 223.3 505.69 236.13 497.59 238.75 505.69 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="506.7 223.3 506.7 236.13 514.8 238.75 506.7 223.3"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 318,
						})}
					>
						<polygon
							points="164.11 254.67 164.11 241.85 156.01 239.22 164.11 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="165.12 254.67 165.12 241.85 173.22 239.22 165.12 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 319,
						})}
					>
						<polygon
							points="180.7 239.22 180.7 252.04 188.79 254.67 180.7 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 239.22 179.68 252.04 171.59 254.67 179.68 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 320,
						})}
					>
						<polygon
							points="195.26 254.67 195.26 241.85 187.16 239.22 195.26 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="196.27 254.67 196.27 241.85 204.37 239.22 196.27 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 321,
						})}
					>
						<polygon
							points="211.85 239.22 211.85 252.04 219.95 254.67 211.85 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="210.84 239.22 210.84 252.04 202.74 254.67 210.84 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 322,
						})}
					>
						<polygon
							points="226.41 254.67 226.41 241.85 218.31 239.22 226.41 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="227.42 254.67 227.42 241.85 235.52 239.22 227.42 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 323,
						})}
					>
						<polygon
							points="319.87 254.67 319.87 241.85 311.77 239.22 319.87 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="320.88 254.67 320.88 241.85 328.98 239.22 320.88 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 324,
						})}
					>
						<polygon
							points="336.45 239.22 336.45 252.04 344.55 254.67 336.45 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="335.44 239.22 335.44 252.04 327.34 254.67 335.44 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 325,
						})}
					>
						<polygon
							points="351.02 254.67 351.02 241.85 342.92 239.22 351.02 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="352.03 254.67 352.03 241.85 360.13 239.22 352.03 254.67"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 326,
						})}
					>
						<polygon
							points="367.6 239.22 367.6 252.04 375.7 254.67 367.6 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="366.59 239.22 366.59 252.04 358.49 254.67 366.59 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 327,
						})}
					>
						<polygon
							points="522.27 239.22 522.27 252.04 530.37 254.67 522.27 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="521.26 239.22 521.26 252.04 513.16 254.67 521.26 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 328,
						})}
					>
						<polygon
							points="553.42 239.22 553.42 252.04 561.52 254.67 553.42 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 239.22 552.41 252.04 544.31 254.67 552.41 239.22"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 329,
						})}
					>
						<polygon
							points="180.7 334.24 180.7 321.42 188.79 318.79 180.7 334.24"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 334.24 179.68 321.42 171.59 318.79 179.68 334.24"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 330,
						})}
					>
						<polygon
							points="553.42 334.24 553.42 321.42 561.52 318.79 553.42 334.24"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="552.41 334.24 552.41 321.42 544.31 318.79 552.41 334.24"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 331,
						})}
					>
						<polygon
							points="567.99 318.79 567.99 331.61 559.89 334.24 567.99 318.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="569 318.79 569 331.61 577.1 334.24 569 318.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 332,
						})}
					>
						<polygon
							points="599.14 318.79 599.14 331.61 591.04 334.24 599.14 318.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="600.15 318.79 600.15 331.61 608.25 334.24 600.15 318.79"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 333,
						})}
					>
						<polygon
							points="615.73 334.24 615.73 321.42 623.83 318.79 615.73 334.24"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="614.72 334.24 614.72 321.42 606.62 318.79 614.72 334.24"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 334,
						})}
					>
						<polygon
							points="180.7 334.7 180.7 347.52 188.79 350.15 180.7 334.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="179.68 334.7 179.68 347.52 171.59 350.15 179.68 334.7"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
					<g
						className={classNames({
							[classes.point]: true,
							active:
								animations[this.state.activePoint]
									.polygonIndex === 335,
						})}
					>
						<polygon
							points="599.14 350.15 599.14 337.33 591.04 334.7 599.14 350.15"
							fill={mapcolor}
							stroke="none"
						></polygon>
						<polygon
							points="600.15 350.15 600.15 337.33 608.25 334.7 600.15 350.15"
							fill={mapcolor}
							stroke="none"
						></polygon>
					</g>
				</svg>
			</div>
		);
	}
}
AnimatedChevronMap.defaultProps = {
	mapcolor: "#C0C0C0",
};

AnimatedChevronMap.propTypes = {
	classes: PropTypes.object.isRequired,
	mapcolor: PropTypes.string,
};

export default withErrorHandler(withStyles(styles)(AnimatedChevronMap));
