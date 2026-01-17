import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux"

import Typography from "@mui/material/Typography"
import { TextInput } from "components/FormInputs"
import Grid from '@mui/material/Grid'


const socialMedias = {
	facebook: "Facebook",
	twitter: "Twitter",
	instagram: "Instagram",
	youtube: "Youtube",
	linkedin: "LinkedIn",
	whatsapp: "Whatsapp",
	google_plus: "Google+",
	pinterest: "Pinterest",
}

function Widget(props) {
	return (
		<Grid container className="px-2">
			<Grid item  xs={12} className="mb-2">
				<Typography variant="h3"> Social media</Typography>
			</Grid>

			{/*Object.entries(socialMedias).map(([key, value], index) => (
				<Grid item  xs={12} className="mb-4" key={"social-" + index}>
					<TextInput
						name={key}
						label={value}
						type="text"
						defaultValue={context_settings[key]}
						onBlur={handleOnChange(key)}
						helperText={alerts[key]}
						disabled={loading[key]}
						error={errors[key]}
					/>
				</Grid>
			))*/}
		</Grid>
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
