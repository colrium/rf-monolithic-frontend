/** @format */

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ProgressIndicator from "components/ProgressIndicator";
import Skeleton from "@material-ui/lab/Skeleton";

function Placeholder(props) {
	let [state, setState] = useState(props);

	useEffect(() => {
		setState(props);
	}, [props]);

	let { className, placeholder, type } = state;

	if (type === "skeleton") {
		if (JSON.isJSON(placeholder)) {
			const { variant, width, height, ...skeletonProps } = placeholder;
			return (
				<Skeleton
					variant={variant ? variant : "rect"}
					width={width ? width : "100%"}
					height={height ? height : "auto"}
					{...skeletonProps}
				/>
			);
		} else if (Array.isArray(placeholder)) {
			return (
				<div className="w-full min-h-full flex flex-col relative">
					{placeholder.map((skeleton, index) => {
						if (JSON.isJSON(skeleton)) {
							const {
								variant,
								width,
								height,
								className: skeletonClassName,
								...skeletonProps
							} = skeleton;
							return (
								<div
									className={
										skeletonClassName
											? skeletonClassName
											: "w-full"
									}
									key={"skeleton-" + index}
								>
									<Skeleton
										variant={variant ? variant : "rect"}
										width={width ? width : "100%"}
										{...(height ? { height: height } : {})}
										{...skeletonProps}
									/>
								</div>
							);
						} else if (Array.isArray(skeleton)) {
							return (
								<div
									className="w-full flex flex-row relative"
									key={"skeleton-row-" + index}
								>
									{skeleton.map(
										(
											{
												variant,
												width,
												height,
												className: skeletonClassName,
												...skeletonProps
											},
											cursor
										) => (
											<Skeleton
												className={
													skeletonClassName
														? skeletonClassName
														: ""
												}
												variant={
													variant ? variant : "rect"
												}
												width={width ? width : "100%"}
												{...(height
													? { height: height }
													: {})}
												{...skeletonProps}
												key={"row-skeleton-" + cursor}
											/>
										)
									)}
								</div>
							);
						} else {
							return (
								<div
									className="w-full"
									key={"skeleton-" + index}
								></div>
							);
						}
					})}
				</div>
			);
		} else {
			return <Skeleton variant="rect" width={"100%"} height={120} />;
		}
	} 
	else if (type === "progress") {
		return <ProgressIndicator type="circular" size={24} />;
	}
	else if (type === "logo") {
		return <ProgressIndicator type="logo" size={24} thickness={5} className="absolute center" />;
	}  
	else {
		return <Skeleton variant="rect" width={"100%"} height={"100%"} />;
	}
}

Placeholder.propTypes = {
	type: PropTypes.string,
	placeholder: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.object,
		PropTypes.array,
		PropTypes.string,
	]),
};
Placeholder.defaultProps = {
	type: "skeleton",
	placeholder: {
		variant: "rect",
		width: "100%",
		height: "100%",
		animation: "wave",
	},
};

export default Placeholder;
