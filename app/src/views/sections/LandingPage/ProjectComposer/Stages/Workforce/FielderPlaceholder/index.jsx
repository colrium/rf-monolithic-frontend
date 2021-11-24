import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

const FielderPlaceholder = (props) => {
    return (
        <Card elevation={5} className={"m-1 w-full h-full block relative"}>
            <Skeleton sx={{ height: "100%", "width": "100%" }} animation="wave" variant="rectangular" />
        </Card>
    );
}

export default FielderPlaceholder;