import React, {memo, useState, useEffect, useCallback, useRef} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTheme } from '@material-ui/core/styles';
import compose from "recompose/compose";
import { attachments as AttachmentsService } from "services";
import styles from "./styles";



const Conversation = (props) => {
	//ToDo:-
}

export default compose(
	withStyles(styles),
	withTheme,
)(memo(Conversation));
