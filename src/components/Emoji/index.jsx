import React, {memo} from 'react';
import classNames from "classnames";

const Emoji = (props) => {
	const {label, className, symbol, ...rest} = props;
	return (
	    <span
	        className={classNames({ [className]: className? true : false, emoji: true })}
	        role="img"
	        aria-label={label ? label : ""}
	        aria-hidden={label ? "false" : "true"}
	        {...rest}
	    >
	        {symbol}
	    </span>
	)
};
export default memo(Emoji);