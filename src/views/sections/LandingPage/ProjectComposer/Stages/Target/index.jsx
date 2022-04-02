/*global google*/
import React, { useCallback, useRef } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import GoogleMap from "components/GoogleMap";
import { Button, Chip, Typography } from "@mui/material";
import {
    TextInput,
    DateInput,
    DateTimeInput,
    SelectInput,
    MapInput,
    GooglePlacesAutocomplete
} from "components/FormInputs";
import { useSetState, useDidUpdate } from "hooks";
import { accentColor } from "config";



const Stage = (props) => {
    const { onFieldChange, onSubmit, values, title, description } = props;
    const [state, setState] = useSetState({
        invalid: true,
        level: 0,
        loading: false,
        geojsons: []
    });

    const googleMap = useRef(null)
    const googleMapInfoWindow = useRef(new google.maps.InfoWindow());
    // const googleMapLevel0Data = useRef(new google.maps.Data())
    // const googleMapLevel1Data = useRef(new google.maps.Data())
    // const googleMapLevel2Data = useRef(new google.maps.Data())
    // const googleMapLevel3Data = useRef(new google.maps.Data())

    const [internalValues, setInternalValues] = useSetState({ features: [], ...values });

    const getFeatureLatitudesLongitudes = (coords) => {
        let latitudes = [];
        let longitudes = [];
        console.log("coords", coords)
        for (var i = 0; i < coords.length; i++) {
            if (Array.isArray(coords[i]) && Array.isArray(coords[i][0])) {
                for (var j = 0; j < coords[i][j]; j++) {
                    let coordinates = getFeatureLatitudesLongitudes(coords[i][j]);
                    latitudes = [...latitudes, ...coordinates[0]];
                    longitudes = [...longitudes, ...coordinates[1]];
                }
            }
            else {
                latitudes.push(coords[i][0])
                longitudes.push(coords[i][1])
            }
        }
        return [latitudes, longitudes];
    };

    const getFeatureBounds = useCallback((feature) => {
        let featureBounds = new google.maps.LatLngBounds();

        let latitudes = [];
        let longitudes = [];
        feature.getGeometry().forEachLatLng(function (latlng) {
            latitudes.push(latlng.lat());
            longitudes.push(latlng.lng());
        });

        let maxLat = Math.max.apply(null, latitudes.map(function (d) { return d; }));
        let maxLng = Math.max.apply(null, longitudes.map(function (d) { return d; }));
        let minLat = Math.min.apply(null, latitudes.map(function (d) { return d; }));
        let minLng = Math.min.apply(null, longitudes.map(function (d) { return d; }));

        featureBounds.extend({ lat: minLat, lng: minLng })
        featureBounds.extend({ lat: maxLat, lng: maxLng })
        return featureBounds;
    }, []);

    const getFeatureCenterCoordinates = useCallback((feature) => {
        let geatureBonds = getFeatureBounds(feature)
        let featureCenter = geatureBonds.getCenter();
        return featureCenter;
    }, []);

    const handleOnChange = useCallback((name) => (value) => {
        setInternalValues({ [name]: value });
        if (Function.isFunction(onFieldChange)) {
            onFieldChange(name, value)
        }
    }, []);




    const handleOnSubmit = useCallback(() => {
        if (Function.isFunction(onSubmit)) {
            onSubmit(internalValues);
        }
    }, [internalValues]);



    const featureDrilldown = useCallback(Function.debounce((feature) => {
        let featureLevel = feature.getProperty("level");
        let featureType = feature.getProperty("type");
        let featureName = feature.getProperty(("admin_level_" + featureLevel));




        // console.log("handleOnDoubleClickFeature featureLevel", featureLevel, "featureType", featureType, "admin_level_0", admin_level_0, "admin_level_1", admin_level_1, "admin_level_2", admin_level_2, "admin_level_3", admin_level_3)

        if (googleMap.current) {
            let eventFeatureBounds = getFeatureBounds(feature);
            googleMap.current.fitBounds(eventFeatureBounds)

            let nextLevelUri = "/public/maps/geojson";
            for (let i = 0; i < (featureLevel + 1); i++) {
                let levelName = feature.getProperty(("admin_level_" + i))
                if (!String.isEmpty(levelName)) {
                    console.log("level ", i, levelName)
                    nextLevelUri = nextLevelUri + ("/" + String.capitalize(levelName))
                }


            }
            let nextLevelFeatureUri = nextLevelUri + "/feature.geojson";
            let nextLevelFeaturesUri = nextLevelUri + (featureLevel === 3 ? ("/feature.geojson") : ("/features.geojson"));
            let nextLevelFeatureUrl = new URL(("http://api.realfield.workspace" + nextLevelFeaturesUri));

            //console.log("nextLevelFeatureUri ", nextLevelFeatureUri)

            setState({ loading: true, level: featureLevel })
            fetch(nextLevelFeatureUrl).then(res => res.json()).then(geojson => {
                console.log(nextLevelFeatureUrl, "geojson", geojson);
                googleMap.current.data.forEach((featureEntry) => {
                    // feature.setProperty("isFocused", false)
                    let featureEntryLevel = featureEntry.getProperty("level")
                    let featureEntryName = featureEntry.getProperty(("admin_level_" + featureEntryLevel))
                    let isSelected = featureEntry.getProperty("isSelected")
                    if (!isSelected && featureEntryName !== featureName) {
                        featureEntry.setProperty("isFocused", false);
                        //googleMap.current.data.remove(featureEntry);
                    }
                    else if (featureEntryName !== featureName) {
                        featureEntry.setProperty("isFocused", true);
                    }

                });
                let nextLevelFeature = googleMap.current.data.addGeoJson(geojson);


            }).catch(err => {
                console.error(err);
            }).finally(() => setState({ loading: false }));
        }
    }, 250), [state.level]);

    const toggleFeatureIsSelected = useCallback(Function.debounce((feature) => {
        let featureLevel = feature.getProperty("level");
        let fetureLevelKey = `admin_level_${ featureLevel }`;
        let featureName = feature.getProperty(fetureLevelKey);
        let isSelected = !(feature.getProperty("isSelected"));
        feature.setProperty('isSelected', isSelected);

        feature.toGeoJson((geojson) => {
            console.log("featureName", featureName)
            setState(prevState => ({
                geojsons: isSelected ? prevState.geojsons.concat([geojson]) : prevState.geojsons.filter(entry => (entry.properties.level !== featureLevel && featureName !== entry.properties[fetureLevelKey]))
            }))
        })



    }, 250), []);

    const handleOnClickFeature = useCallback(Function.debounce((event) => {
        // let featureName = (event.feature.getProperty(featureNameProp) || "");
        // featureName = featureName.charAt(0).toUpperCase() + featureName.slice(1);
        if (event.domEvent.ctrlKey || event.domEvent.ctrlKey) {
            toggleFeatureIsSelected(event.feature)
        }
        else {
            featureDrilldown(event.feature);
        }


    }, 250), [internalValues, state.level]);

    const handleOnDoubleClickFeature = useCallback(Function.debounce((event) => {
        let featureLevel = event.feature.getProperty("level");
        setState(prevState => ({ level: featureLevel }))
        //toggleFeatureIsSelected(event.feature);
    }, 250), []);

    const handleOnFeatureMouseover = useCallback((event) => {
        if (googleMap.current) {
            let isSelected = event.feature.getProperty("isSelected")
            let featureLevel = event.feature.getProperty("level")
            let featureType = event.feature.getProperty("type")
            let featureName = event.feature.getProperty(("admin_level_" + featureLevel));
            let parentFeaturesNames = []
            let parentFeaturesNamesHTML = `<span class="grey-text"> World </span>`
            for (let i = 0; i < featureLevel; i++) {
                let parentFeatureName = event.feature.getProperty(("admin_level_" + i));
                if (!String.isEmpty(parentFeatureName)) {
                    parentFeaturesNames.push(parentFeatureName);
                    parentFeaturesNamesHTML = parentFeaturesNamesHTML + ` <span class="w-2 h-2 rounded default-text">-</span><span class="secondary-text ml-1">  ${ parentFeatureName }</span>`
                }
            }
            let featureCenter = getFeatureCenterCoordinates(event.feature)
            //console.log("handleOnFeatureMouseover event", event)
            if ((featureLevel >= state.level || state.level === 0)) {
                event.feature.setProperty("isFocused", true);
                googleMapInfoWindow.current.setContent(`<div class="infowindow ">
                    ${ parentFeaturesNamesHTML }
                    <span class="w-2 h-2 rounded default-text">-</span>
                    <span class="default-text">${ featureType }</span>
                    <h3 class="primary-text">${ featureName }</h3>
                    <i>Latitude: ${ featureCenter.lat().toFixed(3) } Longitude: ${ featureCenter.lng().toFixed(3) }</i>
                </div>`);
                //googleMapInfoWindow.current.setPosition(featureCenter);
                googleMapInfoWindow.current.setPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                googleMapInfoWindow.current.setOptions({ pixelOffset: new google.maps.Size(0, 10) });

                googleMapInfoWindow.current.open(googleMap.current);
            }


        }

    }, [state.level]);

    const handleOnFeatureMouseout = useCallback((event) => {
        if (googleMap.current) {
            // googleMap.current.data.revertStyle();
            let featureLevel = event.feature.getProperty("level")
            let isSelected = event.feature.getProperty("isSelected")
            if (!isSelected && featureLevel >= state.level) {
                event.feature.setProperty("isFocused", false)
            }
            googleMapInfoWindow.current.close()
        }

    }, [state.level]);

    const applySelections = useCallback((featureNameProp) => {
        if (!!googleMap.current) {
            let levelValue = internalValues[("admin_level_" + state.level)] || [];

            googleMap.current.data.forEach(feature => {
                let featureName = (feature.getProperty(featureNameProp) || "");
                featureName = featureName.charAt(0).toUpperCase() + featureName.slice(1);
                let isSelected = (feature.getProperty("isSelected")) || levelValue.includes(featureName);
                feature.setProperty('isSelected', isSelected);
            })
        }
    }, [internalValues, state.level])

    const handleOnFeatureAdd = useCallback((event) => {
        if (!!googleMap.current) {
            let featureLevel = event.feature.getProperty("level")
            googleMap.current.data.overrideStyle(event.feature, { zIndex: ++featureLevel });
        }
    }, [googleMap.current]);

    const handleOnMapLoad = useCallback((googlemap) => {
        googleMap.current = googlemap;
        if (googleMap.current) {
            googleMap.current.data.loadGeoJson("http://api.realfield.workspace/public/maps/geojson/features.geojson");
            // googlemap.data.setStyle({
            //     fillColor: accentColor,
            //     strokeColor: accentColor,
            //     strokeWeight: 1,
            //     fillOpacity: 0.4
            // });

            googleMap.current.data.setStyle(function (feature) {
                let color = 'gray';
                let strokeWeight = 0.5;
                let strokeColor = 'gray';
                let fillOpacity = 0;

                if (feature.getProperty('isFocused')) {
                    color = 'gray';
                    strokeColor = '#000000';
                    strokeWeight = 1.5;
                    fillOpacity = 0.1
                }

                if (feature.getProperty('isSelected')) {
                    color = accentColor;
                    strokeColor = accentColor;
                    strokeWeight = 2;
                    fillOpacity = 0.9
                }
                return ({
                    fillColor: color,
                    strokeColor: strokeColor,
                    strokeWeight: strokeWeight,
                    fillOpacity: fillOpacity,
                });
            });
            googlemap.data.addListener('dblclick', handleOnDoubleClickFeature);
            googleMap.current.data.addListener('click', handleOnClickFeature);
            googleMap.current.data.addListener('mouseover', handleOnFeatureMouseover);
            googleMap.current.data.addListener('mouseout', handleOnFeatureMouseout);
            googleMap.current.data.addListener('addfeature', handleOnFeatureAdd);
        }
    }, []);

    useDidUpdate(() => {
        setInternalValues(values);
    }, [values]);

    useDidUpdate(() => {
        setInternalValues(values);
    }, [state.admin_level_1]);

    const getGeoJsonLabel = useCallback((geojson) => {
        let featureLevel = geojson.properties.level
        let featureType = geojson.properties.type
        let featureName = geojson.properties[("admin_level_" + featureLevel)];
        return `${ featureName } (${ featureType })`
    }, [])

    return (
        <GridContainer className={ "relative p-0" }>
            { <GridItem className="flex flex-row items-start">
                { !!title && <Typography variant="subtitle1" className="flex-1">
                    { title }
                </Typography> }
            </GridItem> }
            { !!description && <GridItem className="flex flex-col items-start py-2">
                <Typography variant="body2">
                    { description }
                </Typography>
            </GridItem> }
            { Array.isArray(state.geojsons) && <GridItem xs={ 12 }>
                <GridContainer>
                    <Typography variant="h5">
                        { state.geojsons.map((geojson, index) => (
                            <Chip className={ "mx-2" } label={ getGeoJsonLabel(geojson) } key={ "geojsons" + "_" + index } />
                        )) }
                    </Typography>
                </GridContainer>
            </GridItem> }

            <GridItem xs={ 12 } className="p-0 min-h-screen">
                <GoogleMap
                    zoom={ 6 }
                    showCurrentPosition={ true }
                    onMapLoad={ handleOnMapLoad }
                    className="p-0 min-h-screen"
                />
            </GridItem>

            <GridItem xs={ 12 } className="flex flex-col items-center  py-8">
                <Button onClick={ handleOnSubmit } disabled={ state.invalid } className="accent inverse-text" variant="outlined">
                    Ok. Ready to continue
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default Stage;
