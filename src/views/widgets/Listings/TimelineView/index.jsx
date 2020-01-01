import { CircularProgress, Icon } from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
import EmptyStateImage from 'assets/img/empty-state-table.svg';
//
import Calendar from 'components/Calendar';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';
import React from "react";
//Redux imports
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { closeDialog, openDialog } from 'state/actions';
//
import withRoot from 'utils/withRoot';
import styles from './styles';



class TimelineView extends React.Component {
    calendarRef = React.createRef();
    state = {
        loading: true,
        load_error: false,
        records: [],
    };

    constructor(props) {
        super(props);
        const { defination, service, query } = props;

        this.state.defination = defination;
        this.state.service = service;
        this.state.query = query ? { ...query, p: 1 } : { p: 1 };

        this.handleEditItem = this.handleEditItem.bind(this);
        this.handleDeleteItemConfirm = this.handleDeleteItemConfirm.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

    }

    componentDidMount() {
        this.loadContext();
    }

    getSnapshotBeforeUpdate(prevProps) {
        return {
            contextReloadRequired: (!Object.areEqual(prevProps.defination, this.props.defination) && !Object.areEqual(prevProps.service, this.props.service)),
            dataReloadRequired: !Object.areEqual(prevProps.query, this.props.query)
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot.contextReloadRequired) {
            this.loadContext();
        }
        if (snapshot.dataReloadRequired) {
            const { query } = this.props;
            this.setState({ query: query ? { ...query, p: 1 } : { p: 1 } }, this.loadData);
        }
    }

    componentWillUnmount() {
        const { openDialog, closeDialog } = this.props;
        closeDialog();
    }

    handleEditItem(event) {
        const { auth } = this.props;

        if (!this.state.defination.access.actions.update.restricted(auth.user)) {
            window.location.href = '/' + this.state.defination.access.actions.update.uri(event.schedule.id);
        }

    }


    handleDeleteItemConfirm(event) {
        const { openDialog, closeDialog } = this.props;
        let that = this;
        openDialog({
            title: "Confirm Delete",
            body: "Are you sure you want delete " + event.schedule.title + "? This action might be irreversible",
            actions: {
                cancel: {
                    text: "Cancel",
                    color: "default",
                    onClick: () => closeDialog(),
                },
                delete: {
                    text: "Delete",
                    color: "error",
                    onClick: this.handleDeleteItem(event.schedule.id),
                }
            }
        });
    }

    handleDeleteItem = item_id => event => {
        const { openDialog, closeDialog } = this.props;

        openDialog({
            title: "Deleting safely",
            body: "Please wait. Executing safe delete...",
            actions: {}
        });

        this.state.service.delete(item_id).then((res) => {
            closeDialog();
            this.loadData();

        }).catch(e => {
            console.log("CalendarView delete error", e);
            closeDialog();
        })
    }

    loadContext() {
        const { defination, service, query, auth } = this.props;
        if (defination) {
            this.setState({ defination: defination, service: service, query: (query ? { ...query, p: 1 } : { p: 1 }), calendars: [{ id: defination.name, name: defination.label, bgColor: defination.color, borderColor: defination.color }], records: [], loading: false }, this.loadData);
        }
    }

    loadData() {
        const { auth } = this.props;

        if (this.state.defination && this.state.service) {
            this.setState(state => ({ records: [], loading: true }));
            this.state.service.getRecords(this.state.query).then((res) => {
                let raw_data = res.body.data;
                this.state.defination.views.listing.calendarview.resolveData(raw_data).then(data => {
                    this.setState(state => ({ records: data, loading: false }));
                }).catch((err) => {
                    console.error("CalendarView resolveData err", err);
                    this.setState(state => ({ records: [], load_error: { msg: err }, loading: false }));
                });

            }).catch((err) => {
                console.error("CalendarView loadData err", err);
                this.setState(state => ({ records: [], load_error: { msg: err }, loading: false }));
            });
        }
        else {
            this.setState(state => ({ records: [], load_error: { msg: "No Context defination or provided" }, loading: false }));
        }

    }

    render() {
        const { classes } = this.props;

        return (
            <GridContainer className={classes.root}>
                {this.state.defination && <GridItem className="p-0 m-0" xs={12}>
                    {this.state.loading ? (
                        <GridContainer className={classes.full_height} justify="center" alignItems="center">
                            <GridItem xs={1}>
                                <CircularProgress size={24} thickness={4} className={classes.progress} color="secondary" disableShrink />
                            </GridItem>
                        </GridContainer>
                    ) : (
                            <GridContainer className="p-0 m-0">
                                {this.state.load_error ? (
                                    <GridContainer >
                                        <GridItem xs={12}>
                                            <Typography color="error" variant="h1" center fullWidth>
                                                <Icon fontSize="large">error</Icon>
                                            </Typography>
                                        </GridItem>
                                        <GridItem xs={12}>
                                            <Typography color="error" variant="body1" center fullWidth>
                                                An error occured.
												<br />
                                                Status Code : {this.state.load_error.code}
                                                <br />
                                                {this.state.load_error.msg}
                                            </Typography>
                                        </GridItem>
                                    </GridContainer>
                                ) : (
                                        <GridContainer className="p-0 m-0">
                                            <GridItem className="p-0 m-0" xs={12}>
                                                {Array.isArray(this.state.records) && this.state.records.length > 0 ? (
                                                    <GridContainer className="p-0 m-0">
                                                        <GridItem xs={12}>
                                                            <Calendar icon={this.state.defination.icon} title={this.state.defination.label} title_color={this.state.defination.color} icon_color={this.state.defination.color} subtitle="" calendars={this.state.calendars} view="month" schedules={this.state.records} className={classes.calendar} onClickEdit={this.handleEditItem} onClickDelete={this.handleDeleteItemConfirm} />
                                                        </GridItem>

                                                    </GridContainer>
                                                ) : (
                                                        <GridContainer className="p-0 m-0" justify="center" alignItems="center">
                                                            <img alt="Empty list" className={classes.emptyImage} src={EmptyStateImage} />
                                                            <Typography className={classes.emptyText} color="grey" variant="body2" center fullWidth>
                                                                No {this.state.defination.label ? this.state.defination.label : "Records"} found
												</Typography>
                                                        </GridContainer>
                                                    )}

                                            </GridItem>
                                        </GridContainer>
                                    )}
                            </GridContainer>
                        )}
                </GridItem>}
            </GridContainer>
        );
    }
}
TimelineView.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    defination: PropTypes.object.isRequired,
    service: PropTypes.any.isRequired,
    calendarProps: PropTypes.object,
    query: PropTypes.object,
};

TimelineView.defaultProps = {
    calendarProps: {
        height: "900px",
        defaultView: 'month',
        disableDblClick: true,
        disableClick: true,
        isReadOnly: false,
        useDetailPopup: true,
        useCreationPopup: false,
        scheduleView: true,
        taskView: false,
    },
    query: {},
};


const mapStateToProps = state => ({
    auth: state.auth
});


export default withRoot(compose(withStyles(styles), connect(mapStateToProps, { openDialog, closeDialog }))(TimelineView));
