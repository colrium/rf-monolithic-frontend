/** @format */
import React, { useCallback, useRef, useEffect } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ApiService from "services/Api";
import Rating from '@material-ui/lab/Rating';
import Pagination from '@material-ui/lab/Pagination';

import {
    TextInput,
    DateInput,
    DateTimeInput,
    SelectInput,
} from "components/FormInputs";
import { useSetState, useDidUpdate, useDidMount } from "hooks";




const Stage = (props) => {
    const { onFieldChange, onSubmit, values, title, description } = props;
    const [state, setState] = useSetState({
        invalid: true,
        loading: false,
        records: [],
        error: null,
        pagination: 20,
        page: 1,
        pages: 1,
        count: 0
    });

    const [internalValues, setInternalValues] = useSetState({ ...values });

    const handleOnChange = useRef((name) => (value) => {
        setInternalValues({ [name]: value });
        if (Function.isFunction(onFieldChange)) {
            onFieldChange(name, value)
        }
    }).current;

    const handleOnSubmit = useCallback(() => {
        if (Function.isFunction(onSubmit)) {
            onSubmit(internalValues);
        }
    }, [internalValues]);

    const loadData = (params = {}) => {
        setState({ loading: true, error: null });
        ApiService.get("people/fielders/recommendations", { params: { ...params } }).then(res => {
            console.log("loadData res ", res)
            setState({
                records: res.body.data,
                loading: false,
                //page: res.body.page,
                pages: res.body.pages,
                count: res.body.count,
                error: null,
            });
        })
            .catch(err => {
                console.log("loadData error", err)
                setState(prevState => ({
                    records: [],
                    loading: false,
                    error: err,
                }));
            });
    }

    const handleonPageChange = (event, value) => {
        setState({ page: value });
    }

    useDidUpdate(() => {
        setInternalValues(values);
    }, [values]);

    useDidUpdate(() => {
        loadData({ pagination: state.pagination, page: state.page });
    }, [state.page, state.pagination]);

    useEffect(() => {
        loadData({ pagination: state.pagination, page: state.page });
    }, []);

    return (
        <GridContainer>
            {/* <GridItem className="flex flex-row items-start">
                {!!title && <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>}
                <Button color="primary" variant="outlined">
                    Sign in
                </Button>
            </GridItem> */}
            {!!description && <GridItem className="flex flex-col items-start py-8">
                <Typography variant="body2">
                    {description}
                </Typography>
            </GridItem>}
            <GridItem>
                <GridList cols={4} cellHeight={200} spacing={20} className={"w-full h-auto"}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Recommended fielders</ListSubheader>
                    </GridListTile>

                    {state.records.map((record, index) => (
                        <GridListTile key={"record-" + index}>
                            <img src={record.avatar ? ApiService.getAttachmentFileUrl(record.avatar) : ApiService.endpoint("/public/img/avatars/" + record.icon + ".png")} alt={record.first_name} />
                            <GridListTileBar
                                title={record.first_name}
                                className={"bottom-to-top-fading-dark-bg accent-text"}
                                subtitle={(
                                    <div className="flex flex-col">
                                        {/* <Typography variant="body2">{(record.gender || "Gender unknown").humanize()}</Typography>
                                        <Typography variant="body2">{(record.education || "education unknown").humanize()}</Typography> */}
                                        <Typography variant="body2">{(record.course || "course unknown").humanize()}</Typography>
                                        <Rating name="rating" defaultValue={record.rating} size="small" readOnly />
                                    </div>
                                )}
                                actionIcon={
                                    <IconButton aria-label={`info about ${record.first_name}`} className={""}>
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </GridItem>

            {state.pages > 1 && <GridItem className="flex flex-col items-center  py-8">
                <Pagination count={state.pages} page={state.page} onChange={handleonPageChange} size="small" />
            </GridItem>}

            <GridItem className="flex flex-col items-center  py-8">
                <Button onClick={handleOnSubmit} disabled={state.invalid} className="accent inverse-text" variant="outlined">
                    Ok. Ready to continue
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default Stage;