import React, { memo } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTheme } from '@material-ui/core/styles';
import compose from "recompose/compose";
import styles from "./styles";



const Conversation = (props) => {
	//ToDo:-
}

export default compose(
	withStyles(styles),
	withTheme,
)(memo(Conversation));
