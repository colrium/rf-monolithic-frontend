import { colors } from "assets/jss/app-theme";

export default theme => ( {
    root: {
        padding: "0"
    },
    inputGroup: {
        border: "1px solid rgba(" + colors.rgb.default + ", 0.15) !important",
        "& :hover": {
            backgroundColor: "rgba(" + colors.rgb.default + ", 0.15) !important"
        }
    },
    inputField: {
        "& :hover": {
            backgroundColor: "rgba(" + colors.rgb.default + ", 0.2) !important"
        }
    }
} );
