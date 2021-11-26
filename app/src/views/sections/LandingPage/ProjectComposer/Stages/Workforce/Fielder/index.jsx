/** @format */
import React, { useCallback, useRef, useMemo } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ApiService from "services/Api";
import Rating from '@mui/material/Rating';

import { useSetState, useDidUpdate, useDidMount, useLazyImage } from "hooks";

const Fielder = (props) => {
    const {className, selected, onSelect, onDeselect, fielder, onClickGender, onClickCourse, ...rest } = props;
    const { avatar, icon, first_name, course, rating, gender, education } = fielder || {}
    const [imageSrc, { ref: imageRef }] = useLazyImage((avatar ? (/*ApiService.getAttachmentFileUrl(avatar)*/ "https://api.realfield.io/attachments/download/" + avatar) : ("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/avatars/" + icon + ".png")), ("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/avatars/" + icon + ".png"));
    const checkboxLabel = useMemo(() => ({ inputProps: { 'aria-label': selected ? `Unselect ${first_name}` : `Select ${first_name}` } }), [selected, first_name]);

    const handleOnSelectToggle = useCallback((event) => {
        if (selected) {
            if (Function.isFunction(onDeselect)) {
                onDeselect(fielder)
            }
        }
        else if (Function.isFunction(onSelect)) {
            onSelect(fielder)
        }
    }, [onSelect, onDeselect, selected, fielder])

    return (
        <Card elevation={5} sx={{ /* maxWidth: "20%" */ }}  className={"m-1 block relative"} {...rest}>
            {/* <CardHeader
                title={(first_name || "").replaceAll(" ", "").humanize().truncate(30)}
                
                className={"h-12"}
            /> */}
            <CardMedia
                component="img"
                className="h-80 object-cover"
                image={( avatar ? (/*ApiService.getAttachmentFileUrl(avatar)*/ "https://api.realfield.io/attachments/download/" + avatar ) : ApiService.endpoint( "/public/img/avatars/" + icon + ".png" ) )}
                ref={imageRef}
                alt={first_name}
            />
            <CardContent className="px-2 flex flex-row items-center absolute bottom-0 left-0 right-0 bottom-to-top-fading-dark-bg">
                <div className="flex-1 flex flex-col">
                    <Typography gutterBottom variant="h5" className="inverse-text">{(first_name || "").replaceAll(" ", "").humanize().truncate(30)}</Typography>
                    <div className="flex-1 flex flex-row flex-wrap mb-4">
                        {!!gender && <Chip
                            className={"mx-1"}
                            className={"accent inverse-text"}
                            label={gender.humanize()}
                            size="small"
                            onClick={onClickGender}
                            />}
                        {!!course && <Tooltip title={course.humanize()}>
                            <Chip
                                className={"mx-1"}
                                color={"secondary"}
                                label={course.humanize().truncate( 10 )}
                                size="small"
                                onClick={onClickCourse}
                            />
                        </Tooltip>}
                    </div>
                    <Rating name="rating" defaultValue={rating} size="small" readOnly />
                </div>

                <div className="flex-shrink">
                    <Checkbox
                        {...checkboxLabel}
                        checked={selected}
                        onChange={handleOnSelectToggle}
                        color="primary"
                        sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            color: "#FFFFFF",
                            // '&.Mui-checked': {
                            //     color: pink[600],
                            // },
                        }}
                    />
                </div>

            </CardContent>
        </Card>

    )
}

export default Fielder;