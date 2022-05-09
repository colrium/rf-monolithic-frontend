/** @format */

import React from "react"
import IconButton from "@mui/material/IconButton"
import { useSetState } from "hooks"

const LinkAddComponent = props => {
	const { config, currentState, onChange } = props
	const fontSize = currentState?.fontSize || 12

	const [state, setState] = useSetState({
		open: false,
		popOverAnchorEl: null,
		id: String.uuid(),
	})

	const handleOnChange = value => event => {
		event.stopPropagation()
		console.log("LinkAddComponent onChange ", onChange)
		// onChange("link", value)
	}

	return (
		<div onClick={event => event.stopPropagation()} className="inline-block">
			{Array.isArray(config.options) &&
				config.options.map(
					(option, index) =>
						option in config && (
							<IconButton
								onClick={handleOnChange(option)}
								className="text-gray-700 hover:text-gray-900 focus:text-gray-900"
								key={option + "-" + index}
							>
								{String.isString(config[option].icon) ? <img src={config[option].icon} /> : config[option].icon}
							</IconButton>
						)
				)}
		</div>
	)
}

export default React.memo(LinkAddComponent, (prevProps, nextProps) => Object.areEqual(prevProps.currentState, nextProps.currentState))
