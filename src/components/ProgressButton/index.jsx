/** @format */


import {
	errorColor,
	grayColor,
	inverseColor,
	primaryColor,
	secondaryColor,
	successColor,
} from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import React from "react";


export const STATE = {
	LOADING: "loading",
	DISABLED: "disabled",
	SUCCESS: "success",
	ERROR: "error",
	NOTHING: "",
};

const styles = theme => ({
	pbContainer: {
		display: "inline-block",
		textAlign: "center",
		width: "100%",
		"&.disabled": {
			"& .pbButton": {
				cursor: "not-allowed",
			},
		},
		"& .pbButton": {
			background: "transparent",
			border: "2px solid " + primaryColor,
			borderRadius: "27px",
			color: "$color_1",
			cursor: "pointer",
			padding: "0.7em 1em",
			textDecoration: "none",
			textAlign: "center",
			height: "54px",
			width: "100%",
			WebkitTapHighlightColor: "transparent",
			outline: "none",
			transition:
				"background-color 0.3s, width 0.3s, border-width 0.3s, border-color 0.3s, border-radius 0.3s",
			"& span": {
				display: "inherit",
				transition: "opacity 0.3s 0.1s",
				fontSize: "2em",
				fontWeight: "100",
			},
			"& svg": {
				height: "54px",
				width: "54px",
				position: "absolute",
				transform: "translate(-50%, -50%)",
				pointerEvents: "none",
				"& path": {
					opacity: "0",
					fill: "none",
				},
				"&.pbProgressCircle": {
					animation:
						"spin 0.9s infinite cubic-bezier(0.085, 0.260, 0.935, 0.710)",
					"& path": {
						stroke: primaryColor,
						strokeWidth: "5",
					},
				},
				"&.pbCheckmark": {
					"& path": {
						stroke: inverseColor,
						strokeLinecap: "round",
						strokeWidth: "4",
					},
				},
				"&.pbCross": {
					"& path": {
						stroke: inverseColor,
						strokeLinecap: "round",
						strokeWidth: "4",
					},
				},
			},
		},
		"& .loading": {
			"& .pbButton": {
				width: "54px",
				borderWidth: "6.5px",
				borderColor: grayColor,
				cursor: "wait",
				backgroundColor: secondaryColor,
				padding: "0",
				"& span": {
					transition: "all 0.15s",
					opacity: "0",
					display: "none",
				},
				"& .pbProgressCircle": {
					"& path": {
						transition: "opacity 0.15s 0.3s",
						opacity: "1",
					},
				},
			},
		},
		"& .success": {
			"& .pbButton": {
				width: "54px",
				borderColor: successColor,
				backgroundColor: successColor,
				padding: "0",
				"& span": {
					transition: "all 0.15s",
					opacity: "0",
					display: "none",
				},
				"& .pbCheckmark": {
					"& path": {
						opacity: "1",
					},
				},
			},
		},
		"& .error": {
			"& .pbButton": {
				width: "54px",
				borderColor: errorColor,
				backgroundColor: errorColor,
				padding: "0",
				"& span": {
					transition: "all 0.15s",
					opacity: "0",
					display: "none",
				},
				"& .pbCross": {
					"& path": {
						opacity: "1",
					},
				},
			},
		},
	},
});

const ProgressButton = createReactClass({
	propTypes: {

		controlled: PropTypes.bool,
		durationError: PropTypes.number,
		durationSuccess: PropTypes.number,
		form: PropTypes.string,
		onClick: PropTypes.func,
		onError: PropTypes.func,
		onSuccess: PropTypes.func,
		state: PropTypes.oneOf(Object.keys(STATE).map(k => STATE[k])),
		type: PropTypes.string,
		shouldAllowClickOnLoading: PropTypes.bool,
	},

	getDefaultProps() {
		return {
			controlled: false,
			durationError: 1200,
			durationSuccess: 500,
			onClick() { },
			onError() { },
			onSuccess() { },
			shouldAllowClickOnLoading: false,
		};
	},

	getInitialState() {
		return {
			currentState: this.props.state || STATE.NOTHING,
		};
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.state === this.props.state) {
			return;
		}
		switch (nextProps.state) {
			case STATE.SUCCESS:
				this.success();
				return;
			case STATE.ERROR:
				this.error();
				return;
			case STATE.LOADING:
				this.loading();
				return;
			case STATE.DISABLED:
				this.disable();
				return;
			case STATE.NOTHING:
				this.notLoading();
				return;
			default:
				return;
		}
	},

	componentWillUnmount() {
		clearTimeout(this._timeout);
	},

	render() {
		const {
			classes,
			className,
			children,
			type,
			form,
			durationError, // eslint-disable-line no-unused-vars
			durationSuccess, // eslint-disable-line no-unused-vars
			onClick, // eslint-disable-line no-unused-vars
			onError, // eslint-disable-line no-unused-vars
			onSuccess, // eslint-disable-line no-unused-vars
			state, // eslint-disable-line no-unused-vars
			shouldAllowClickOnLoading, // eslint-disable-line no-unused-vars
			controlled, // eslint-disable-line no-unused-vars
			...containerProps
		} = this.props;
		containerProps.className = classNames({
			[classes?.pbContainer]: true,
			[this.state.currentState]: true,
			[className]: className ? true : false,
		});
		containerProps.onClick = this.handleClick;
		return (
			<div {...containerProps}>
				<button
					className={classes?.pbButton}
					disabled={state === STATE.DISABLED}
					type={type}
					form={form}
				>
					<span>{children}</span>
					<svg
						className={classes?.pbProgressCircle}
						viewBox="0 0 41 41"
					>
						<path d="M38,20.5 C38,30.1685093 30.1685093,38 20.5,38" />
					</svg>
					<svg className={classes?.pbCheckmark} viewBox="0 0 70 70">
						<path d="m31.5,46.5l15.3,-23.2" />
						<path d="m31.5,46.5l-8.5,-7.1" />
					</svg>
					<svg className={classes?.pbCross} viewBox="0 0 70 70">
						<path d="m35,35l-9.3,-9.3" />
						<path d="m35,35l9.3,9.3" />
						<path d="m35,35l-9.3,9.3" />
						<path d="m35,35l9.3,-9.3" />
					</svg>
				</button>
			</div>
		);
	},

	handleClick(e) {
		if (this.props.controlled) {
			this.props.onClick(e);
			return true;
		}

		if (
			(this.props.shouldAllowClickOnLoading ||
				this.state.currentState !== STATE.LOADING) &&
			this.state.currentState !== STATE.DISABLED
		) {
			this.loading();
			const ret = this.props.onClick(e);
			this.handlePromise(ret);
		} else {
			e.preventDefault();
		}
	},

	handlePromise(promise) {
		if (promise && promise.then && promise.catch) {
			promise
				.then(() => {
					this.success();
				})
				.catch(err => {
					this.error(null, err);
				});
		}
	},

	loading() {
		this.setState({ currentState: STATE.LOADING });
	},

	notLoading() {
		this.setState({ currentState: STATE.NOTHING });
	},

	enable() {
		this.setState({ currentState: STATE.NOTHING });
	},

	disable() {
		this.setState({ currentState: STATE.DISABLED });
	},

	success(callback, dontRemove) {
		this.setState({ currentState: STATE.SUCCESS });
		this._timeout = setTimeout(() => {
			if (!dontRemove) {
				this.setState({ currentState: STATE.NOTHING });
			}
			callback = callback || this.props.onSuccess;
			if (typeof callback === "function") {
				callback();
			}
		}, this.props.durationSuccess);
	},

	error(callback, err) {
		this.setState({ currentState: STATE.ERROR });
		this._timeout = setTimeout(() => {
			this.setState({ currentState: STATE.NOTHING });
			callback = callback || this.props.onError;
			if (typeof callback === "function") {
				callback(err);
			}
		}, this.props.durationError);
	},
});

ProgressButton.propTypes = {

};

export default (ProgressButton);
