import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Placeholder from 'components/Placeholder';
import ViewPortSensor from "components/ViewPortSensor";

	

class LazyModule extends React.Component {
	constructor() {
		super();
		this.state = { module: false, inViewPort: false  };
		this.onViewportVisibilityChange = this.onViewportVisibilityChange.bind(this);
	}


	componentDidCatch(error) {
		this.setState({ hasError: error });
	}


	async loadModule() {		
		try {
			const { resolve, path } = this.props;
			if (Function.isFunction(resolve)) {
				const { default: module } = await resolve();
				this.setState({ module });
			}
			else if (String.isString(path)) {
				const { default: module } = await import(path);
				this.setState({ module });
			}
				
		} catch (error) {
			this.setState({ hasError: error });
		}
	}

	onViewportVisibilityChange(inViewPort) {
		if (inViewPort && !this.state.module ) {
			this.loadModule();
			this.setState({ inViewPort: inViewPort });
		}
	}

	render() {
		const { resolve, path, placeholderType, placeholder, offset, ...rest } = this.props;
		const { module:Module, hasError, inViewPort } = this.state;

		return (
			<ViewPortSensor onViewportVisibilityChange={this.onViewportVisibilityChange} >
				{ hasError && <h5 className="error_text relative center text-center">{hasError.message}</h5> }
				{ (!hasError && Module ) && <Module {...rest} /> }
				{ ( !hasError && !Module ) && <Placeholder placeholder={placeholder} type={placeholderType}/> }
			</ViewPortSensor>
		);
	}
}

LazyModule.propTypes = {
	resolve: PropTypes.func,
	path: PropTypes.string,
	placeholderType: PropTypes.string,
	placeholder: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.array, PropTypes.string]),
	offset: PropTypes.number,  
};
LazyModule.defaultProps = {
	placeholderType: "skeleton",
	placeholder: { variant: "rect", width:"100%", height:"100%", animation: "wave" },
	offset: 0, 
}
export default LazyModule;