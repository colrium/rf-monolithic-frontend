export default theme => ({
  "@keyframes progress": {
    "0%": {
      backgroundPosition: "0 0"
    },
    "100%": {
      backgroundPosition: "-70px 0"
    }
  },
  dropZoneContainer: {
    padding: "0 !important",
    margin: "0 !important"
  },

  dropZone: {
    position: "relative",
    width: "100%",
    minHeight: "250px",
    background: "transparent",
    border: "1px dashed #C8C8C8",
    borderRadius: "5px",
    padding: theme.spacing(),
    cursor: "pointer",
    boxSizing: "border-box"
  },

  dropZoneInner: {
    height: "100%"
  },

  stripes: {
    border: "solid",
    backgroundImage:
      "repeating-linear-gradient(-45deg, #F0F0F0, #F0F0F0 25px, #C8C8C8 25px, #C8C8C8 50px)",
    animation: "progress 2s linear infinite !important",
    backgroundSize: "150% 100%"
  },
  rejectStripes: {
    border: "solid",
    backgroundImage:
      "repeating-linear-gradient(-45deg, #fc8785, #fc8785 25px, #f4231f 25px, #f4231f 50px)",
    animation: "progress 2s linear infinite !important",
    backgroundSize: "150% 100%"
  },

  labelContainer: {
    padding: "0 !important",
    margin: "auto 0 " + theme.spacing(2) + "px auto !important"
  },

  dropzoneTextStyle: {
    textAlign: "center"
  },
  uploadIcon: {
    marginBottom: theme.spacing(2),
    "& *": {
      fontSize: "5rem !important",
      color: "inherit !important"
    }
  }
});
