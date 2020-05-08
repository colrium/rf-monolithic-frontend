/** @format */

import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import paginationStyle from "assets/jss/components/paginationStyle.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";

function Pagination({ ...props }) {
	const { classes, pages, color } = props;
	return (
		<ul className={classes.pagination}>
			{pages.map((prop, key) => {
				const paginationLink = classNames({
					[classes.paginationLink]: true,
					[classes[color]]: prop.active,
					[classes.disabled]: prop.disabled,
				});
				return (
					<li className={classes.paginationItem} key={key}>
						{prop.onClick !== undefined ? (
							<Button
								onClick={prop.onClick}
								className={paginationLink}
							>
								{prop.text}
							</Button>
						) : (
							<Button
								onClick={() =>
									console.log("you've clicked " + prop.text)
								}
								className={paginationLink}
							>
								{prop.text}
							</Button>
						)}
					</li>
				);
			})}
		</ul>
	);
}

Pagination.defaultProps = {
	color: colors.names[0],
};

Pagination.propTypes = {
	classes: PropTypes.object.isRequired,
	pages: PropTypes.arrayOf(
		PropTypes.shape({
			active: PropTypes.bool,
			disabled: PropTypes.bool,
			text: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.oneOf(["PREV", "NEXT", "..."]),
			]).isRequired,
			onClick: PropTypes.func,
		})
	).isRequired,
	color: PropTypes.oneOf(colors.names),
};

export default withRoot(withStyles(paginationStyle)(Pagination));
