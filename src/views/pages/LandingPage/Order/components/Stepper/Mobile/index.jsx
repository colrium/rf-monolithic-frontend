/** @format */

import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import React from "react";


function MobileSteps(props) {
	const { direction, steps, step, backText, nextText } = props;
	const [activeStep, setActiveStep] = React.useState(step);

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	return (
		<MobileStepper
			variant="dots"
			steps={steps}
			position="static"
			activeStep={activeStep}
			className="flex-grow min-w-full"
			nextButton={
				<Button
					color={activeStep === steps ? "grey" : "primary"}
					onClick={handleNext}
					disabled={activeStep === steps}

				>
					{nextText}
					{direction === "rtl" ? (
						<KeyboardArrowLeft />
					) : (
						<KeyboardArrowRight />
					)}
				</Button>
			}
			backButton={
				<Button
					color={activeStep === 0 ? "grey" : "primary"}
					onClick={handleBack}
					disabled={activeStep === 0}

				>
					{direction === "rtl" ? (
						<KeyboardArrowRight />
					) : (
						<KeyboardArrowLeft />
					)}
					{backText}
				</Button>
			}
		/>
	);
}

MobileSteps.defaultProps = {
	direction: "ltr",
	backText: "Back",
	nextText: "Next",
	steps: 1,
	step: 0,
};

export default MobileSteps;
