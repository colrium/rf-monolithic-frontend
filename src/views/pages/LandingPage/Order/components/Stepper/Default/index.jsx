/** @format */

import IconButton from "@mui/material/IconButton";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import ArrowDown from "@mui/icons-material/ArrowDownward";
import ArrowUp from "@mui/icons-material/ArrowUpward";
import Check from "@mui/icons-material/Check";
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";



function StepIcon(props) {
	const [currentProps, setCurrentProps] = useState(props);

	useEffect(() => {
		setCurrentProps(props);
	}, [props]);

	const { active, completed, color, activeColor } = currentProps;
	return (
		<div className={(active ? activeColor : color) + "+text"}>
			{active ? (
				<div className={"w-4 h-4 rounded-full " + activeColor} />
			) : completed ? (
				<Check />
			) : (
				<div className={"w-2 h-2 ml-1 rounded-full " + color} />
			)}
		</div>
	);
}

/*StepIcon.propTypes = {
	active: PropTypes.bool,
	completed: PropTypes.bool,
};*/

function DefaultStepper(props) {
	let [direction, setDirection] = React.useState(props.direction);
	let [steps, setSteps] = React.useState(props.steps);
	let [step, setStep] = React.useState(props.step);
	let [color, setColor] = React.useState(props.color);
	let [activeColor, setActiveColor] = React.useState(props.activeColor);
	let [onStep, setOnStep] = React.useState(props.onStep);
	let [controlled, setControlled] = React.useState(props.controlled);
	let [completed, setCompleted] = React.useState(props.completed);

	useEffect(() => {
		setDirection(props.direction);
		setSteps(props.steps);
		setStep(props.step);
		setColor(props.color);
		setActiveColor(props.activeColor);
		setOnStep(props.onStep);
		setControlled(props.controlled);
		setCompleted(props.completed);
	}, [props]);

	const handleNext = () => {
		if (Function.isFunction(onStep)) {
			onStep(step, step + 1);
		}
		setStep(prev_step => prev_step + 1);
	};

	const handleBack = () => {
		if (Function.isFunction(onStep)) {
			onStep(step, step - 1);
		}
		setStep(prev_step => prev_step - 1);
	};

	const handleReset = () => {
		if (Function.isFunction(onStep)) {
			onStep(step, 0);
		}
		setStep(0);
	};

	return (
		<div className="min-w-full">
			{!controlled && (
				<div className="w-full relative">
					<IconButton
						className={
							step === 0
								? "center_horizontally opacity-0"
								: activeColor +
								"_text opacity-100 center_horizontally"
						}
						onClick={handleBack}
						disabled={step === 0}
					>
						<ArrowUp />
					</IconButton>
				</div>
			)}
			<Stepper
				className="bg-transparent"
				activeStep={step}
				orientation="vertical"
				connector={<div className="h-8" />}
			>
				{Object.entries(steps).map(([key, label], index) => (
					<Step key={key} className="bg-transparent">
						<StepLabel
							StepIconComponent={StepIcon}
							StepIconProps={{
								color: color,
								activeColor: activeColor,
							}}
						>
							<Typography
								className={
									step === index
										? activeColor + "_text"
										: color + "_text"
								}
							>
								{label}
							</Typography>
						</StepLabel>
					</Step>
				))}
			</Stepper>
			{!controlled && (
				<div className="w-full relative">
					<IconButton
						className={
							(step === Object.size(steps)) === 0
								? "center_horizontally"
								: activeColor + "_text center_horizontally"
						}
						onClick={handleNext}
						disabled={step === Object.size(steps)}
					>
						<ArrowDown />
					</IconButton>
				</div>
			)}
		</div>
	);
}

DefaultStepper.defaultProps = {
	color: "inverse",
	activeColor: "inverse",
	steps: {},
	completed: [],
	step: 0,
	controlled: true,
};

export default DefaultStepper;
