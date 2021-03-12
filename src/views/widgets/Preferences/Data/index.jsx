/** @format */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { TextInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card";
import GridItem from "components/Grid/GridItem";
import { useGlobals } from "contexts/Globals";
import { useTheme } from '@material-ui/core/styles';
import { withErrorHandler } from "hoc/ErrorHandler";


function Widget(props) {	
	let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);
	let { app: { preferences } } = state;

	const { updatePreferences } = useGlobals();
	const theme = useTheme();

	let [alerts, setAlerts] = useState({});
	let [errors, setErrors] = useState({});
	let [loading, setLoading] = useState({});

	

	let prefs = preferences.data;
	

	const handleOnChange = (section, name=false) => async value => {
		let new_value = section && name? {...prefs, [section]: { ...prefs[section],  [name]: value }} : {...prefs, [section]: value };

		updatePreferences("data", new_value).then(updated_prefs => {
			setAlerts(section && name? {[section]: {[name]: name + " saved"}} : {[section]: section + " saved"} );
			setErrors(section && name? {[section]: {[name]: undefined }} : { [section]: undefined } );
		}).catch(e => {
			setAlerts(section && name? {[section]: {[name]: undefined }} : {[section]: undefined} );
			setErrors(section && name? {[section]: {[name]: e.msg}} : {[section]: e.msg} );
		});
	};


	return (
	<Card>
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3">Display and Visualization</Typography>
			</GridItem>

			<GridContainer className="px-0">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h5">Data</Typography>
				</GridItem>
				<GridItem xs={12} className="mb-2">
					
					<TextInput
						name="pagination"
						label="Records per Page"
						type="number"
						defaultValue={prefs["pagination"]}
						onChange={handleOnChange("pagination")}
						helperText={alerts["pagination"]}
						disabled={loading["pagination"]}
						error={errors["pagination"]}
						max={100}						
						required
					/>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<TextInput
						name="defaultMapZoom"
						label="Default Map Zoom"
						type="number"
						defaultValue={prefs["defaultMapZoom"]}
						onChange={handleOnChange("defaultMapZoom")}
						helperText={alerts["defaultMapZoom"]}
						disabled={loading["defaultMapZoom"]}
						error={errors["defaultMapZoom"]}
						required
					/>
				</GridItem>
			</GridContainer>

		</GridContainer>
	</Card>
	);
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default withErrorHandler(connect(mapStateToProps, {})(React.memo(Widget)));
