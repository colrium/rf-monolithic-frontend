import React from "react";
import PropTypes from "prop-types";
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import BuilderIO from "views/widgets/Catch/BuilderIO";
import AccessDenied from "views/widgets/Catch/AccessDenied";

//
//

import { appendNavHistory } from "state/actions/ui/nav";

import withRoot from "utils/withRoot";
//
import styles from "views/pages/styles";
//Context Views Imports

class Page extends React.Component {
    defination = null;
    service = null;

    constructor(props) {
        super(props);
        const { componentProps } = props;
        this.context = componentProps.context;
    }

    componentDidMount() {
        const { auth, location, appendNavHistory } = this.props;
        if (appendNavHistory && location) {
            appendNavHistory({
                name: "pagebuilder",
                uri: location.pathname,
                title: "Builder",
                view: null,
                color: colors.hex.primary,
                scrollTop: 0
            });
        }
    }

    render() {
        const { classes, auth } = this.props;
        return (
            <GridContainer className={classes.root}>
                <GridItem xs={12}>
                    {!auth.user.isAdmin && <AccessDenied />}
                    {auth.user.isAdmin && <BuilderIO />}                    
                </GridItem>
            </GridContainer>
        );
    }
}

Page.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default withRoot(compose(withStyles(styles),connect(mapStateToProps, { appendNavHistory }))(Page));
