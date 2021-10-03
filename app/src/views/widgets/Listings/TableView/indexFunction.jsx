import React, {memo, useEffect, useState} from "react";
import Chip from "@material-ui/core/Chip";
import withStyles from "@material-ui/core/styles/withStyles";
import EmptyStateImage from "assets/img/empty-state-table.svg";
import Avatar from "components/Avatar";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { formats } from "config/data";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import compose from "recompose/compose";
import ApiService from "services/Api";
import { apiCallRequest, closeDialog, openDialog } from "state/actions";
import { useGlobals } from "contexts/Globals";
import { FilesHelper, ServiceDataHelper, UtilitiesHelper } from "hoc/Helpers";
import { withErrorHandler } from "hoc/ErrorHandler";
import styles from "./styles";

const TableView = (props) => {
	const { classes, defination, service, query, auth, api, cache: { data }  } = props;
	const { definations, sockets } = useGlobals();
	let contextDefination = JSON.isJSON(defination)? defination : definations[defination];
	const {[contextDefination.name] : cachedData } = data;
	
	const [currentDefination, setCurrentDefination] = useState(contextDefination);
	const [currentQuery, setCurrentQuery] = useState(query ? { ...query, p: 1 } : { p: 1 });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [dataTableColumns, setDataTableColumns] = useState([]);
	const [rawData, setRawData] = useState([]);
	const [context, setContext] = useState(null);
	const [actionsView, setActionsView] = useState("contextMenu");
	const [records, setRecords] = useState(Array.isArray(cachedData)? cachedData : []);
	const [mousePosition, setMousePosition] = useState({mouseX: null, mouseY: null});

	useEffect(() => {
		if (Array.isArray(cachedData)) {
			
		}
	}, [cachedData]);

	return (
			<GridContainer className={classes.root}>
				<GridItem className="p-0 m-0" xs={12}>
					{ (api.busy || !(defination.name in cache.res) && this.state.records.length===0 ) && <GridContainer className={classes.full_height} justify="center" alignItems="center">
								<GridItem xs={12} className="flex relative flex-row">
									<div className="flex-grow">
										<Skeleton variant="text" width={150}/>
									</div>
									<div className="flex">
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
									</div>
								</GridItem>
								
								<GridItem xs={12}>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
								</GridItem>
					</GridContainer> }

					{(!api.busy && defination.name in cache.res) && <GridContainer className="p-0 m-0">
						<GridContainer className="p-0 m-0">
							<GridItem className="p-0 m-0" xs={12}>
								{/* this.state.actionsView === "contextMenu" && <Menu											
											open={this.state.mouseY !== null}
											onClose={this.handleOnRowContextMenuClose}
											anchorReference="anchorPosition"
											anchorPosition={ this.state.mouseY !== null && this.state.mouseX !== null? { top: this.state.mouseY, left: this.state.mouseX } : undefined }
										>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Copy</MenuItem>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Print</MenuItem>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Highlight</MenuItem>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Email</MenuItem>
										</Menu> */}

								{defination && 
								Array.isArray(this.state.records) &&
								this.state.records.length > 0 ? (
									<MUIDataTable
										title={
											(api.loading ? "Loading " : "") +
											defination.label +
											(api.loading ? "..." : "")
										}
										data={this.state.records}
										columns={this.state.dt_columns}
										options={table_options}
									/>
								) : (
									<GridContainer
										className="p-0 m-0"
										justify="center"
										alignItems="center"
									>
										<img
											alt="Empty list"
											className={classes.emptyImage}
											src={EmptyStateImage}
										/>
										<Typography
											className={classes.emptyText}
											color="grey"
											variant="body2"
											center
											fullWidth
										>
											No{" "}
											{defination.label
												? defination.label
												: "Records"}{" "}
											found
										</Typography>
									</GridContainer>
								)}
							</GridItem>
						</GridContainer>
						{(api ? api.busy && api.error : false) && (
							<GridContainer>
								<GridItem xs={12}>
									<Typography
										color="error"
										variant="body2"
										center
										fullWidth
									>
										{"An error occured. \n " + api.error.msg +" \n Displaying cached data."}
									</Typography>
								</GridItem>
							</GridContainer>
						)}
					</GridContainer> }
				</GridItem>
			</GridContainer>
	);
}


TableView.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	show_actions: PropTypes.bool,
	show_links: PropTypes.bool,
	query: PropTypes.object,
	cache_data: PropTypes.bool,
	load_data: PropTypes.bool,
	onLoadData: PropTypes.func,
	
};

TableView.defaultProps = {
	show_actions: true,
	show_links: true,
	query: { p: 1 },
	cache_data: true,
	load_data: true,
};

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	cache: state.cache,
	api:state.api,
});

export default compose(
		withStyles(styles),
		connect(mapStateToProps, { openDialog, closeDialog, apiCallRequest })
	)(memo(TableView));
