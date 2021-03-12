/** @format */

import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import gridStyle from "assets/jss/components/gridStyle.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

function GridContainer(props) {
	/*let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);*/
	let {
		classes,
		children,
		color,
		fullwidth,
		fullheight,
		className,
		...rest
	} = props;
	let gridClasses = classNames({
		[color]: color,
		[classes.fullwidth]: fullwidth,
		[classes.fullheight]: fullheight,
		[classes.griditem]: true,
		[className]: className,
	});
	return (
		<Grid container {...rest} className={gridClasses}>
			{children}
		</Grid>
	);
}

GridContainer.defaultProps = {
	className: "",
};

GridContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
	color: PropTypes.oneOf(colors.names),
	fullwidth: PropTypes.bool,
	fullheight: PropTypes.bool,
	grid: PropTypes.bool,
};

export default withStyles(gridStyle)(GridContainer);
