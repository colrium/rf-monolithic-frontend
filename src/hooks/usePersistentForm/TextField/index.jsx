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
    const {
		name,
		control,
		defaultValue,
		value,
		rules,
		shouldUnregister,
		helperText,
		onChange,
		onFocus,
		onBlur,
		disabled,
		render,
		type,
		inputRef,
		multiline,
		rows,
		maxRows,
		minRows,
		InputProps,
		sx,
		debounce = 250,
		variant,
		...rest
	} = props
	const [state, setState, getState] = useSetState({
		showPassword: false,
	})
	const formState = control._formState
	const handleOnChange = useCallback(
		defaultOnChange => e => {
			if (Function.isFunction(defaultOnChange)) {
				defaultOnChange(e)
			}
			// if (Function.isFunction(onChange)) {
			// 	onChange(e)
			// }
		},
		[onChange]
	)

	const handleOnFocus = useCallback(
		defaultOnFocus => e => {
			if (Function.isFunction(defaultOnFocus)) {
				defaultOnFocus(e)
			}
			if (Function.isFunction(onFocus)) {
				onFocus(e)
			}
		},
		[onFocus]
	)

	const handleOnBlur = useCallback(
		defaultOnBlur => e => {
			if (Function.isFunction(defaultOnBlur)) {
				defaultOnBlur(e)
			}
			if (Function.isFunction(onBlur)) {
				onBlur(e)
			}
		},
		[onBlur]
	)

	const renderField = useCallback(
		params => {
			if (Function.isFunction(props.render)) {
				return props.render(params)
			}
			const {
				field: {
					onChange: fieldOnChange,
					onFocus: fieldOnFocus,
					onBlur: fieldOnBlur,
					value: fieldValue,
					ref: fieldRef,
					...fieldParams
				},
				fieldState: { isTouched, invalid, isDirty, error },
			} = params

			//
			return (
				<TextField
					{...fieldParams}
					type={state.showPassword ? "text" : props.type}
					value={fieldValue}
					onChange={handleOnChange(fieldOnChange)}
					onFocus={handleOnFocus(fieldOnFocus)}
					onBlur={handleOnBlur(fieldOnBlur)}
					disabled={disabled || formState.isSubmitting}
					error={isTouched && !!error?.message}
					InputProps={{
						...props.InputProps,
						endAdornment:
							(props.type === "password" || props.loading || (props.InputProps && props.InputProps.endAdornment)) &&
							(!props.InputProps?.endAdornment ? (
								<InputAdornment position="end">
									{props.loading && <CircularProgress size={"1rem"} color="inherit" />}
									{props.type === "password" && (
										<IconButton
											aria-label="Toggle password visibility"
											color="inherit"
											onClick={() =>
												setState(prevState => ({
													showPassword: props.type === "password" ? !prevState.showPassword : false,
												}))
											}
										>
											{state.showPassword ? (
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
										{props.loading && <CircularProgress size={"1rem"} color="inherit" />}
										{props.type === "password" && (
											<IconButton
												aria-label="Toggle password visibility"
												color="inherit"
												onClick={e => {
													setState(prevState => ({
														showPassword: props.type === "password" ? !prevState.showPassword : false,
													}))
												}}
											>
												{state.showPassword ? (
													<HidePasswordIcon fontSize="small" />
												) : (
													<ShowPasswordIcon fontSize="small" />
												)}
											</IconButton>
										)}
									</InputAdornment>
									{props.InputProps && props.InputProps.endAdornment}
								</div>
							)),
					}}
					helperText={
						<Stack className="w-full">
							{isTouched && !!error?.message && (
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
					sx={{
						"& .MuiFormHelperText-root": {
							marginLeft: `2px !important`,
							marginRight: `2px !important`,
						},
						...sx,
					}}
					inputRef={props.inputRef || fieldRef}
					ref={ref}
					fullWidth
					variant={variant}
					multiline={multiline}
					rows={rows}
					maxRows={maxRows}
					minRows={minRows}
					{...rest}
				/>
			)
		},
		[props, state]
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
