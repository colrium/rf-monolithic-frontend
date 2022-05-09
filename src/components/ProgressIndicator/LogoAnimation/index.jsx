/** @format */

import React from "react";
import { motion } from "framer-motion";

export default function LogoAnimation(props) {
	let size = props.size ? props.size : 243.333;
	let circle_radius = props.thickness ? props.thickness : size / 44;
	size = size + (circle_radius*4);

	const left_path_x_points = [
		size / 2.1,
		size / 10.84,
		size / 2.1,
		size / 2.1,
		size / 2.1,
	];
	const left_path_y_points = [
		size / 1.35,
		size / 1.15,
		size / 7.47,
		size / 2.01,
		size / 1.35,
	];
	const right_path_x_points = [
		size / 1.9,
		size / 1.1,
		size / 1.9,
		size / 1.9,
		size / 1.9,
	];
	const right_path_y_points = [
		size / 7.47,
		size / 1.15,
		size / 1.35,
		size / 2.01,
		size / 7.47,
	];
	
	let left_path_d_anim = [];
	/*  left_path_x_points.map((point, index) => {
        if (index < (left_path_x_points.length - 1) ) {
            left_path_d_anim.push(("M " + point + " " + left_path_y_points[index] + " L " + left_path_x_points[(index + 1)] + " " + left_path_y_points[(index + 1)]));
        }
    }); */

	return (
		<svg
			version="1.1"
			viewBox={"0 0 " + size + " " + size}
			width={size}
			height={size}
		>
			<motion.circle
				cx={left_path_x_points[0]}
				cy={left_path_y_points[0]}
				r={circle_radius}
				fill="rgb(0,170,100)"
				stroke="rgb(0,170,100)"
				animate={{
					cx: [null, ...left_path_x_points],
					cy: [null, ...left_path_y_points],
				}}
				transition={{
					loop: Infinity,
					ease: "linear",
					duration: 1,
				}}
			/>
			<motion.circle
				cx={right_path_x_points[0]}
				cy={right_path_y_points[0]}
				r={circle_radius}
				fill="rgb(124,197,213)"
				stroke="rgb(124,197,213)"
				animate={{
					cx: [null, ...right_path_x_points],
					cy: [null, ...right_path_y_points],
				}}
				transition={{
					loop: Infinity,
					ease: [0.35, 0.11, 0.52, 0.79],
					duration: 1,
				}}
			/>

			{/* <motion.path
                d="M 115.84 121 L 115.84 180.421 L 22.454 210.748 L 115.84 32.587 L 115.84 121 Z"
                fill="rgba(0,170,100,0)"
                stroke="rgba(0,170,100)"
                animate={{ d: left_path_d_anim, pathLength: [0,1,0.5,1,0.5,1] }}
                transition={{
                    loop: Infinity,
                    ease: [0.35, 0.11, 0.52, 0.79],
                    duration: 1,
                    delay: 0.3,
                }}
            /> */}
			{/* <motion.path
                d="M 127.498 121 L 127.498 180.421 L 220.879 210.748 L 127.498 32.587 L 127.498 121 Z"
                fill="rgba(124,197,213,0)"
                stroke="rgba(124,197,213,0)"
                animate={{ fill: ["rgba(124, 197, 213, 0)", "rgba(124, 197, 213, 0)", "rgba(124,197,213,0)", "rgba(124, 197, 213, 0.2)", "rgba(124, 197, 213, 0.3)", "rgba(124,197,213,0.5)"] }}
                transition={{
                    loop: Infinity,
                    ease: [0.35, 0.11, 0.52, 0.79],
                    duration: 1,
                    delay: 0.7,
                }}
            /> */}
			{/* <path d="M 115.84 121 L 115.84 180.421 L 22.454 210.748 L 115.84 32.587 L 115.84 121 Z" stroke="rgb(0,170,100)" stroke-width="10px" />
            <path d="M 127.498 121 L 127.498 180.421 L 220.879 210.748 L 127.498 32.587 L 127.498 121 Z" stroke="rgb(124,197,213)" stroke-width="10px" /> */}
		</svg>
	);
}
