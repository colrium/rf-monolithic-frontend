/** @format */

import React, { useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setCurrentUser, setPreferences, setSettings } from "state/actions"
import Api from "services/Api"
import { EventRegister } from "utils"
import { useDidMount } from "hooks"


const ApiService = props => {
	const { children } = props
	const dispatch = useDispatch()
	const preferences = useSelector(state => ({ ...state.app?.preferences }))
	const settings = useSelector(state => ({ ...state.app?.settings }))
	const { user, isAuthenticated } = useSelector(state => state.auth)



	useDidMount(() => {

		return () => {
		}
	})

	return children(Api)
}

export default React.memo(ApiService)
