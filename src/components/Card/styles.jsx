import { colors } from "assets/jss/app-theme.jsx";

export default theme => ({
  card: {
    borderRadius: "3px",
    background: colors.hex.inverse,
    width: "100%",
    minHeight: "100% !important",
    height: "auto",
    overflow: "visible !important",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minWidth: "0",
    wordWrap: "break-word",
    fontSize: ".875rem",
    transition: "all 300ms linear"
  },

  coloredOutline: {
    borderWidth: "1px !important",
    borderStyle: "solid !important"
  },
  cardPlain: {
    background: "transparent",
    boxShadow: "none"
  },
  cardCarousel: {
    overflow: "hidden"
  }
});
