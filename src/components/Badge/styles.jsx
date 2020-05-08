/** @format */

export default theme => ({
	root: {
		display: "inline-block",
		flexGrow: 0,
		flexShrink: 0,
	},
	badge: {
		position: "absolute !important",
	},
	topLeft: {
		left: "0 !important",
		top: "0 !important",
		right: "auto !important",
		bottom: "auto !important",
	},
	topCenter: {
		left: "50% !important",
		top: "0 !important",
		right: "auto !important",
		bottom: "auto !important",
		WebkitTransform: "translateX(-50%) !important",
		MsTransform: "translateX(-50%) !important",
		transform: "translateX(-50%) !important",
	},
	topRight: {
		right: "0 !important",
		top: "0 !important",
		left: "auto !important",
		bottom: "auto !important",
	},
	bottomLeft: {
		left: "0 !important",
		bottom: "0 !important",
		right: "auto !important",
		top: "auto !important",
	},
	bottomCenter: {
		left: "50% !important",
		bottom: "0 !important",
		right: "auto !important",
		top: "auto !important",
		WebkitTransform: "translateX(-50%) !important",
		MsTransform: "translateX(-50%) !important",
		transform: "translateX(-50%) !important",
	},
	bottomRight: {
		right: "0 !important",
		bottom: "0 !important",
		left: "auto !important",
		top: "auto !important",
	},
	centerLeft: {
		left: "0 !important",
		top: "50% !important",
		bottom: "auto !important",
		right: "auto !important",
		WebkitTransform: "translateY(-50%) !important",
		MsTransform: "translateY(-50%) !important",
		transform: "translateY(-50%) !important",
	},
	center: {
		left: "50% !important",
		top: "50% !important",
		bottom: "auto !important",
		right: "auto !important",
		WebkitTransform: "translate(-50%, -50%) !important",
		MsTransform: "translate(-50%, -50%) !important",
		transform: "translate(-50%, -50%) !important",
		"& + *": {
			clear: "both",
		},
	},
	centerRight: {
		right: "0 !important",
		top: "50% !important",
		left: "auto !important",
		bottom: "auto !important",
		WebkitTransform: "translateY(-50%) !important",
		MsTransform: "translateY(-50%) !important",
		transform: "translateY(-50%) !important",
	},
});
