import CardHeader from "@material-ui/core/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "utils/withRoot";
import styles from "./styles";

function CustomCardHeader({ ...props }) {
  const { classes, className, children, color, plain, ...rest } = props;
  const cardHeaderClasses = classNames({
    [classes.cardHeader]: true,
    [classes[color + "CardHeader"]]: color,
    [classes.cardHeaderPlain]: plain,
    [className]: className !== undefined
  });
  return (
    <CardHeader className={cardHeaderClasses} {...rest}>
      {children}
    </CardHeader>
  );
}

CustomCardHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(colors.names),
  plain: PropTypes.bool
};

export default withRoot(withStyles(styles)(CustomCardHeader));
