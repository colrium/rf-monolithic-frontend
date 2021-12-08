/** @format */
import React, { useCallback, useRef, useEffect, useMemo } from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AutoFixHighTwoToneIcon from '@mui/icons-material/AutoFixHighTwoTone';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from 'components/Virtualized';
import ApiService from "services/Api";
import { usePersistentForm, useDidUpdate, useDidMount, useSetState, useGeojson, useWillUnmount } from "hooks";
import { useWindowSize, useMeasure } from 'react-use';
import ScrollBars from "components/ScrollBars";
import FielderPlaceholder from "./FielderPlaceholder";
import Fielder from "./Fielder";
import Header from "./Header";
import coursesTags from "../../config/coursesTags.json";
import coursesGroups from "../../config/coursesGroups.json";

const stage = "workforce"

const Stage = (props) => {
    const { onSubmit, description, itemHeight = 400 } = props;
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down('xs'));
    const sm = useMediaQuery(theme.breakpoints.down('sm'));
    const md = useMediaQuery(theme.breakpoints.down('md'));
    const lg = useMediaQuery(theme.breakpoints.down('lg'));
    const xl = useMediaQuery(theme.breakpoints.up('xl'));
    const no_of_columns = xs ? 1 : (sm ? 2 : (md ? 3 : (xl ? 5 : 4)));
    const [measureRef, containerMeasurements] = useMeasure();
    const scrollContainerRef = useRef(null);
    const scrollEndLoadedRef = useRef(true);
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const initialContainerWidth = containerMeasurements.width || (windowWidth * (sm ? 0.95 : 0.75));
    const itemWidth = (initialContainerWidth / no_of_columns) - 4;

    const { Field, values, getValues, setValue, register, formState, handleSubmit } = usePersistentForm({ name: "projectcomposer", defaultValues: { stage: stage, } });
    const stageValues = (JSON.getDeepPropertyValue(`stages.${ stage }`, (values || {})) || {});
    const regions = JSON.getDeepPropertyValue("stages.respondents.regions", values) || [];
    const fielders = JSON.getDeepPropertyValue(`stages.${ stage }.fielders`, values) || [];
    const autoSelect = JSON.getDeepPropertyValue(`stages.${ stage }.autoSelect`, values) !== undefined ? JSON.getDeepPropertyValue(`stages.${ stage }.autoSelect`, values) : true;
    const fieldersRef = useRef(fielders);
    const queryRef = useRef({ "sort": "first_name", pagination: no_of_columns * 10, });
    const persistentState = useMemo((() => (JSON.getDeepPropertyValue(`stages.${ stage }.state`, values)) || {}), [values]);

    const { isValid } = formState;


    const [state, setState, getState, getPrevState] = useSetState({
        loading: false,
        containerWidth: initialContainerWidth,
        itemWidth: itemWidth,
        columns: no_of_columns,
        bodyScrollLocked: false,
        selectMode: "none",
        listingMode: "all",
        selectedRegions: [],
        records_chunks: [],
        records: [],
        error: null,
        pagination: no_of_columns * 10,
        page: 1,
        pages: 1,
        count: 0,
        keyword: "",
        query: { "asc": "first_name" },
        tags: coursesTags,
        groups: coursesGroups,
    });

    const { getBoundingBox, getAdminLevelName } = useGeojson();


    const changeStageValue = useCallback((name, value) => {
        setValue(name, value);
    }, []);

    useDidUpdate(() => {
        if (!Object.areEqual(fielders, fieldersRef.current)) {

            // fieldersRef.current = fielders;
            onSelectToggleApplySelectMode();
        }

    }, [fielders]);

    // useDidUpdate( () => {
    //     const prevState = getPrevState();
    //     const changes = Object.difference( state, prevState )
    //     console.log( "useDidUpdate state changes", changes )

    // }, [state] );

    useWillUnmount(() => {
        const prevState = getPrevState();
        const changes = Object.difference(state, prevState)
        // console.log( "useWillUnmount state changes", changes )
        // const {records_chunks, records, loading, containerWidth, columns, selectedRegions, bodyScrollLocked, pagination, ...persistentState} = getState()
        // setValue( `stages.${ stage }.state`, persistentState );
    })

    const submit = useCallback((formValues) => {

        if (Function.isFunction(onSubmit)) {
            onSubmit(formValues);
        }
    }, [onSubmit, stageValues]);

    const loadData = useCallback((params = {}, concat = true) => {
        let { columns, records, records_chunks } = getState();
        const loadParams = { ...queryRef.current, ...params };
        if (columns > 0) {
            setState({ loading: true, error: null, records: concat ? records : [] });
            ApiService.get("people/fielders/recommendations", { params: { ...loadParams } }).then(res => {
                const { data = [], pages = 1, page = 1, count = 1 } = res.body;

                queryRef.current = loadParams;


                setState({
                    records: concat && Array.isArray(records) ? records.concat(data) : data,
                    loading: false,
                    page: page,
                    pages: pages,
                    count: count,
                    error: null,
                });

            }).catch(err => {

                setState({
                    records: concat && Array.isArray(records) ? records : [],
                    loading: false,
                    error: err,
                });
            });
        }

    }, []);

    const handleOnToggleSelectMode = useCallback((selectMode) => {
        let state = getState();
        if (state.selectMode != selectMode) {
            setState({ selectMode: selectMode })
            if (selectMode === "none") {
                fieldersRef.current = [];
                setValue(`stages.${ stage }.fielders`, []);

            }
            else if (selectMode === "all") {
                fieldersRef.current = state.records;
                setValue(`stages.${ stage }.fielders`, state.records);
            }
        }



    }, []);

    const updateQuery = (key, value, execLoadData = false, concatData = true) => {
        const currentValue = JSON.getDeepPropertyValue(key, queryRef.current)
        if (!Object.areEqual(currentValue, value)) {
            queryRef.current = JSON.setDeepPropertyValue(key, value, queryRef.current)

        }
    }
    const loadNextPage = useCallback(() => {
        let { loading, page, pages, pagination, query } = getState();
        if (!loading && page < pages) {
            let query = JSON.merge(queryRef.current, { pagination: pagination, page: (page + 1) })
            loadData({ pagination: pagination, page: (page + 1) }, true);
        }

    }, []);



    useDidUpdate(() => {
        const { query } = getState();
        // let bboxes = [];
        // if( Array.isArray( state.selectedRegions ) ) {
        //     for( let i = 0; i < state.selectedRegions.length; i++ ) {
        //         bboxes.push( getBoundingBox( regions[state.selectedRegions[i]] ) )
        //     }
        // }
        let boundaries_ids = [];
        if (Array.isArray(state.selectedRegions)) {
            for (let i = 0; i < state.selectedRegions.length; i++) {
                let region_boundary_id = regions[state.selectedRegions[i]]?.properties?._id || false;
                if (region_boundary_id) {
                    boundaries_ids.push(region_boundary_id)
                }
            }
        }
        loadData({ boundaries: boundaries_ids, page: 1 }, false);
    }, [state.selectedRegions]);

    useDidUpdate(() => {
        let nextColumns = xs ? 1 : (sm ? 2 : (md ? 3 : (xl ? 5 : 4)));
        let pagination = (nextColumns * 10);
        const containerWidth = containerMeasurements.width;
        const { records, loading } = getState();
        setState({
            containerWidth: containerWidth,
            itemWidth: (containerWidth / nextColumns) - 4,
            columns: nextColumns,
            records_chunks: Array.isArray(records) ? records.chunks(nextColumns) : [],
            pagination: pagination,
        })
        loadData({ pagination: pagination });
        if (!loading) {

        }
        // 
    }, [containerMeasurements, sm, md, lg, xs, xl]);

    useDidMount(() => {
        let selectedRegions = [];
        let boundaries_ids = [];
        if (Array.isArray(regions)) {
            for (let i = 0; i < regions.length; i++) {
                let region_boundary_id = regions[i].properties?._id || false;
                if (region_boundary_id) {
                    boundaries_ids.push(region_boundary_id)
                }
                selectedRegions.push(i);
            }

        }

        setState({ selectedRegions: selectedRegions });
        queryRef.current = { ...queryRef.current, boundaries: boundaries_ids }


        register(`stages.${ stage }.fielders`, {
            validate: {
                isNotEmpty: v => (JSON.getDeepPropertyValue(`stages.${ stage }.autoSelect`, getValues()) || !Array.isEmpty(v) || 'Fielders are Required'),
            }
        });
        if (JSON.getDeepPropertyValue(`stages.${ stage }.autoSelect`, values) === undefined) {
            setValue(`stages.${ stage }.autoSelect`, true);
        }
        //
        // let state = getState();
        // throw new Error('This is a useErrorBoundary test test.');

    });





    const getFilteredRecords = useCallback(() => {
        let state = getState();
    }, []);

    const handleOnScrollbarsYReachEnd = useCallback(() => {
        if (!scrollEndLoadedRef.current) {
            loadNextPage();
            scrollEndLoadedRef.current = true
        }
        //
    }, []);

    const handleOnScrollbarsScrollDown = useCallback(() => {
        scrollEndLoadedRef.current = false;

    }, []);

    const indexOfFielderInValues = useCallback((fielder) => {
        let indexOfFielder = -1;
        if (Array.isArray(fieldersRef.current)) {
            indexOfFielder = fieldersRef.current.findIndex(entry => entry?._id == fielder?._id);
        }
        else {
            fieldersRef.current = []
            setValue(`stages.${ stage }.fielders`, [])
        }
        return indexOfFielder;
    }, []);

    const onSelectToggleApplySelectMode = useCallback(() => {
        const state = getState()
        if (Array.isArray(fieldersRef.current) && Array.isArray(state.records)) {

            if (fieldersRef.current.length === 0 && (state.selectMode === "all" || state.selectMode === "some")) {
                setState({ selectMode: "none" });
            }
            else if (fieldersRef.current.length > 0) {
                let all_records_selected = true;
                if (state.records.length > 0) {
                    for (let i = 0; i < state.records.length; i++) {
                        let index = indexOfFielderInValues(state.records[i]);
                        if (index === -1 && all_records_selected) {
                            all_records_selected = false;
                            break;
                        }
                    }
                }
                else {
                    all_records_selected = false;
                }

                setState({ selectMode: all_records_selected ? "all" : "some" });
            }
            else {
                setState({ selectMode: "none" })
            }
        }
        else {
            setState({ selectMode: "none" });
        }
    }, [])

    const handleOnFielderSelect = useCallback((fielder) => {
        const indexInValue = indexOfFielderInValues(fielder);

        if (indexInValue === -1) {
            if (Array.isArray(fieldersRef.current)) {
                let nextFielders = fieldersRef.current;
                nextFielders.push(fielder);
                fieldersRef.current = nextFielders;
            }
            else {
                fieldersRef.current = [fielder];

            }
            setValue(`stages.${ stage }.fielders`, fieldersRef.current);
            onSelectToggleApplySelectMode()
        }
    }, []);

    const handleOnFielderDeselect = useCallback((fielder) => {
        const indexInValue = indexOfFielderInValues(fielder);

        if (indexInValue !== -1) {
            const state = getState();
            let nextFielders = fieldersRef.current.removeAtIndex(indexInValue) || [];

            fieldersRef.current = nextFielders;
            setValue(`stages.${ stage }.fielders`, fieldersRef.current)
            onSelectToggleApplySelectMode()
        }

    }, []);

    const handleOnChangeSelectedRegions = useCallback((selectedRegions) => {

        setState({ selectedRegions: selectedRegions });
    }, []);

    const handleOnChangeListingMode = useCallback((listingMode) => {
        setState({ listingMode: listingMode });
    }, []);

    const handleOnChangeAutoSelect = useCallback((autoselect) => {
        changeStageValue(`stages.${ stage }.autoSelect`, autoselect);
        if (autoselect) {
            fieldersRef.current = [];
            changeStageValue(`stages.${ stage }.fielders`, []);

        }
    }, []);

    const handleOnChangeTags = useCallback((tags) => {
        setState({ tags: tags })
    }, []);

    const handleOnChangeGroups = useCallback((groups) => {
        setState({ groups: groups })
    }, []);


    const handleOnChangeKeyword = useCallback((keywordVal) => {
        console.log("handleOnChangeKeyword keywordVal", keywordVal, keyword !== keywordVal && keywordVal && keywordVal.trim().length >= 3)
        const { keyword, loading } = getState()
        if (!loading && keyword !== keywordVal && keywordVal && keywordVal.trim().length >= 3) {

            loadData({ q: keywordVal, page: 1 }, false)
            setState({ keyword: keywordVal.trim() })
        }
        else {
            if (!loading && !String.isEmpty(keyword)) {
                setState({ keyword: "" })
                let nextQuery = JSON.fromJSON(queryRef.current)
                delete nextQuery.q;
                queryRef.current = nextQuery;
                loadData({ page: 1 }, false)
            }

        }

    }, []);

    const handleOnClickGenderChip = useCallback((gender) => (event) => {
        if (gender) {
            if (queryRef.current.gender !== gender) {
                loadData({ gender: gender, page: 1 }, false)
            }
            else {
                let nextQuery = JSON.fromJSON(queryRef.current)
                delete nextQuery.gender;
                queryRef.current = nextQuery;
                loadData({ page: 1 }, false)
            }
        }

    }, []);

    const handleOnClickCourseChip = useCallback((course) => (event) => {
        if (course) {
            if (queryRef.current.q !== course) {
                setState({ keyword: course })
                loadData({ q: course, page: 1 }, false)
            }
            else {
                setState({ keyword: "" })
                let nextQuery = JSON.fromJSON(queryRef.current)
                delete nextQuery.q;
                queryRef.current = nextQuery;
                loadData({ page: 1 }, false)
            }
        }

    }, []);




    const cellRenderer = useCallback(({
        index,
        key,
        parent,
        style, }) => {
        const { records, columns } = getState();
        const entry = Array.isArray(records) ? records[index] : false;
        // console.log( "entryIndex", entryIndex, "columnIndex", columnIndex, "rowIndex", rowIndex)


        if (!!entry) {
            // const selected = state.selectMode === "all" || indexOfFielderInValues(entry) !== -1;
            const selected = indexOfFielderInValues(entry) !== -1;

            return (
                <div
                    className="p-2"
                    style={ style }
                    key={ key }
                    parent={ parent }
                >
                    <Fielder
                        fielder={ entry }
                        selected={ selected }
                        onSelect={ handleOnFielderSelect }
                        onDeselect={ handleOnFielderDeselect }
                        onClickGender={ handleOnClickGenderChip(entry?.gender) }
                        onClickCourse={ handleOnClickCourseChip(entry?.course) }

                    />

                </div>
            );
        }
        else {
            return (
                <div
                    className="p-2"
                    style={ style }
                    key={ key }
                    parent={ parent }
                >

                </div>
            );
        }

    }, []);

    const preventWindowScroll = useCallback((event) => {
        event.preventDefault();
    }, []);

    const handleOnMouseEnter = useCallback(() => {
        window.addEventListener("scroll", preventWindowScroll);
    }, []);

    const handleOnMouseLeave = useCallback((event) => {
        window.removeEventListener('scroll', preventWindowScroll);
    }, []);


    useEffect(() => {
        onSelectToggleApplySelectMode();
        return () => {
            window.removeEventListener('scroll', preventWindowScroll);
        }
    }, [fielders]);


    const listingRecords = state.records || fielders
    console.log("state.records", state.records)
    return (
        <GridContainer
            className={ "p-0" }
            sx={ {
                backgroundColor: (theme) => `${ theme.palette.deep_purple }`,
            } }
        >
            <GridItem xs={ 12 } className={ "p-0" }>
                <div className={ "w-full" } ref={ measureRef } />
            </GridItem>
            <GridItem xs={ 12 } className={ "p-4" }>
                <Header
                    regions={ regions }
                    selectMode={ state.selectMode }
                    loading={ state.loading }
                    keyword={ state.keyword || "" }
                    listingMode={ state.listingMode }
                    autoSelect={ autoSelect }
                    tags={ state.tags }
                    groups={ state.groups }
                    pagination={ {
                        pages: state.pages,
                        page: state.page,
                        count: state.count,
                        rpp: state.pagination,
                    } }
                    selectedRegions={ state.selectedRegions }
                    onToggleSelectMode={ handleOnToggleSelectMode }
                    onChangeSelectedRegions={ handleOnChangeSelectedRegions }
                    onChangeListingMode={ handleOnChangeListingMode }
                    onChangeAutoSelect={ handleOnChangeAutoSelect }
                    onChangeTags={ handleOnChangeTags }
                    onChangeGroups={ handleOnChangeGroups }
                    onChangeKeyword={ handleOnChangeKeyword }
                />
            </GridItem>

            { autoSelect && <GridItem xs={ 12 } className="flex flex-col items-center justify-center p-8">
                <Box
                    className="h-72 w-72 shadow flex flex-col items-center justify-center rounded-full"
                    sx={ {
                        backgroundColor: theme => theme.palette.background.paper
                    } }
                >
                    <AutoFixHighTwoToneIcon
                        sx={ {
                            fontSize: "10rem"
                        } }

                    />
                </Box>
                <Typography className="m-8">
                    Auto Select Workforce
                </Typography>
                <Typography className="m-8" variant="body2" color="text.secondary">
                    Realfield will create a workforce for you based on your project's parameters
                </Typography>

            </GridItem> }

            { !autoSelect && <GridItem xs={ 12 }
                className={ "p-0" }
                onMouseEnter={ handleOnMouseEnter }
                onMouseLeave={ handleOnMouseLeave }
            >

                <ScrollBars
                    className={ "max-h-screen " }
                    onYReachEnd={ handleOnScrollbarsYReachEnd }
                    onScrollDown={ handleOnScrollbarsScrollDown }
                    ref={ scrollContainerRef }
                >
                    <GridContainer className={ "p-0" }>
                        <div className={ "w-full" } />
                        <GridItem className={ "w-full py-2 flex  justify-center items-center" } >
                            { Array.isArray(state.records) && state.containerWidth > 0 && <Grid
                                data={ state.records }
                                cellRenderer={ cellRenderer }
                                itemWidth={ itemWidth }
                                columnCount={ no_of_columns }
                                itemHeight={ itemHeight }

                            /> }
                        </GridItem>



                        { !state.loading && (!Array.isArray(state.records) || (Array.isArray(state.records) && state.records.length === 0)) && <GridItem
                            className="p-8 flex flex-col justify-center items-center"
                        >
                            <img
                                alt="Empty state"
                                className={ 'h-40' }
                                src={ ApiService.endpoint("/public/img/empty-state-table.svg") }
                            />
                            <Typography
                                className={ "m-4" }
                                color="text.secondary"
                                variant="body2"
                            >
                                No Records found
                            </Typography>
                        </GridItem> }

                        { state.loading && <GridItem
                            className="p-8 flex flex-col justify-center items-center"
                        >
                            <CircularProgress color="accent" />
                        </GridItem> }


                    </GridContainer>
                </ScrollBars>
            </GridItem> }
            <GridItem className="flex flex-col items-center  py-8">
                <Button onClick={ handleSubmit(submit) } disabled={ !isValid } color="accent" variant="contained">
                    Review Project
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default React.memo(Stage);