/** @format */
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { Typography } from "@mui/material";
import { TextInput } from "components/FormInputs";
import AutoComplete from "components/AutoComplete";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card";
import GridItem from "components/Grid/GridItem";
import { setPreferences } from "state/actions";
import { useNetworkServices } from "contexts/NetworkServices";
import { useTheme } from '@mui/material/styles';;
import { useSetState } from "hooks";

function Widget (props) {
	let { auth, app: { preferences }, setPreferences } = props;

	const { Api } = useNetworkServices();
	const theme = useTheme();
	const [state, setState] = useSetState({
		alerts: {},
		errors: {},
		loading: {},
	})
	const [alerts, setAlerts] = useState({});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState({});



	const updatePreferences = useCallback(async (name, new_value) => {
			let updatedValue = false;
			if (String.isString(name) && !String.isEmpty(name)) {
				let slug = name.toLowerCase().variablelize("-");
				if (new_value !== preferences[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
						user: auth?.user?._id,
					};
					return await Api.post(`/preferences`, postData, {params: { create: 1, placement: "slug" }}).then(res => {
						let newPreferences = JSON.deepMerge(preferences, { [slug]: new_value });
						setPreferences(newPreferences);
						return newPreferences;
					});
				}
			} else {
				throw {msg : "missing name"};
			}
	}, [preferences])

	const handleOnChange = useCallback((name) => async value => {
		let new_value = { ...preferences?.data, [name]: value };
		setState(prevState => ({
			loading: {...prevState.loading, [name]: true},
			alerts: {...prevState.alerts, [name]: undefined},
			errors: {...prevState.errors, [name]: undefined},
		}))
		updatePreferences("data", new_value).then(updated_prefs => {
			setState(prevState => ({
				loading: {...prevState.loading, [name]: false},
				alerts: {...prevState.alerts, [name]: `${name.humanize()} saved`},
				errors: {...prevState.errors, [name]: undefined},
			}))
		}).catch(e => {
			setState(prevState => ({
				loading: {...prevState.loading, [name]: false},
				alerts: {...prevState.alerts, [name]: undefined},
				errors: {...prevState.errors, [name]: e.msg},
			}))
		});
	}, [preferences]);


	return (
		<Card>
			<GridContainer className="px-2">
				<GridItem xs={ 12 } className="mb-2">
					<Typography variant="h3">Display and Visualization</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={ 12 } className="mb-2">
						<Typography variant="h5">Data</Typography>
					</GridItem>
					<GridItem xs={ 12 } className="mb-2">

						<AutoComplete
							name="pagination"
							label="Records per Page"
							type="number"
							defaultValue={ preferences?.data?.pagination || 10 }
							onChange={ handleOnChange("pagination") }
							helperText={ state.alerts?.pagination }
							disabled={ state.loading?.pagination}
							loading={ state.loading?.pagination}
							error={ state.errors?.pagination }
							options={{
								"5": "5",
								"10": "10",
								"25": "25",
								"50": "50",
								"100": "100",
								"250": "250",
								"500": "500",
								"-1": "All",
							} }
							required
						/>
					</GridItem>

					<GridItem xs={ 12 } className="mb-4">
						<TextInput
							name="defaultMapZoom"
							label="Default Map Zoom"
							type="number"
							defaultValue={ preferences?.data?.defaultMapZoom || 15 }
							onChange={ handleOnChange("defaultMapZoom") }
							helperText={ state.alerts?.defaultMapZoom }
							disabled={ state.loading?.defaultMapZoom}
							error={ state.errors?.defaultMapZoom }
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

export default connect(mapStateToProps, {setPreferences})(React.memo(Widget));
