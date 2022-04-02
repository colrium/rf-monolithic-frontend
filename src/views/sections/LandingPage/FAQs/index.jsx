import React, { useState, useEffect } from "react";


import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Section from "components/Section";
import ProgressIndicator from "components/ProgressIndicator";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import { apiCallRequest, closeDialog, openDialog } from "state/actions";
import { useNetworkServices } from "contexts/NetworkServices"
import compose from "recompose/compose"

const styles = theme => ({
	root: {
		color: theme.palette.text.primary,
		position: "relative",
		padding: 0,
		display: "flex",
		flexDirection: "row",
	},
	title: {
		color: theme.palette.text.secondary,
		textDecoration: "none",
	},
	subtitle: {
		margin: "10px auto 0",
	},
	contentWrapper: {
		maxHeight: "100%",
		overflowY: "auto",
		background: theme.palette.background.surface,
		overflowX: "hidden",
		flex: 1,
	},
	heading: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
	},
})

const SectionComponent = props => {
	const {
		classes,
		auth,
		theme,
		device,
		apiCallRequest,
		closeDialog,
		openDialog,
		cache: {
			data: { posts },
		},
		...rest
	} = props
	const { definations } = useNetworkServices()

	const [records, setRecords] = useState(posts)
	const [openItems, setOpenItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		if (definations) {
			apiCallRequest(definations.posts.name, {
				uri: definations.posts.endpoint,
				type: "records",
				params: { is: "type=faq", asc: "created_on" },
				data: {},
				cache: true,
			})
				.then(res => {
					const { data } = res.body
					if (Array.isArray(data)) {
						setRecords(data)
					}
					setError(false)
					setLoading(false)
				})
				.catch(e => {
					setError(e)
					setLoading(false)
				})
		}
	}, [definations])

	useEffect(() => {}, [posts])

	return (
		<Section className={classes?.root} id="faqs" title="FAQs">
			<GridContainer className={"p-0"}>
				<GridContainer className={"p-0"}>
					{loading && (
						<GridItem xs={12} className={"flex align-center justify-center"}>
							<ProgressIndicator />
						</GridItem>
					)}
					{error && (
						<GridItem xs={12} className={"flex items-center justify-center"}>
							<Typography color="error" variant="subtitle2" paragraph>
								{error.msg}
							</Typography>
						</GridItem>
					)}
					{Array.isArray(records) && (
						<GridItem xs={12} className={"p-0"}>
							{records.map(
								(record, cursor) =>
									record.content &&
									record.type == "faq" && (
										<Accordion>
											<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={record.slug} id={record.slug}>
												<Typography className={classes?.heading}>{cursor + 1 + ". \t " + record.title}</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<Typography> {record.content} </Typography>
											</AccordionDetails>
										</Accordion>
									)
							)}
						</GridItem>
					)}
				</GridContainer>
			</GridContainer>
		</Section>
	)
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	cache: state.cache,
});

export default (
	compose(connect(mapStateToProps, { apiCallRequest, closeDialog, openDialog }), withTheme)(SectionComponent)
);
