import Chip from "@material-ui/core/Chip";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import style from "assets/jss/components/chipStyle.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "utils/withRoot";

function CustomChip({ ...props }) {
  const {
    classes,
    color,
    color_text,
    text_case,
    raised,
    hover_shadow,
    className,
    children,
    ...rest
  } = props;

  const chipClasses = classNames({
    [classes.chip]: true,
    [classes[text_case]]: text_case,
    [color]: color,
    [color_text + "_text"]: color_text,
    raised: raised,
    hoverraise: hover_shadow,
    [text_case]: text_case,
    [className]: className
  });
  return (
    <Chip className={chipClasses} {...rest}>
      {children}
    </Chip>
  );
}

CustomChip.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(colors.names),
  color_text: PropTypes.oneOf(colors.names),
  text_case: PropTypes.oneOf([
    "lowercase",
    "uppercase",
    "wordcase",
    "nocase",
    "inheritcase"
  ]),
  raised: PropTypes.bool,
  hover_shadow: PropTypes.bool
};

export default withRoot(withStyles(style)(CustomChip));
