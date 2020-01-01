import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "utils/withRoot";
import styles from "./styles";

function CustomCardContent({ ...props }) {
  const { classes, className, cardBody, color, children, ...rest } = props;
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes[color]]: color,
    [className]: className
  });
  return (
    <div {...rest} className={cardBodyClasses}>
      {children}
    </div>
  );
}

CustomCardContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(colors.names)
};

export default withRoot(withStyles(styles)(CustomCardContent));
