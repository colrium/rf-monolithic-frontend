import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import CartIcon from '@material-ui/icons/ShoppingCartOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [stateProps, setStateProps] = useState(props);
	useEffect(() => { setStateProps(props) }, [props, setStateProps]);

	const {className, showLogo, auth, window, cart } = stateProps;
	let cart_items_count = JSON.isJSON(cart)? (Array.isArray(cart.entries)? cart.entries.length : 0) : 0;

	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 64,
	});

	const toggleDrawer = (open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setDrawerOpen(open);
	};

	const DrawerItems = () => {
		return (
			<div
				className="w-full"
				role="presentation"
				onClick={toggleDrawer(false)}
				onKeyDown={toggleDrawer(false)}
			>
				<List>
					<ListItem button>
						<ListItemText primary={<Link to={"/catalog".toUriWithLandingPagePrefix()} color="inherit">Catalog</Link>} />
					</ListItem>
					<ListItem button>
						<ListItemText primary={<Link to={"/recruitment".toUriWithLandingPagePrefix()}  color="inherit">Recruitment</Link>} />
					</ListItem>
					{(!auth.isAuthenticated || Object.size(auth.user) === 0) && <ListItem button>
						<ListItemText primary={<Link to={"/login"}  color="inherit">Login</Link>} />
					</ListItem> }
					{(auth.isAuthenticated && Object.size(auth.user) > 0) && <ListItem button> 
						<ListItemText primary={<Link to={"/dashboard"} target="_blank" color="inherit">Dashboard</Link>} /> </ListItem> }
				</List>
			</div>
		);
	}

	return (
			<div id="back-to-top-anchor">				
				<Hidden smDown>
					<HideOnScroll window={window}>
						<AppBar className={trigger? "shadow-xl inverse default_text" : "bg-transparent shadow-none default_text"} style={{WebkitTransition: "all 200ms", transition: "all 200ms", }}>
							<Toolbar>
								<Link className="flex-grow" to={"/home".toUriWithLandingPagePrefix()} color="inherit"><Button  color="inherit">{<img src={logo} className="h-6" alt="logo"/>}</Button></Link>
								<Link to={"/catalog".toUriWithLandingPagePrefix()} color="inherit"><Button className="mr-2" edge="end" color="inherit">Catalog</Button></Link>
								<Link to={"/recruitment".toUriWithLandingPagePrefix()}  color="inherit"><Button className="mr-2" edge="end" color="inherit">Recruitment</Button></Link>
								{(!auth.isAuthenticated || Object.size(auth.user) === 0) && <Button href="/login" edge="end" color="inherit">Login</Button>}
								{(auth.isAuthenticated && Object.size(auth.user) > 0) && <Button href="/dashboard" edge="end" color="inherit" target="_blank">Dashboard</Button>}
								<Link to={"/cart".toUriWithLandingPagePrefix()}  color="inherit">
									<IconButton className="mx-2" aria-label="cart" >
										<Badge badgeContent={cart_items_count} color="primary" > 
											<CartIcon fontSize="small" /> 
										</Badge> 
									</IconButton>
								</Link>
							</Toolbar>
						</AppBar>
					</HideOnScroll>
				</Hidden>

				<Hidden mdUp>
					<HideOnScroll  {...props}>
						<AppBar className="shadow-none inverse default_text">
							<Toolbar>						
								<IconButton edge="start" className="mr-4" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
									<MenuIcon />
								</IconButton>
								<Link className="flex-grow" to={"/home".toUriWithLandingPagePrefix()} color="inherit"><Button  color="inherit">{<img src={logo} className="h-6" alt="logo"/>}</Button></Link>
								<Link to={"/cart".toUriWithLandingPagePrefix()}  color="inherit">
									<IconButton className="mx-2" aria-label="cart" >
										<Badge badgeContent={cart_items_count} color="primary" > 
											<CartIcon fontSize="small" /> 
										</Badge> 
									</IconButton>
								</Link>
								
							</Toolbar>
						</AppBar>

					</HideOnScroll>
					<SwipeableDrawer 
						open={drawerOpen} 
						onClose={toggleDrawer(false)}
						classes={{ paper: "w-64" }}
						onOpen={toggleDrawer(true)}
					>
				        <DrawerItems />
				   	</SwipeableDrawer>
				</Hidden>
			</div>
	);
}

const mapStateToProps = state => ({
	auth: state.auth,
	cart: state.ecommerce.cart,
});

export default connect(mapStateToProps, {})(Header);