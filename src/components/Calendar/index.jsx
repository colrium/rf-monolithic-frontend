/** @format */

import IconButton from "@mui/material/IconButton"

import Tab from "@mui/material/Tab"
//
import Tabs from "@mui/material/Tabs"
import { ArrowBack as PrevIcon, ArrowForward as NextIcon, EventOutlined as CalendarIcon } from "@mui/icons-material"
import { colors } from "assets/jss/app-theme"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Grid from "@mui/material/Grid"
import Status from "components/Status"
import Typography from "@mui/material/Typography"
import { formats } from "config/data"
import PropTypes from "prop-types"
import React from "react"
import { UtilitiesHelper } from "utils/Helpers"

class CustomCalendar extends React.Component {
	calendarRef = React.createRef()
	state = {
		view: "month",
		view_title: new Date().format(formats.dateformats.month),
		calendars: [],
		tasks: [],
		schedules: [],
	}

	constructor(props) {
		super(props)
		const {
			theme,
			view,
			calendars,
			tasks,
			schedules,
			show_actions,
			icon,
			title,
			subtitle,
			icon_color,
			title_color,
			subtitle_color,
			calendarProps,
		} = props
		this.state = {
			...this.state,
			theme: theme,
			view: view,
			view_title:
				view === "day"
					? new Date().format(formats.dateformats.date)
					: view === "week"
					? new Date().format(formats.dateformats.week)
					: new Date().format(formats.dateformats.month),
			calendars: calendars,
			tasks: tasks,
			schedules: schedules,
			show_actions: show_actions,
			icon: icon,
			title: title,
			subtitle: subtitle,
			icon_color: icon_color,
			title_color: title_color,
			subtitle_color: subtitle_color,
			calendarProps: calendarProps,
		}
		this.handleChangeCalendarView = this.handleChangeCalendarView.bind(this)
		this.handleClickPrevButton = this.handleClickPrevButton.bind(this)
		this.handleClickNextButton = this.handleClickNextButton.bind(this)
	}

	componentDidMount() {
		this.initCalendarEvents()
	}

	getSnapshotBeforeUpdate(prevProps) {
		return { refreshRequired: !Object.areEqual(prevProps, this.props) }
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {
			theme,
			view,
			calendars,
			tasks,
			schedules,
			show_actions,
			icon,
			title,
			subtitle,
			icon_color,
			title_color,
			subtitle_color,
			calendarProps,
		} = this.props
		if (snapshot.refreshRequired) {
			this.setState(
				{
					theme: theme,
					view: view,
					view_title:
						view === "day"
							? new Date().format(formats.dateformats.date)
							: view === "week"
							? new Date().format(formats.dateformats.week)
							: new Date().format(formats.dateformats.month),
					calendars: calendars,
					tasks: tasks,
					schedules: schedules,
					show_actions: show_actions,
					icon: icon,
					title: title,
					subtitle: subtitle,
					icon_color: icon_color,
					title_color: title_color,
					subtitle_color: subtitle_color,
					calendarProps: calendarProps,
				},
				this.initCalendarEvents
			)
		}
	}

	initCalendarEvents() {
		const { onSelect, onClickEntry, onClickEdit, onClickDelete } = this.props
		const calendar = this.calendarRef.current.getInstance()
		if (calendar) {
			calendar.on({
				clickSchedule: function (e) {
					if (UtilitiesHelper.isOfType(onClickEntry, "function")) {
						onClickEntry(e.schedule)
					}
				},
				beforeCreateSchedule: function (e) {
					if (UtilitiesHelper.isOfType(onSelect, "function")) {
						onSelect(e)
					}
				},
				beforeUpdateSchedule: function (e) {
					if (UtilitiesHelper.isOfType(onClickEdit, "function")) {
						onClickEdit(e)
					}
				},
				beforeDeleteSchedule: function (e) {
					if (UtilitiesHelper.isOfType(onClickDelete, "function")) {
						onClickDelete(e)
					}
				},
			})
		}
	}

	handleChangeCalendarView = (event, view) => {
		if (this.calendarRef.current) {
			const calendarInstance = this.calendarRef.current.getInstance()
			const rendered_date = calendarInstance.getDate().toDate()
			this.setState(state => ({
				view: view,
				view_title:
					view === "day"
						? rendered_date.format(formats.dateformats.date)
						: view === "week"
						? rendered_date.format(formats.dateformats.week)
						: rendered_date.format(formats.dateformats.month),
			}))
		} else {
			this.setState(state => ({ view: view }))
		}
	}

	handleClickPrevButton = () => {
		if (this.calendarRef.current) {
			const calendarInstance = this.calendarRef.current.getInstance()
			calendarInstance.prev()
			const rendered_date = calendarInstance.getDate().toDate()
			this.setState(state => ({
				view_title:
					state.view === "day"
						? rendered_date.format(formats.dateformats.date)
						: state.view === "week"
						? rendered_date.format(formats.dateformats.week)
						: rendered_date.format(formats.dateformats.month),
			}))
		}
	}

	handleClickNextButton = () => {
		if (this.calendarRef.current) {
			const calendarInstance = this.calendarRef.current.getInstance()
			calendarInstance.next()
			const rendered_date = calendarInstance.getDate().toDate()
			this.setState(state => ({
				view_title:
					state.view === "day"
						? rendered_date.format(formats.dateformats.date)
						: state.view === "week"
						? rendered_date.format(formats.dateformats.week)
						: rendered_date.format(formats.dateformats.month),
			}))
		}
	}

	handleOnEditEntryClick = event => {
		if (this.calendarRef.current) {
		}
	}

	handleOnDeleteEntryClick = event => {
		if (this.calendarRef.current) {
		}
	}

	render() {
		const { height, defaultView, disableDblClick, disableClick, isReadOnly, useDetailPopup, useCreationPopup, scheduleView, taskView } =
			this.props
		const {
			theme,
			view,
			view_title,
			calendars,
			tasks,
			schedules,
			show_actions,
			icon,
			title,
			subtitle,
			icon_color,
			title_color,
			subtitle_color,
			calendarProps,
		} = this.state
		const calProps = {
			height: height + "px",
			defaultView: defaultView,
			disableDblClick: disableDblClick,
			disableClick: disableClick,
			isReadOnly: isReadOnly,
			useDetailPopup: useDetailPopup,
			useCreationPopup: useCreationPopup,
			scheduleView: scheduleView,
			taskView: taskView,
			...calendarProps,
		}

		return (
			<Card elevation={0}>
				<CardHeader
					avatar={
						<Avatar aria-label={title} style={{ background: icon_color }}>
							{icon}
						</Avatar>
					}
					title={title}
					subheader={subtitle}
				></CardHeader>
				<CardContent className="p-0 m-0">
					<Grid container className="p-0 m-0">
						<Grid container className="p-0 m-0">
							<Grid item sm={6} md={4}>
								<Tabs
									value={view}
									onChange={this.handleChangeCalendarView}
									indicatorColor="primary"
									textColor="primary"
									variant="fullWidth"
									aria-label="view change tabs"
								>
									<Tab value="month" label="Month" />
									<Tab value="week" label="Week" />
									<Tab value="day" label="Day" />
								</Tabs>
							</Grid>

							<Grid item sm={6} md={4}>
								<Typography variant="h3" center>
									{" "}
									{view_title}{" "}
								</Typography>
							</Grid>

							<Grid item sm={12} md={4}>
								<div className="float-right">
									<IconButton onClick={this.handleClickPrevButton}>
										<PrevIcon />
									</IconButton>
									<IconButton onClick={this.handleClickNextButton}>
										<NextIcon />
									</IconButton>
								</div>
							</Grid>
						</Grid>

						<Grid container className="p-0 m-0">
							<Grid item xs={12}>
								{/* <Calendar
									theme={theme}
									view={view}
									calendars={calendars}
									tasks={tasks}
									schedules={schedules}
									ref={this.calendarRef}
									{...calProps}
								/> */}
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
				<CardActions>
					<Grid container className="p-0 m-0">
						<Grid item xs={12}>
							<Typography variant="subtitle2" display="block" gutterBottom>
								Calendar index
							</Typography>
						</Grid>
						<Grid item xs={12}>
							{calendars.map((calendar, index) => (
								<Status
									color={calendar.bgColor ? calendar.bgColor : colors.hex.secondary}
									text={calendar.name}
									key={"calendar-" + index}
								/>
							))}
						</Grid>
					</Grid>
				</CardActions>
			</Card>
		)
	}
}

CustomCalendar.propTypes = {
	className: PropTypes.string,
	calendars: PropTypes.array,
	view: PropTypes.string,
	tasks: PropTypes.array,
	schedules: PropTypes.array,
	show_actions: PropTypes.bool,
	theme: PropTypes.object,
	calendarProps: PropTypes.object,
	startDate: PropTypes.string,
	icon: PropTypes.node,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	icon_color: PropTypes.string,
	title_color: PropTypes.string,
	subtitle_color: PropTypes.string,
	height: PropTypes.number,
	defaultView: PropTypes.string,
	disableDblClick: PropTypes.bool,
	disableClick: PropTypes.bool,
	isReadOnly: PropTypes.bool,
	useDetailPopup: PropTypes.bool,
	useCreationPopup: PropTypes.bool,
	scheduleView: PropTypes.bool,
	taskView: PropTypes.bool,
	onSelect: PropTypes.func,
	onClickEntry: PropTypes.func,
	onClickEdit: PropTypes.func,
	onClickDelete: PropTypes.func,
}

CustomCalendar.defaultProps = {
	calendars: [],
	tasks: [],
	schedules: [],
	view: "month",
	theme: {
		"common.border": "1px solid rgba(" + colors.rgb.grey + ", 0.5)",
		"common.backgroundColor": "#fcfcfc",
		"common.holiday.color": colors.hex.grey,
		"common.saturday.color": colors.hex.grey,
		"common.dayname.color": colors.hex.default,
		"common.today.color": colors.hex.primary,
		"week.currentTime.color": colors.hex.primarydark,
	},
	show_actions: true,
	icon: <CalendarIcon />,
	title: "My",
	subtitle: "Calendar",
	icon_color: colors.hex.primary,
	title_color: colors.hex.primary,
	subtitle_color: colors.hex.grey,
	calendarProps: {},
	height: 900,
	defaultView: "month",
	disableDblClick: true,
	disableClick: false,
	isReadOnly: false,
	useDetailPopup: true,
	useCreationPopup: false,
	scheduleView: true,
	taskView: true,
}

export default CustomCalendar
