/** @format */


import { colors } from "assets/jss/app-theme";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import PropTypes from "prop-types";
import React from "react";
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
//
//
import { appendNavHistory } from "state/actions/ui/nav";

//
import AccessDenied from "views/widgets/Catch/AccessDenied";
import BuilderIO from "views/widgets/Catch/BuilderIO";


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
				scrollTop: 0,
			});
		}
	}

	render() {
		const { auth } = this.props;
		return (
			<GridContainer >
				<GridItem xs={12}>
					{!auth.user?.isAdmin && <AccessDenied />}
					{auth.user?.isAdmin && <BuilderIO />}
				</GridItem>
			</GridContainer>
		);
	}
}

Page.propTypes = {

};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default (
	compose(

		connect(mapStateToProps, { appendNavHistory })
	)(Page)
);
