/** @format */

import React from "react";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material helpers


// Material components
import { List as ListIcon, Apps as AppsIcon } from "@mui/icons-material";

// Component styles


const DisplayMode = props => {
	const { className, mode, onChange } = props;

	const rootClassName = classNames(className);

	return (
		<div className={rootClassName}>
			<span
				onClick={onChange}
			>
				<AppsIcon />
			</span>
			<span />
			<span
				onClick={onChange}
			>
				<ListIcon />
			</span>
		</div>
	);
};

DisplayMode.propTypes = {
	className: PropTypes.string,

	mode: PropTypes.oneOf(["grid", "list"]),
	onChange: PropTypes.func,
};

DisplayMode.defaultProps = {
	mode: "grid",
	onChange: () => { },
};

export default (DisplayMode);
