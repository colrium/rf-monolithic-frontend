import React, {useState, useRef, useImperativeHandle} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem, {MenuItemProps} from '@material-ui/core/MenuItem';
import ArrowRight from '@material-ui/icons/ArrowRight';
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";



const NestedMenuItem = React.forwardRef((props, ref) => {
	const {
		classes,
		parentMenuOpen,
		component = 'div',
		label,
		rightIcon = <ArrowRight />,
		leftIcon,
		children,
		className,
		tabIndex: tabIndexProp,
		ContainerProps: ContainerPropsProp = {},
		MenuProps,
		...MenuItemProps
	} = props

	const {ref: containerRefProp, ...ContainerProps} = ContainerPropsProp

	const menuItemRef = useRef(null)
	useImperativeHandle(ref, () => menuItemRef.current)

	const containerRef = useRef(null)
	useImperativeHandle(containerRefProp, () => containerRef.current)

	const menuContainerRef = useRef(null)

	const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

	const handleMouseEnter = (event) => {
		setIsSubMenuOpen(true)

		if (ContainerProps?.onMouseEnter) {
			ContainerProps.onMouseEnter(event)
		}
	}
	const handleMouseLeave = (event) => {
		setIsSubMenuOpen(false)

		if (ContainerProps?.onMouseLeave) {
			ContainerProps.onMouseLeave(event)
		}
	}

	// Check if any immediate children are active
	const isSubmenuFocused = () => {
		const active = containerRef.current?.ownerDocument?.activeElement
		for (const child of menuContainerRef.current?.children ?? []) {
			if (child === active) {
				return true
			}
		}
		return false
	}

	const handleFocus = (event) => {
		if (event.target === containerRef.current) {
			setIsSubMenuOpen(true)
		}

		if (ContainerProps?.onFocus) {
			ContainerProps.onFocus(event)
		}
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Escape') {
			return
		}

		if (isSubmenuFocused()) {
			event.stopPropagation()
		}

		const active = containerRef.current?.ownerDocument?.activeElement

		if (event.key === 'ArrowLeft' && isSubmenuFocused()) {
			containerRef.current??containerRef.current.focus()
		}

		if (event.key === 'ArrowRight' && event.target === containerRef.current && event.target === active ) {
			const firstChild = menuContainerRef.current?.children[0] | undefined
			firstChild??firstChild.focus()
		}
	}

	const open = isSubMenuOpen && parentMenuOpen


	// Root element must have a `tabIndex` attribute for keyboard navigation
	let tabIndex
	if (!props.disabled) {
		tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1
	}

	return (
		<div
			{...ContainerProps}
			ref={containerRef}
			onFocus={handleFocus}
			tabIndex={tabIndex}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onKeyDown={handleKeyDown}
		>
			<MenuItem
				{...MenuItemProps}
				className={classNames({[classes.root]: true, [classes.open]: isSubMenuOpen, [className]: Boolean(className) })}
				ref={menuItemRef}
			>
				{leftIcon}
				{label}
				{rightIcon}
			</MenuItem>
			<Menu
				// Set pointer events to 'none' to prevent the invisible Popover div
				// from capturing events for clicks and hovers
				style={{pointerEvents: 'none'}}
				anchorEl={menuItemRef.current}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left'
				}}
				open={open}
				autoFocus={false}
				disableAutoFocus
				disableEnforceFocus
				onClose={() => {
					setIsSubMenuOpen(false)
				}}
				{...MenuProps}
			>
				<div ref={menuContainerRef} style={{pointerEvents: 'auto'}}>
					{children}
				</div>
			</Menu>
		</div>
	)
});

NestedMenuItem.propTypes = {
	classes: PropTypes.object.isRequired,
	parentMenuOpen: PropTypes.bool,
	component: PropTypes.element,
	label: PropTypes.node,
	rightIcon: PropTypes.node,
	leftIcon: PropTypes.node,
	ContainerProps: PropTypes.object,
	MenuProps: PropTypes.object,
	button: PropTypes.bool,
};
export default withStyles(styles)(React.memo(NestedMenuItem));
