import React from "react";


function Clearfix(props) {
	return <div style={{
		"&:after,&:before": {
			display: "table",
			content: '" "',
		},
		"&:after": {
			clear: "both",
		},
	}} {...props} />;
}

export default (Clearfix);
