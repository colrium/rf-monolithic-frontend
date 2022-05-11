/** @format */

import React from "react"
import IconButton from "@mui/material/IconButton"
import { useDidMount } from "hooks"

const IconsOnly = props => {
	const { config } = props


	return (
		<div className="inline-block">
			{Array.isArray(config.options) &&
				config.options.map(
					(option, index) =>
						option in config && (
							<IconButton
								sx={{
									color: theme => theme.palette.text.secondary,
								}}
								size="small"
								key={option + "-" + index}
							>
								{String.isString(config[option].icon) ? <img src={config[option].icon} /> : config[option].icon}{" "}
							</IconButton>
						)
				)}
		</div>
	)
}

export default React.memo(IconsOnly)
