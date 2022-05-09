/** @format */

import {
	SET_CART,
	ADD_TO_CART,
	REMOVE_FROM_CART,
	SET_CART_NOTE,
	SET_ORDER_PROGRESS,
	SET_ORDER,
	SET_CHECKOUT_DATA,
	EMPTY_CART,
	RESET_ECOMMERCE,
} from "state/actions";

const initialState = {
	order_progress: {
		step_name: "start",
		steps_data: {},
	},
	cart: {
		currency: "USD",
		total: 0,
		options_total: 0,
		entries: [],
		note: "",
	},
	order: false,
	checkout_data: {},
};

function addEntryToCart(cart, entry) {
	let newCart = JSON.parse(JSON.stringify(cart));
	if (!Array.isArray(newCart.entries)) {
		newCart.entries = [];
	}
	newCart.entries = newCart.entries.concat([entry]);
	let newTotal = newCart.total;
	let newOptionsTotal = Number.parseNumber(newCart.options_total, 0);
	if (JSON.isJSON(entry.item)) {
		newTotal = newTotal + Number.parseNumber(entry.item.cost, 0);
	}
	newTotal = newTotal + Number.parseNumber(entry.options_cost, 0);
	newOptionsTotal =
		newOptionsTotal + Number.parseNumber(entry.options_cost, 0);
	newCart.total = newTotal;
	newCart.options_total = newOptionsTotal;
	return newCart;
}

function removeEntryFromCart(cart, entry) {
	let newCart = JSON.parse(JSON.stringify(cart));
	let newTotal = Number.parseNumber(newCart.total, 0);
	let newOptionsTotal = Number.parseNumber(newCart.options_total, 0);
	if (Array.isArray(newCart.entries)) {
		newCart.entries = newCart.entries.filter((item, index) => {
			if (JSON.isJSON(entry)) {
				if (!Object.areEqual(item, entry)) {
					return true;
				} else {
					if (JSON.isJSON(item.item)) {
						newTotal =
							newTotal - Number.parseNumber(item.item.cost, 0);
					}
					newTotal =
						newTotal - Number.parseNumber(item.options_cost, 0);
					newOptionsTotal =
						newOptionsTotal -
						Number.parseNumber(item.options_cost, 0);
				}
			} else if (Number.isNumber(entry)) {
				if (entry !== index) {
					return true;
				} else {
					if (JSON.isJSON(item.item)) {
						newTotal =
							newTotal - Number.parseNumber(item.item.cost, 0);
					}
					newTotal =
						newTotal - Number.parseNumber(item.options_cost, 0);
					newOptionsTotal =
						newOptionsTotal -
						Number.parseNumber(item.options_cost, 0);
				}
			}
			return false;
		});
	}
	if (newTotal < 0) {
		newTotal = 0;
	}
	if (newOptionsTotal < 0) {
		newOptionsTotal = 0;
	}
	newCart.total = newTotal;
	newCart.options_total = newOptionsTotal;
	return newCart;
}

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_CART: {
			return {
				...state,
				cart: action.cart,
			};
		}
		case ADD_TO_CART: {
			return {
				...state,
				cart: addEntryToCart(state.cart, action.entry),
			};
		}
		case REMOVE_FROM_CART: {
			return {
				...state,
				cart: removeEntryFromCart(state.cart, action.entry),
			};
		}
		case SET_CART_NOTE: {
			return {
				...state,
				cart: { ...state.cart, note: action.note },
			};
		}
		case EMPTY_CART: {
			return {
				...state,
				cart: initialState.cart,
			};
		}
		case SET_ORDER_PROGRESS: {
			return {
				...state,
				order_progress: action.order_progress,
			};
		}
		case SET_ORDER: {
			return {
				...state,
				order: action.order,
			};
		}
		case SET_CHECKOUT_DATA: {
			return {
				...state,
				checkout_data: action.checkout_data,
			};
		}
		case RESET_ECOMMERCE: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};
