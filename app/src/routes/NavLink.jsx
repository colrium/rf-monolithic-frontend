import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";


const CustomNavLink = props => {
	const {children, to, ...rest} = props;
	return (
		<NavLink 
			to={to}
			isActive={(match, location) => {
				if (location && String.isString(to)) {
					let hash = "";
					let pathname = to;
					if (to.indexOf("#") !== -1) {
						hash = to.trim().substr(to.indexOf("#"));						
						pathname = to.trim().substr(0, to.indexOf("#"));
					}
					return location.pathname === pathname && location.hash === hash;
				}
				return false;
			}}
			{...rest}
		>
			{children}
		</NavLink>
	)

}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default React.memo(connect(mapStateToProps, {})(CustomNavLink));