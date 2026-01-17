import React, { useEffect, useState } from "react";
import { connect } from "react-redux"

import Typography from "@mui/material/Typography"
import { TextInput, RadioInput } from "components/FormInputs"
import Grid from '@mui/material/Grid'


function Widget(props) {
	return (
		<Grid container className="px-2">
			<Grid item  xs={12} className="mb-2">
				<Typography variant="h3"> General settings</Typography>
			</Grid>

			{/* <Grid item  xs={12}>
				<TextInput
					name="seo-title"
					label="SEO title"
					type="text"
					defaultValue={context_settings["seo-title"]}
					onBlur={handleOnChange("seo-title")}
					helperText={alerts["seo-title"]}
					loading={loading["seo-title"]}
					error={errors["seo-title"]}
					required
				/>
			</Grid>

			<Grid item  xs={12}>
				<TextInput
					name="seo-tagline"
					label="SEO tagline"
					type="text"
					multiline
					rows="6"
					defaultValue={context_settings["seo-tagline"]}
					onBlur={handleOnChange("seo-tagline")}
					helperText={alerts["seo-tagline"]}
					loading={loading["seo-tagline"]}
					error={errors["seo-tagline"]}
					required
				/>
			</Grid>

			<Grid item  xs={12}>
				<TextInput
					name="copyright"
					label="Copyright"
					type="text"
					defaultValue={context_settings["copyright"]}
					onBlur={handleOnChange("copyright")}
					helperText={alerts["copyright"]}
					loading={loading["copyright"]}
					error={errors["copyright"]}
					required
				/>
			</Grid>

			<Grid item  xs={12}>
				<TextInput
					name="trademark"
					label="Trademark"
					type="text"
					defaultValue={context_settings["trademark"]}
					onBlur={handleOnChange("trademark")}
					helperText={alerts["trademark"]}
					loading={loading["trademark"]}
					error={errors["trademark"]}
					required
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<RadioInput
					name="landing-page-routing"
					label="Landing page routing"
					defaultValue={context_settings["landing-page-routing"]}
					onChange={handleOnChange("landing-page-routing")}
					helperText={alerts["landing-page-routing"]}
					options={{ "sections": "Sections", "pages": "Pages" }}
					disabled={loading["landing-page-routing"]}
					error={errors["landing-page-routing"]}
					required
				/>
			</Grid> */}
		</Grid>
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
