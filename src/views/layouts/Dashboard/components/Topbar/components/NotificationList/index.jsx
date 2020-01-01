// Material helpers
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
// Material icons
import {
  LabelOutlined as ContextlessNotificationIcon,
  NotificationsOutlined as EmptyIcon
} from "@material-ui/icons";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import Status from "components/Status";
import Typography from "components/Typography";
import * as definations from "definations";
// Externals
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { UtilitiesHelper } from "utils/Helpers";
// Component styles
import styles from "./styles";

class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.contexts = {
      contextless: {
        icon: <ContextlessNotificationIcon />,
        color: colors.hex.default
      }
    };

    for (let [name, defination] of Object.entries(definations)) {
      this.contexts[UtilitiesHelper.singularize(name).toLowerCase()] = {
        icon: defination.icon ? (
          defination.icon
        ) : (
          <ContextlessNotificationIcon />
        ),
        color: defination.color ? defination.color : colors.hex.default
      };
    }
  }

  componentDidMount() {}

  render() {
    const { className, classes, notifications, onSelect } = this.props;
    const priority_colors = {
      low: "#03a9f4",
      medium: "#ff9800",
      high: "#ff0000"
    };
    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        {notifications.length > 0 ? (
          <Box>
            <div className={classes.header}>
              <Typography variant="h6">User Notifications</Typography>
              <Typography className={classes.subtitle} variant="body2">
                {notifications.length} new notifications
              </Typography>
            </div>
            <div className={classes.content}>
              <List component="div">
                {notifications.map(notification => (
                  <Link
                    key={notification._id}
                    to={definations.notifications.access.actions.view_single.uri(
                      notification._id
                    )}
                  >
                    <ListItem
                      className={classes.listItem}
                      component="div"
                      onClick={onSelect}
                    >
                      <ListItemIcon
                        className={classes.listItemIcon}
                        style={{
                          color: notification.context
                            ? notification.context.toLowerCase() in
                              this.contexts
                              ? this.contexts[
                                  notification.context.toLowerCase()
                                ].color
                              : this.contexts.contextless.color
                            : this.contexts.contextless.color
                        }}
                      >
                        {notification.context
                          ? notification.context.toLowerCase() in this.contexts
                            ? this.contexts[notification.context.toLowerCase()]
                                .icon
                            : this.contexts.contextless.icon
                          : this.contexts.contextless.icon}
                      </ListItemIcon>
                      <ListItemText
                        classes={{
                          primary: classes.listItemTextPrimary,
                          secondary: classes.listItemTextSecondary
                        }}
                        primary={
                          <React.Fragment>
                            <Status
                              variant="dot"
                              color={
                                notification.priority.toLowerCase() in
                                priority_colors
                                  ? priority_colors[
                                      notification.priority.toLowerCase()
                                    ]
                                  : "#9e9e9e"
                              }
                              text={notification.title}
                              text_color={
                                notification.read
                                  ? colors.hex.grey
                                  : colors.hex.default
                              }
                            ></Status>
                          </React.Fragment>
                        }
                        secondary={
                          <Typography
                            color={notification.read ? "grey" : "default"}
                            variant="body2"
                            component="span"
                          >
                            {" "}
                            {notification.body}{" "}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Link>
                ))}
              </List>
              <div className={classes.footer}>
                <Button
                  component={Link}
                  to="/notifications"
                  variant="text"
                  color="primary"
                >
                  All Notifications
                </Button>
              </div>
            </div>
          </Box>
        ) : (
          <div className={classes.empty}>
            <div className={classes.emptyImageWrapper}>
              <EmptyIcon className={classes.emptyIcon} />
            </div>
            <Typography color="grey" variant="body2">
              No new notifications yet
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

NotificationList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func
};

NotificationList.defaultProps = {
  notifications: [],
  onSelect: () => {}
};

export default withStyles(styles)(NotificationList);
