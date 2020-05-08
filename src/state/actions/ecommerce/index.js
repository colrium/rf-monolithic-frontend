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

export function setCart(cart) {
	return {
		type: SET_CART,
		cart,
	};
}

export function addToCart(entry) {
	return {
		type: ADD_TO_CART,
		entry,
	};
}

export function removeFromCart(entry) {
	return {
		type: REMOVE_FROM_CART,
		entry,
	};
}

export function setCartNote(note) {
	return {
		type: SET_CART_NOTE,
		note,
	};
}

export function emptyCart() {
	return {
		type: EMPTY_CART,
	};
}

export function setOrderProgress(order_progress) {
	return {
		type: SET_ORDER_PROGRESS,
		order_progress,
	};
}

export function setOrder(order) {
	return {
		type: SET_ORDER,
		order,
	};
}

export function setCheckoutData(checkout_data) {
	return {
		type: SET_CHECKOUT_DATA,
		checkout_data,
	};
}

export function resetEcommerce() {
	return {
		type: RESET_ECOMMERCE,
	};
}
