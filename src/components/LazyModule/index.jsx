import * as React from "react";
import PropTypes from "prop-types";
import VisibilitySensor from 'react-visibility-sensor';
import ProgressIndicator from "components/ProgressIndicator";
import Skeleton from '@material-ui/lab/Skeleton';
import Zoom from '@material-ui/core/Zoom';

class LazyModule extends React.Component {
	constructor() {
		super();
		this.state = { module: null };
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

	onViewportVisibilityChange(isVisible) {
		if (isVisible && !this.state.hasError && !this.state.module) {
			this.loadModule();
		}
	}

	render() {
		const { resolve, path, placeholderType, placeholder, partialVisibility, scrollCheck, ...rest } = this.props;
		const { module:Module, hasError } = this.state;
		if (hasError) {
			return (<div>{hasError.message}</div>);
		}
		else if (Module) {
			return <Zoom in={true}><Module {...rest} /></Zoom>
		}
		else if (placeholderType === "skeleton") {
			if (JSON.isJSON(placeholder)) {
				const {variant, width, height, ...skeletonProps} = placeholder; 
				return  <VisibilitySensor onChange={this.onViewportVisibilityChange} partialVisibility={partialVisibility} scrollCheck={scrollCheck}>
							<Skeleton variant={variant? variant : "rect"} width={width? width : "100%"} height={height? height : "auto" } { ...skeletonProps } />
						</VisibilitySensor>
			}
			else if (Array.isArray(placeholder)) {
				return (
					<VisibilitySensor onChange={this.onViewportVisibilityChange} className="min-w-full min-h-full" partialVisibility={partialVisibility} scrollCheck={scrollCheck}>
						<div className="w-full min-h-full flex flex-col relative"> 
						{ placeholder.map((skeleton, index) => {
							if (JSON.isJSON(skeleton)) {
								const { variant, width, height, className:skeletonClassName, ...skeletonProps } = skeleton
								return (<div className={skeletonClassName? skeletonClassName : "w-full"} key={"skeleton-"+index} > 
									<Skeleton variant={variant? variant : "rect"} width={width? width : "100%"} {...(height? { height: height } : {})}  { ...skeletonProps } />
								</div>);
							}
							else if (Array.isArray(skeleton)) {
								return (<div className="w-full flex flex-row relative" key={"skeleton-row-"+index} >
									{ skeleton.map(({ variant, width, height, className:skeletonClassName, ...skeletonProps }, cursor) => (
										<Skeleton className={skeletonClassName? skeletonClassName : ""} variant={variant? variant : "rect"} width={width? width : "100%"} {...(height? { height: height } : {})}  { ...skeletonProps } key={"row-skeleton-"+cursor}/>
									))}
								</div>);
							}
							else{
								return (<div className="w-full" key={"skeleton-"+index} ></div>);
							}
							
						})}
						</div>
					</VisibilitySensor>
				);
			}
			else{
				return  <VisibilitySensor onChange={this.onViewportVisibilityChange} className="min-w-full min-h-full" partialVisibility={partialVisibility} scrollCheck={scrollCheck}> 
							<Skeleton variant="rect" width={"100%"} height={120} />
						</VisibilitySensor>
			}
			
		}
		else if (placeholderType === "progress") {
			return  <VisibilitySensor onChange={this.onViewportVisibilityChange} className="min-w-full min-h-full" partialVisibility={partialVisibility} scrollCheck={scrollCheck}> 
						<ProgressIndicator type="circular" size={24} />
					</VisibilitySensor>
		}
		

		
	}
}

LazyModule.propTypes = {
	resolve: PropTypes.func,
	path: PropTypes.string,
	placeholderType: PropTypes.string,
	placeholder: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.array, PropTypes.string]),
	partialVisibility: PropTypes.bool, 
	scrollCheck: PropTypes.bool, 
};
LazyModule.defaultProps = {
	placeholderType: "skeleton",
	placeholder: { variant: "rect", width:"100%", height:200, animation: "wave" },
	partialVisibility: true, 
	scrollCheck: true, 
}
export default LazyModule;