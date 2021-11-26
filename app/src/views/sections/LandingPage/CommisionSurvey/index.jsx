/** @format */


import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';
import Section from "components/Section";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';


import SignupForm from "views/forms/SignupForm";
import { useGlobals } from "contexts/Globals";
import { closeDialog, openDialog } from "state/actions";
import compose from "recompose/compose";

import ApiService from "services/Api";

const styles = theme => ({


});


const SectionComponent = (props) => {
	const { closeDialog, openDialog, auth } = props;

	const { definations } = useGlobals();

	let [popupMessage, setPopupMessage] = useState(false);


	const handleSignupFormSuccess = () => {
		openDialog({
			title: "Thank you for registering!",
			body: "We will be in touch directly to arrange a time to discuss your project and how we can provide you with the data you need. Realfield Team",
			actions: {
				cancel: {
					text: "OK",
					color: "default",
					onClick: () => closeDialog(),
				},
			},
		});
	}

	useEffect(() => {
		//handleSignupFormSuccess();
	}, []);

	return (
		<Section className={"p-0"} id="commission-a-survey" title={false}>
			<GridContainer
				className={"md:px-32 lg:px-48 py-16"}
				style={{
					backgroundImage: "url(" + ("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/dots-map.png") + ")",
					backgroundRepeat: "no-repeat",
					backgroundAttachment: "scroll",
					backgroundPosition: "right top",
					backgroundSize: "auto 180px",
				}}
			>
				<Hidden smDown className="w-full flex">
					<GridItem
						xs={12}
						className={"flex flex-row items-center"}
					>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/chevron-white.svg")} className={"mr-4 h-8 w-8"} />
						<Typography variant="h4" className={"capitalize"} >
							COMMISSION A
						</Typography>

						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo.svg")} className={"mx-4 h-6 w-auto"} />

						<Typography variant="h4" className={"capitalize"}>
							SURVEY
						</Typography>
					</GridItem>
				</Hidden>

				<Hidden mdUp className="w-full flex">
					<GridItem
						xs={12}
						className={"flex flex-col items-center justify-center"}
					>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/chevron-white.svg")} className={"mb-4 h-8 w-8"} />
						<Typography variant="h4" className={"capitalize"} >
							COMMISSION A
						</Typography>

						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo.svg")} className={"my-4 h-6 w-auto"} />

						<Typography variant="h4" className={"capitalize"}>
							SURVEY
						</Typography>
					</GridItem>
				</Hidden>
				<GridItem xs={12} className={"px-2"}>
					<Typography variant="body1" paragraph className="font-bold">
						Data is the essential fuel required to power robust, evidence based analysis and decision making.
					</Typography>

					<Typography variant="body1" paragraph gutterBottom>
						Use the right data and get the analysis and insights you need. Use the wrong data and not only will your results be skewed rendering your analysis inaccurate, but you risk your project being on the wrong side of existing and future regulation and legislation. Garbage in, garbage out – it’s that simple. At Realfield we are dedicated to providing accurate, consistent, relevant and most importantly, ethical data. Real time.
					</Typography>

					<Typography variant="body1" paragraph gutterBottom>
						Let us provide you with the right data to power your research and your insights.
					</Typography>
				</GridItem>

			</GridContainer>
			{/* <GridContainer className={"p-0 md:px-32 lg:px-48 md:py-6"}>
				<GridItem xs={12} className={"py-1"}>
					<Typography variant="h3" color="textSecondary">
						Sign up to start
					</Typography>
				</GridItem>

				<GridItem xs={12} className={"py-0"}>
					<Typography variant="body2">
						To start your project or schedule a demo, please complete the following sign up form.
					</Typography>
				</GridItem>

				<GridItem xs={12} className={"py-1 px-0"}>
					<SignupForm
						onSignupSuccess={handleSignupFormSuccess}
						role={"customer"}
						title={""}
					/>
				</GridItem>
			</GridContainer> */}

		</Section>
	);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default (
	compose(connect(mapStateToProps, { closeDialog, openDialog }), withTheme)(SectionComponent)
);
