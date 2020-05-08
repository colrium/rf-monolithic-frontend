/** @format */

import { builder, BuilderComponent } from "@builder.io/react";
import withStyles from "@material-ui/core/styles/withStyles";
import ProgressIndicator from "components/ProgressIndicator";
import { builderIO } from "config";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withErrorHandler } from "hoc/ErrorHandler";
import NotFound from "views/widgets/Catch/NotFound";
import styles from "./styles";




const BuilderIO = props => {
	const { apiKey, name, className } = props;
	builder.init(apiKey);
	const [notFound, setNotFound] = useState(false);
	return !notFound ? (
		<BuilderComponent
			apiKey={apiKey}
			name={name}
			contentLoaded={content => {
				if (!content) {
					setNotFound(true);
				}
			}}
		>
			<ProgressIndicator />
		</BuilderComponent>
	) : (
		<NotFound />
	);
};
/* class BuilderIO extends React.Component {
	state = { notFound: false };

	render() {
		const { apiKey, name, className } =this.props;
		return !this.state.notFound ? (
			<BuilderComponent
				apiKey={apiKey}
				name={name}
				contentLoaded={content => {
					if (!content) {
						this.setState({ notFound: true });
					}
				}}
			>
				<ProgressIndicator />
			</BuilderComponent>
		) : (<NotFound />);
	}
} */

BuilderIO.defaultProps = {
	name: "page",
	apiKey: builderIO.public_api_key,
};

BuilderIO.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	apiKey: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(withStyles(styles), connect(mapStateToProps, {}))(BuilderIO)
);
