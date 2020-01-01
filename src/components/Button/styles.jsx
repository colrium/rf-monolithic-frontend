import { colors, textcases } from "assets/jss/app-theme.jsx";
export default theme => ({
  button: {
    minHeight: "auto",
    minWidth: "auto",
    border: "none",
    borderRadius: "0.3rem",
    position: "relative",
    padding: "0.4rem 1rem",
    margin: ".125rem 1px",
    fontSize: "0.8rem",
    fontWeight: "400",
    letterSpacing: "0",
    willChange: "box-shadow, transform",
    transition:
      "box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    lineHeight: "1.75",
    textAlign: "center",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    touchAction: "manipulation",
    cursor: "pointer",
    "&.outlined": {
      borderWidth: "1px !important",
      borderStyle: "solid !important"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      position: "relative",
      display: "inline-block",
      top: "0",
      fontSize: "1.1rem",
      marginRight: "4px",
      verticalAlign: "middle"
    },
    "& svg": {
      position: "relative",
      display: "inline-block",
      top: "0",
      width: "18px",
      height: "18px",
      marginRight: "4px",
      verticalAlign: "middle"
    },
    "&:disabled": {
      color: "rgba(" + colors.rgb.default + ", 0.26) !important",
      boxShadow: "none !important",
      cursor: "not-allowed !important",
      backgroundColor: "rgba(" + colors.rgb.default + ", 0.12) !important",
      borderColor: "rgba(" + colors.rgb.default + ", 0.12) !important"
    },

    "&$round": {
      borderRadius: "1.175rem"
    }

    /*"&$justIcon": {
			"& .fab,& .fas,& .far,& .fal,& .material-icons": {
				marginRight: "0px",
				position: "absolute",
				width: "100%",
				transform: "none",
				left: "0px",
				top: "0px",
				height: "100%",
				lineHeight: "41px",
				fontSize: "20px"
			}
		}*/
  },
  round: {
    borderRadius: "0.8rem"
  },
  block: {
    width: "100% !important"
  },
  link: {
    "&,&:hover,&:focus": {
      backgroundColor: "transparent",
      boxShadow: "none"
    }
  },
  lg: {
    padding: "0.6rem 1.25rem",
    fontSize: "1rem",
    lineHeight: "2.2",
    borderRadius: "0.3rem",
    "&round": {
      borderRadius: "1.5rem"
    }
  },
  md: {
    padding: "0.4rem 1rem",
    margin: "0.125rem 0.3rem",
    fontSize: "0.8rem",
    lineHeight: "1.75",
    borderRadius: "0.2rem",
    "&$round": {
      borderRadius: "1.175rem"
    }
  },
  sm: {
    padding: "0.2rem 1.25rem",
    fontSize: "0.6rem",
    lineHeight: "1",
    borderRadius: "0.2rem",
    "&$round": {
      borderRadius: "0.5rem"
    }
  },

  justIcon: {
    padding: "12px",
    fontSize: "20px",
    height: "41px",
    minWidth: "41px",
    width: "41px",
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      fontSize: "24px",
      lineHeight: "41px"
    },
    "& svg, & img": {
      width: "20px",
      height: "20px"
    },
    "&$lg": {
      height: "57px",
      minWidth: "57px",
      width: "57px",
      lineHeight: "56px",
      padding: "12.5px",
      "& .fab,& .fas,& .far,& .fal,& .material-icons": {
        fontSize: "32px",
        lineHeight: "56px"
      },
      "& svg, & img": {
        width: "32px",
        height: "32px"
      }
    },
    "&$sm": {
      height: "30px",
      minWidth: "30px",
      width: "30px",
      padding: "6.5px",
      "& .fab,& .fas,& .far,& .fal,& .material-icons": {
        fontSize: "17px",
        lineHeight: "29px"
      },
      "& svg, & img": {
        width: "17px",
        height: "17px"
      }
    }
  },
  fullWidth: {
    width: "100%"
  },
  right: {
    float: "right !important"
  },
  left: {
    float: "left !important"
  },
  ...textcases
});
