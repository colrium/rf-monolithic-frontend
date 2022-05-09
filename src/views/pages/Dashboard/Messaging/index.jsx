import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withTheme } from '@mui/styles';
import { appendNavHistory } from "state/actions";
import ChatApp from "views/apps/Dashboard/Chat";




class Page extends Component {
	componentDidMount() {
		const { location, appendNavHistory, theme } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "messages",
				uri: location.pathname,
				title: "Messages",
				view: null,
				color: theme.palette.primary,
				scrollTop: 0,
			});
		}
	}



	render() {
		const { classes } = this.props;

		return (
			<GridContainer className="m-0 p-0">
				<GridItem xs={12}>
					<ChatApp />
				</GridItem>
			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(connect(mapStateToProps, { appendNavHistory }), withTheme)(Page);
