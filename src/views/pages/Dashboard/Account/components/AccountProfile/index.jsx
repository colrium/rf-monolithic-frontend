// Material helpers
import {
  Avatar,
  LinearProgress,
  Typography,
  withStyles
} from "@material-ui/core";
import { PersonOutlined as UserIcon } from "@material-ui/icons";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
// Shared components
import Portlet from "components/Portlet";
import PortletContent from "components/Portlet/Content";
import PortletFooter from "components/Portlet/Footer";
import UsersDefination from "definations/users";
import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
// Externals
import compose from "recompose/compose";
import { attachments as AttachmentsService } from "services";
import AuthService from "services/auth";
import { updateCurrentUser } from "state/actions/auth";
import withRoot from "utils/withRoot";
//
import BaseForm from "views/forms/BaseForm";
// Component styles
import styles from "./styles";

class AccountProfile extends Component {
  state = {
    avatar: false,
    includedFields: ["avatar", "documents"],
    formValues: null
  };

  constructor(props) {
    super(props);
    const { auth } = props;

    if (auth.user.avatar) {
      this.state.formValues = {
        avatar: auth.user.avatar,
        documents: auth.user.douments
      };
    }

    this.state.user_id = auth.user._id;
    this.handleProfileFormSubmit = this.handleProfileFormSubmit.bind(this);
  }
  componentDidMount() {
    AuthService.profile({})
      .then(res => {
        if (!res.err) {
          let formValues = res.body.data;
          if (formValues.avatar) {
            this.setState(state => ({
              formValues: {
                avatar: formValues.avatar,
                documents: formValues.documents
              }
            }));
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleProfileFormSubmit(data, event) {
    const { updateCurrentUser } = this.props;
    return AuthService.update_profile(data)
      .then(res => {
        updateCurrentUser(res.body.data);
        return true;
      })
      .catch(err => {
        throw err;
        return err;
      });
  }

  render() {
    const { classes, auth } = this.props;

    const rootClassName = classes.root;

    return (
      <Portlet className={rootClassName}>
        <PortletContent>
          
          <div className={classes.progressWrapper}>
            <Typography variant="body1">Profile Completeness: 70%</Typography>
            <LinearProgress value={70} variant="determinate" />
          </div>

          <GridContainer>
            <GridItem xs={12}>
              <BaseForm
                defination={UsersDefination}
                onSubmit={this.handleProfileFormSubmit}
                record={this.state.user_id}
                initialValues={this.state.formValues}
                form="user_avatar_form"
                fields={this.state.includedFields}
                submit_btn_text="Update Profile"
                show_discard={false}
                show_title={false}
                onSubmitSuccessMessage="Profile changes saved"
              />
            </GridItem>
          </GridContainer>
        </PortletContent>
        <PortletFooter></PortletFooter>
      </Portlet>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRoot(
  compose(
    withStyles(styles),
    connect(
      mapStateToProps,
      { updateCurrentUser }
    )
  )(AccountProfile)
);
