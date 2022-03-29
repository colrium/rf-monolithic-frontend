/** @format */

import React from "react"
import Box from "@mui/material/Box"
import { motion } from "framer-motion"
import { useTheme } from "@mui/material/styles"

const TypingIndicator = props => {
	const { className, ...rest } = props
	const theme = useTheme()
	const defaultTop = parseInt(theme.spacing(1).replace("px", ""))
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.5,
			},
		},
	}
	const dotVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: [0.5, 0.5, 0.5],
			// scale: [1, 0.5, 1],
			top: [0, -defaultTop, 0],
		},
	}

	return (
		<Box component={"div"} className={`p-1 flex flex-col justify-center px-4 ${className ? className : ""}`} {...rest}>
			<Box className={`flex flex-row items-center relative rounded-full`}>
				<motion.div
					className="h-2 w-2 rounded-full absolute m-1 left-0"
					style={{ backgroundColor: theme.palette.text.primary }}
					variants={dotVariants}
					initial="hidden"
					animate="show"
					transition={{ repeat: Infinity, duration: 1 }}
				/>
				<motion.div
					className="h-2 w-2 rounded-full absolute m-1 left-4"
					style={{ backgroundColor: theme.palette.text.primary }}
					variants={dotVariants}
					initial="hidden"
					animate="show"
					transition={{ repeat: Infinity, duration: 0.75, delay: 0.5 }}
				/>
				<motion.div
					className="h-2 w-2 rounded-full absolute m-1 left-8"
					style={{ backgroundColor: theme.palette.text.primary }}
					variants={dotVariants}
					initial="hidden"
					animate="show"
					transition={{ repeat: Infinity, duration: 0.75 }}
				/>
			</Box>
		</Box>
	)
}

export default React.memo(TypingIndicator)
