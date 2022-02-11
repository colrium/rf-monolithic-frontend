/** @format */
import ApiService from "services/Api"
import setMessagingCache from "./setMessagingCache"

export default function fetchContacts(params = {}, persist=false) {
	return async (dispatch, getState) => {
		const { auth } = getState()
		if (auth.isAuthenticated) {
			let fetch_error = false;
			const fetchedContacts = await ApiService.get("/contacts", {
				params: {
					pagination: 50,
					...params,
					fields: "_id,avatar,first_name,last_name,email_address,phone_number,admin_level_1,admin_level_2,admin_level_3,rating,tokens,presence,gender,last_known_position",
				},
			})
				.then(res => {
					const { data } = res.body
					return data
				})
				.catch(err => {
					fetch_error = error;
					return []
				})

			if (
				Array.isArray(fetchedContacts) &&
				(persist || JSON.isEmpty(params)) &&
				!fetch_error
			) {
				dispatch(setMessagingCache("contacts", fetchedContacts))
			}

			return fetchedContacts
		}

		return []
	}
}
