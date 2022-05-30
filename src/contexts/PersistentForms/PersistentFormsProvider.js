/** @format */

import React, {useRef} from "react"
import {usePersistentForm} from "hooks"
import PersistentFormsContext from './PersistentFormsContext';
const DEFAULT_CONFIG = {
	name: "default",
	mode: "all",
	reValidateMode: "onChange",
	resolver: undefined,
	context: undefined,
	criteriaMode: "firstError",
	shouldFocusError: true,
	shouldUnregister: false,
	shouldUseNativeValidation: false,
	delayError: undefined,
	defaultValues: {},
	watch: true,
	volatile: false,
	exclude: [],
	include: [],
}

export const PersistentFormsProvider = props => {
	const { children, config, ...rest } = props
	const currentValue = {...PersistentFormsContext?._currentValue}
	const name = config?.name || `form-${String.uuid()}`
	const form = usePersistentForm({ ...config, name: name })
	return (
		<PersistentFormsContext.Provider {...rest} value={{...currentValue, [name]: form}}>
			{children}
		</PersistentFormsContext.Provider>
	)

}

export default PersistentFormsProvider
