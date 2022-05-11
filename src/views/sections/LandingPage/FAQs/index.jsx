import React, { useState, useEffect } from "react";


import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import ProgressIndicator from "components/ProgressIndicator";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import { closeDialog, openDialog } from "state/actions"
import { useNetworkServices } from "contexts/NetworkServices"
import compose from "recompose/compose"
import { useSetState } from "hooks"
import { createStyles, makeStyles } from "@mui/styles"

const useStyles = makeStyles(theme =>
	createStyles({
		root: {
			color: theme.palette.text.primary,
			position: "relative",
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
)

const SectionComponent = props => {
	const { auth, theme, device, apiCallRequest, closeDialog, openDialog, ...rest } = props
	const { Api } = useNetworkServices()
	const classes = useStyles()
	const [state, setState] = useSetState({
		records: [],
		loading: true,
		error: false,
	})
	const [records, setRecords] = useState([])
	const [openItems, setOpenItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		Api.get("/posts", {
			params: { is: "type=faq", sort: "created_on", pagination: "-1" },
		})
			.then(res => {
				const { data } = { ...res?.body }

				setState({
					records: Array.isArray(data) ? data : [],
					loading: false,
					error: false,
				})
			})
			.catch(e => {
				setState({
					loading: false,
					error: e,
				})
			})
	}, [])

	return (
		<Section className={`${classes.root} mb-16`} id="faqs" title="FAQs">

			<Grid container className={"p-0"}>
				<Grid container className={"p-0"}>
					{state.loading && (
						<Grid item  xs={12} className={"flex items-center flex-col justify-center"}>
							<ProgressIndicator />
							<Typography color="text.secondary" variant="subtitle2" paragraph>
								Loading...
							</Typography>
						</Grid>
					)}
					{state.error && (
						<Grid item  xs={12} className={"flex items-center justify-center"}>
							<Typography color="error" variant="subtitle2" paragraph>
								{state.error.msg}
							</Typography>
						</Grid>
					)}

					<Grid item  xs={12} className={"p-0"}>
						{state.records.map(
							(record, cursor) =>
								record.content &&
								record.type == "faq" && (
									<Accordion key={`faq-${cursor}`}>
										<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={record.slug} id={record.slug}>
											<Typography className={classes?.heading}>{cursor + 1 + ". \t " + record.title}</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography> {record.content} </Typography>
										</AccordionDetails>
									</Accordion>
								)
						)}
					</Grid>
				</Grid>
			</Grid>
		</Section>
	)
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
})

export default compose(connect(mapStateToProps, { closeDialog, openDialog }), withTheme)(SectionComponent)
