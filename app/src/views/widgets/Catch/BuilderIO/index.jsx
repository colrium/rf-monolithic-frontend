/** @format */



import ProgressIndicator from "components/ProgressIndicator";
import { builderIO } from "config";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";

import NotFound from "views/widgets/Catch/NotFound";





const BuilderIO = props => {
	return (
		<NotFound />
	);
};

BuilderIO.defaultProps = {
	name: "page",
	apiKey: builderIO.public_api_key,
};

BuilderIO.propTypes = {

	name: PropTypes.string.isRequired,
	apiKey: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default (
	compose(connect(mapStateToProps, {}))(BuilderIO)
);
