/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { setDashboardAppBarDisplayed, setDashboardDrawerDisplayed, setDashboardFooterDisplayed } from "state/actions";
import {useGooglePlaces, useGeolocation} from "hooks";
import {GooglePlacesAutocomplete} from "components/FormInputs";
import * as definations from "definations";
import * as services from "services";


const Page = (props) => {
	const { componentProps, classes, setDashboardAppBarDisplayed, setDashboardDrawerDisplayed, setDashboardFooterDisplayed, } = props;

	const [query, setQuery] = useState({});
	const [context, setContext] = useState(undefined);
	const [defination, setDefination] = useState(undefined);
	const [service, setService] = useState(undefined);
	/*const geolocation = useGeolocation();
	const googlePlaces = useGooglePlaces();

	useEffect(() => {
		if (geolocation && googlePlaces.geocode) {
			googlePlaces.geocode({location: geolocation}, "administrative_area_level_2", {short_name: true, evaluation: "modeValueOnly"}).then(res => {
				console.log("googlePlaces.geocode res", res)
			})
		}
		
	}, [geolocation]);*/
	

	useEffect(() => {
		document.title = app.title("Page Builder");
		setContext(componentProps.context);
		setDefination(definations[componentProps.context]);
		setContext(services[componentProps.context]);
		let urlQuery = (window.location.search.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []).reduce(function(result, each, n, every) {
			let [key, value] = decodeURI(each).split("=");
			result[key] = value;
			return result;
		}, {});
		setQuery({...urlQuery});
	}, []);

	useEffect(() => {
		setDashboardAppBarDisplayed(Boolean(query.layout) || Boolean(query.header));
		setDashboardDrawerDisplayed(Boolean(query.layout) || Boolean(query.drawer));
		setDashboardFooterDisplayed(Boolean(query.layout) || Boolean(query.footer));

		return () => {
			setDashboardAppBarDisplayed(true);
			setDashboardDrawerDisplayed(true);
			setDashboardFooterDisplayed(true);
		}
	}, [query]);

	

		return (
			<GridContainer className="m-0 p-0">
				<GridItem xs={12}>
					<GooglePlacesAutocomplete
								variant="outlined"
								margin="dense"
					/>
				</GridItem>
			</GridContainer>
		);
	
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(
		connect(mapStateToProps, {
			setDashboardAppBarDisplayed,
			setDashboardDrawerDisplayed,
			setDashboardFooterDisplayed,
		})
	)(Page);
