/** @format */


import Calendar from "components/Calendar";
import Grid from '@mui/material/Grid';
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";


class OverviewCalendar extends React.Component {
	calendarRef = React.createRef();
	state = {
		calendars: [],
		tasks: [],
		schedules: [],
	};

	constructor(props) {
		super(props);
		const { auth } = props;
	}

	componentDidMount() { }

	render() {
		const { auth } = this.props;
		return (
			<Grid container className="p-0 m-0">
				<Calendar
					title={
						auth.user?.role === "admin"
							? "Schedules, Tasks & Events"
							: "My Calendar"
					}
					subtitle={
						auth.user?.role === "admin" ? "Calendar" : "Events"
					}
				/>
			</Grid>
		);
	}
}

OverviewCalendar.propTypes = {};

OverviewCalendar.defaultProps = {};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(
	connect(mapStateToProps, {})
)(OverviewCalendar);
