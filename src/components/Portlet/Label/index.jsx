import { Typography } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
// Material helpers
// Material components
import GridContainer from "components/Grid/GridContainer";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "utils/withRoot";
import styles from "./styles";

const PortletLabel = props => {
  const {
    classes,
    className,
    icon,
    title,
    subtitle,
    description,
    color,
    icon_color,
    title_color,
    subtitle_color
  } = props;

  return (
    <GridContainer
      className={classes.portletLabelContainer}
      style={color ? { color: color } : {}}
    >
      {icon && (
        <Typography
          className={classes.labelIcon}
          variant="h3"
          style={icon_color ? { color: icon_color } : {}}
        >
          {" "}
          {icon}{" "}
        </Typography>
      )}
      {title && (
        <Typography
          className={classes.labelTitle}
          variant="h5"
          style={title_color ? { color: title_color } : {}}
        >
          {" "}
          {title}{" "}
        </Typography>
      )}
      {subtitle && (
        <Typography
          className={classes.subtitle}
          variant="subtitle2"
          style={subtitle_color ? { color: subtitle_color } : {}}
        >
          {subtitle}
        </Typography>
      )}
    </GridContainer>
  );
};

PortletLabel.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  color: PropTypes.string,
  icon_color: PropTypes.string,
  title_color: PropTypes.string,
  subtitle_color: PropTypes.string,
  description_color: PropTypes.string
};

PortletLabel.defaultProps = {
  classes: PropTypes.object.isRequired,
  color: colors.hex.default,
  title_color: colors.hex.default,
  subtitle_color: colors.hex.grey,
  icon_color: colors.hex.default,
  description_color: colors.hex.default
};

export default withRoot(withStyles(styles)(PortletLabel));
