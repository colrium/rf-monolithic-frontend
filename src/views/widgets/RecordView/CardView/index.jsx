/**
 * /* eslint-disable no-mixed-spaces-and-tabs
 *
 * @format
 */

import Card from "components/Card";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
//import Typography from "components/Typography";
import { formats } from "config/data";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { ServiceDataHelper } from "utils/Helpers";
import JSONView from "components/JSONView";
import { Typography } from "@mui/material";



function CardView({ ...props }) {
	const [expanded, setExpanded] = React.useState(true);
	const { record, defination, auth } = props;

	let resolvedRefRecord = {};

	if (typeof defination.views.single.cardview.resolveData === "function") {
		resolvedRefRecord = defination.views.single.cardview.resolveData(
			record,
			auth.user,
			true
		);
		if (!JSON.isJSON(resolvedRefRecord)) {
			resolvedRefRecord = {};
		}
		resolvedRefRecord.resolver = "defination";
	} else {
		resolvedRefRecord = ServiceDataHelper.resolveReferenceColumnsDisplays(
			[record],
			defination.scope.columns,
			auth.user
		)[0];
		if (!JSON.isJSON(resolvedRefRecord)) {
			resolvedRefRecord = {};
		}

		resolvedRefRecord.resolver = "helper";
	}

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	function resolveAvatar() {
		let avatar = null;
		if (resolvedRefRecord.resolver === "defination") {
			avatar = resolvedRefRecord.avatar;
		}
		/* else if (resolvedRefRecord.resolver === "helper") {
		} */

		return avatar;
	}

	function resolveTitle() {
		let title = "";
		if (resolvedRefRecord.resolver === "defination") {
			title = resolvedRefRecord.title;
		} else if (resolvedRefRecord.resolver === "helper") {
			let primaries = defination.scope.identity.primary;
			for (var i = 0; i < primaries.length; i++) {
				title +=
					defination.scope.columns[primaries[i]]?.reference &&
						resolvedRefRecord[primaries[i]]
						? resolvedRefRecord[primaries[i]].resolve
						: resolvedRefRecord[primaries[i]];
			}
		}

		return title;
	}

	function resolveSubTitle() {
		let subtitle = "";
		if (resolvedRefRecord.resolver === "defination") {
			subtitle = resolvedRefRecord.subtitle;
		} else if (resolvedRefRecord.resolver === "helper") {
			let secondaries = defination.scope.identity.secondary;
			for (var i = 0; i < secondaries.length; i++) {
				subtitle += defination.scope.columns[secondaries[i]]?.reference &&
					resolvedRefRecord[secondaries[i]]
					? resolvedRefRecord[secondaries[i]].resolve
					: resolvedRefRecord[secondaries[i]];
			}
		}

		return subtitle;
	}

	function resolveDisplayValue(name) {
		if (
			defination.scope.columns[name].reference &&
			resolvedRefRecord[name]
		) {
			if (Array.isArray(resolvedRefRecord[name])) {
				return (
					<React.Fragment>
						{resolvedRefRecord[name].map((entry, index) => (
							<Typography


								key={name + "-" + index}
							>
								{entry.resolve}
							</Typography>
						))}
					</React.Fragment>
				);
			} else {
				return (
					<Typography  >
						{resolvedRefRecord[name].resolve}
					</Typography>
				);
			}
		} else {
			if (Array.isArray(resolvedRefRecord[name])) {
				return (
					<React.Fragment>
						{resolvedRefRecord[name].map((entry, index) => (
							<Typography

								key={name + "-" + index}
							>
								{entry}
							</Typography>
						))}
					</React.Fragment>
				);
			} else if (!JSON.isJSON(resolvedRefRecord[name])) {
				if (
					defination.scope.columns[name].input.type === "date" ||
					defination.scope.columns[name].input.type === "datetime"
				) {
					if (defination.scope.columns[name].input.type === "date") {
						return (
							<Typography className="pl-4">
								{resolvedRefRecord[name]
									? new Date(resolvedRefRecord[name]).format(
										formats.dateformats.date
									)
									: ""}
							</Typography>
						);
					} else {
						return (
							<Typography >
								{resolvedRefRecord[name]
									? new Date(resolvedRefRecord[name]).format(
										formats.dateformats.datetime
									)
									: ""}
							</Typography>
						);
					}
				} else if (defination.scope.columns[name].type === "boolean") {
					return (
						<Typography >
							{resolvedRefRecord[name] ? "Yes" : "No"}
						</Typography>
					);
				} else {
					return (
						<Typography >
							{resolvedRefRecord[name]
								? resolvedRefRecord[name]
								: ""}
						</Typography>
					);
				}
			} else {
				return (
					<Typography  >
						{JSON.stringify(resolvedRefRecord[name])}
					</Typography>
				);
			}
		}
	}

	function resolveValue() {
		let body = "";
		if (resolvedRefRecord.resolver === "defination") {
			body = resolvedRefRecord.body;
		} else if (resolvedRefRecord.resolver === "helper") {
			body = (
				<GridContainer className="p-0 m-0">
					{Object.entries(defination.scope.columns).map(
						([name, column], index) =>
							column.restricted && Function.isFunction() ? (
								!column.restricted.display(
									record,
									auth.user
								) && (
									<GridContainer
										className="pl-4 m-0"
										key={index}
									>
										<GridItem xs={12} className="py-0">
											<Typography variant={"body2"} color="grey">
												{column.label}
											</Typography>
										</GridItem>

										<GridItem xs={12} className="py-0">
											{resolveDisplayValue(name)}
										</GridItem>
									</GridContainer>
								)
							) : (
								<GridContainer className="pl-4 m-0" key={index}>
									<GridItem xs={12} className="py-0">
										<Typography variant={"body2"} color="grey">
											{column.label}
										</Typography>
									</GridItem>

									<GridItem xs={12} className="py-0">
										{resolveDisplayValue(name)}
									</GridItem>
								</GridContainer>
							)
					)}
				</GridContainer>
			);
		}

		return body;
	}

	return defination && record ? (
		<Card elevation={0} outlineColor="#CCCCCC">
			<CardHeader
				avatar={resolveAvatar()}
				title={resolveTitle()}
				subheader={resolveSubTitle()}
			/>

			{/* <CardContent className="p-0 m-0">{resolveValue()}</CardContent> */}
			<CardContent className="p-0 m-0 overflow-auto"><JSONView src={record} humanize/></CardContent>
		</Card>
	) : (
		<GridContainer />
	);
}/**/

CardView.propTypes = {
	className: PropTypes.string,
	record: PropTypes.object.isRequired,
	defination: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {})(CardView);
