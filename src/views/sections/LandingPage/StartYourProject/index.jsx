/** @format */


import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import ScrollBars from "components/ScrollBars";
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import IconButton from '@mui/material/IconButton';
import ApiService from "services/Api";
import compose from "recompose/compose";


const styles = theme => ({
	root: {
		color: theme.palette.text.primary,
		position: "relative",
		padding: 0,
		height: "100vh",
		maxHeight: "100vh",
		display: "flex",
		flexDirection: "row",
	},
	stepperWrapper: {
		maxHeight: "100%",
		overflowY: "auto",
		overflowX: "hidden",
		background: theme.palette.secondary.main,
		flex: 2,
	},
	stageWrapper: {
		maxHeight: "100%",
		overflowY: "auto",
		background: theme.palette.divider,
		overflowX: "hidden",
		flex: 10,
	},
	title: {
		color: theme.palette.text.secondary,
		textDecoration: "none",
	},
	subtitle: {
		margin: "10px auto 0",
	},

});

function ChevronIcon(props) {
	const { active, completed, ...rest } = props;

	return (
		<IconButton>
			<img src={active ? ("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/chevron-black.svg") : ("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/chevron-white.svg")} style={{ width: 24, height: 24, transform: "rotate(90)" }} />
		</IconButton>
	);
}

const SectionComponent = (props) => {
	const { classes, auth, theme, device, ...rest } = props;
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<Section className={classes?.root} id="start-your-project">
			<ScrollBars className={classes?.stepperWrapper}>
				<GridContainer className={"md:px-2 "}>
					<Stepper activeStep={activeStep} orientation="vertical" style={{ background: "transparent" }} connector={<div />} >
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel StepIconComponent={ChevronIcon} onClick={() => setActiveStep(index)} />
							</Step>
						))}
					</Stepper>
				</GridContainer>
			</ScrollBars>
			<ScrollBars className={classes?.stageWrapper}>
				<GridContainer className={"p-0"}>
					<GridContainer className={"p-0 accent md:px-6  md:py-6"}>
						<GridItem xs={12} className={"flex flex-row items-center"}>
							<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/chevron-white.svg")} className={"mr-4 h-10 w-10"} />
							<Typography variant="h1">
								Commission a Realfield Survey
							</Typography>
						</GridItem>

						<GridItem xs={12} className={"flex-1"}>
							<Typography variant="body1">
								We know that data is not only a precious resource in today's digital age, but it also drives key decision making in almost every field.
								We therefore take evry step to ensure the data you get is as authentic as possible, reliable and collected as per your exact specifications. Our guarantee to you is REAL and UNTAINTED responses to your questions, collected and delivered to you in a professional and timely manner.
							</Typography>
						</GridItem>

					</GridContainer>
					<GridContainer className={"p-0"}>
						<GridItem xs={12} className={"md:px-6 py-8"}>
							<Typography variant="h2">
								Start your Project
							</Typography>




						</GridItem>
					</GridContainer>
				</GridContainer>
			</ScrollBars>

		</Section>
	);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default (
	compose(connect(mapStateToProps, {}), withTheme)(SectionComponent)
);
