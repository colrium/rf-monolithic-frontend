import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import {
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
	InputBase,
	FormHelperText,
	Stack,
} from "@mui/material"
import {
	VisibilityOffOutlined as HidePasswordIcon,
	VisibilityOutlined as ShowPasswordIcon,
} from "@mui/icons-material"
import {useSetState} from "hooks"

const Field = React.forwardRef((props, ref) => {
    const { name, control, defaultValue, value, rules, shouldUnregister, helperText, onChange, disabled, render, type, inputRef, InputProps, ...rest } = props;
	const [state, setState, getState] = useSetState({
		showPassword: false
	})
	const formState = control._formState
	const handleOnChange = useCallback(defaultOnChange => e => {
		if (Function.isFunction(onChange)) {
			onChange(e)
		}
		if (Function.isFunction(defaultOnChange)) {
			defaultOnChange(e)
		}
	}, [onChange])

    const renderField = useCallback(
		params => {
			if (Function.isFunction(props.render)) {
				return props.render(params)
			}
			const {
				field: {
					onChange: fieldOnChange,
					value: fieldValue,
					ref: fieldRef,
					...fieldParams
				},
				fieldState: { isTouched, invalid, isDirty, error },
			} = params

			const {showPassword} = getState()

			//
			return (
				<TextField
					{...fieldParams}
					type={showPassword ? "text" : props.type}
					value={fieldValue}
					onChange={handleOnChange(fieldOnChange)}
					disabled={disabled || formState.isSubmitting}
					error={invalid}
					InputProps={{
						...props.InputProps,
						endAdornment:
							(props.type === "password" ||
								props.loading ||
								(props.InputProps &&
									props.InputProps.endAdornment)) &&
							(!props.InputProps?.endAdornment ? (
								<InputAdornment position="end">
									{props.loading && (
										<CircularProgress
											size={"1rem"}
											color="inherit"
										/>
									)}
									{props.type === "password" && (
										<IconButton
											aria-label="Toggle password visibility"
											color="inherit"
											onClick={() =>
												setState(prevState => ({
													showPassword:
														props.type ===
														"password"
															? !prevState.showPassword
															: false,
												}))
											}
										>
											{showPassword ? (
												<HidePasswordIcon fontSize="small" />
											) : (
												<ShowPasswordIcon fontSize="small" />
											)}
										</IconButton>
									)}
								</InputAdornment>
							) : (
								<div className="flex flex-row">
									<InputAdornment position="end">
										{props.loading && (
											<CircularProgress
												size={"1rem"}
												color="inherit"
											/>
										)}
										{props.type === "password" && (
											<IconButton
												aria-label="Toggle password visibility"
												color="inherit"
												onClick={e => {
													setState(prevState => ({
														showPassword:
															props.type ===
															"password"
																? !prevState.showPassword
																: false,
													}))
												}}
											>
												{showPassword ? (
													<HidePasswordIcon fontSize="small" />
												) : (
													<ShowPasswordIcon fontSize="small" />
												)}
											</IconButton>
										)}
									</InputAdornment>
									{props.InputProps &&
										props.InputProps.endAdornment}
								</div>
							)),
					}}
					helperText={
						<Stack className="w-full">
							{!!error?.message && (
								<FormHelperText component="div" error>
									{error?.message}
								</FormHelperText>
							)}
							{!!props.helperText && (
								<FormHelperText component="div" error={false}>
									{props.helperText}
								</FormHelperText>
							)}
						</Stack>
					}
					inputRef={props.inputRef || fieldRef}
					ref={ref}
					fullWidth
					variant="filled"
					{...rest}
				/>
			)
		},
		[ props]
	)

    return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={rules}
			shouldUnregister={shouldUnregister}
			render={params => renderField(params)}
		/>
	)
})

export default React.memo(Field);
