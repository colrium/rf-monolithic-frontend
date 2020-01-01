import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from "react-router-dom";
import Typography from 'components/Typography';

import logo from 'assets/img/realfield/logo.svg';

function HideOnScroll(props) {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({ target: window ? window() : undefined });

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
	window: PropTypes.func,
};

function Header(props) {
	const {className, items, showLogo, auth, window } = props;
	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 64,
	});
	return (
			<div id="back-to-top-anchor">				
				<Hidden smDown>
					<HideOnScroll  {...props}>
						<AppBar className={trigger? "shadow-xl inverse default_text" : "bg-transparent shadow-none default_text"} style={{WebkitTransition: "all 200ms", transition: "all 200ms", }}>
							<Toolbar>
								<Link className="flex-grow" to={"/home".toUriWithLandingPagePrefix()} color="inherit"><Button  color="inherit">{<img src={logo} className="h-6" alt="logo"/>}</Button></Link>
								<Link to={"/order".toUriWithLandingPagePrefix()} color="inherit"><Button className="mr-2" edge="end" color="inherit">Order</Button></Link>
								<Link to={"/recruitment".toUriWithLandingPagePrefix()}  color="inherit"><Button className="mr-2" edge="end" color="inherit">Recruitment</Button></Link>
								{(!auth.isAuthenticated || Object.size(auth.user) === 0) && <Button href="/login" edge="end" color="inherit">Login</Button>}
								{(auth.isAuthenticated && Object.size(auth.user) > 0) && <Button href="/dashboard" edge="end" color="inherit">Dashboard</Button>}
							</Toolbar>
						</AppBar>
					</HideOnScroll>
				</Hidden>

				<Hidden mdUp>
					<HideOnScroll  {...props}>
						<AppBar className="shadow-none inverse default_text">
							<Toolbar>						
								<IconButton edge="start" className="mr-4" color="inherit" aria-label="menu">
									<MenuIcon />
								</IconButton>
								<Link className="flex-grow" to={"/home".toUriWithLandingPagePrefix()} color="inherit"><Button  color="inherit">{<img src={logo} className="h-6" alt="logo"/>}</Button></Link>
								
							</Toolbar>
						</AppBar>
					</HideOnScroll>
				</Hidden>
			</div>
	);
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {})(Header);