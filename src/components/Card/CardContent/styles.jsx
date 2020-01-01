export default theme => ({
  cardBody: {
    padding: theme.spacing(),    
    flex: "1 1 auto",
    //zIndex: "999",
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(),
    },
  },
  vinset: {
    padding: "0.9375rem 1.875rem",
    margin: "-1.875rem 0.9375rem -1.875rem 0.9375rem",
    flex: "1 1 auto"
  }
});
