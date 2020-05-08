/** @format */

import React from "react";
import { withRouter } from "react-router-dom";
import SwitchProgress from "./SwitchProgress";

const Switch = withRouter(props => {
	return <SwitchProgress>{props.children}</SwitchProgress>;
});

export default Switch;
