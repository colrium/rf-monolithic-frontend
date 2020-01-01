import React from "react";
import PropTypes from 'prop-types';
//



import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import withRoot from "utils/withRoot";
import LogoAnimation from "./LogoAnimation";




class ProgressIndicator extends React.Component {
    render() {
        const { classes, type, progress, buffer, max, variant, color, ...rest } = this.props;
        const percent_progress = (progress/max)*100;
        const percent_buffer = (buffer / max) * 100;
        return (
            <div className="p-2 m-0 min-h-full min-w-full">
                {type === "circular" && <CircularProgress className="m-auto" color={color} variant={variant} value={percent_progress}  {...rest}/>}
                {type === "linear" && <LinearProgress className="m-auto" color={color} variant={variant} value={percent_progress} {...rest}/>}
                {type === "logo" && <LogoAnimation className="m-auto" color={color} variant={variant} value={percent_progress} {...rest}/>}
            </div>
        );
    }
}


ProgressIndicator.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(["circular", "linear", "logo"]),
    progress: PropTypes.number,
    buffer: PropTypes.number, 
    max: PropTypes.number,
    variant: PropTypes.oneOf(["determinate", "indeterminate", "static", "buffer", "query"]),
    color: PropTypes.string,
};

ProgressIndicator.defaultProps = {
    type: "circular",
    progress: 1,
    buffer: 1,
    max: 100,
    variant: "indeterminate",
    color: "secondary",
};



export default withRoot(ProgressIndicator);
