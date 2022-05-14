/** @format */

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import CartIcon from "@mui/icons-material/ShoppingCartOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { TextInput } from "components/FormInputs";
import Grid from '@mui/material/Grid';
;
import LazyImage from "components/LazyImage";
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { withNetworkServices } from "contexts/NetworkServices"
import { closeDialog, emptyCart, openDialog, removeFromCart, setCartNote, setCheckoutData, setOrder } from "state/actions"

import LoginDialog from "views/widgets/Auth/LoginDialog"
import ApiService from "services/Api"

function Widget(props) {
	let {
		cart,
		order,
		auth,
		removeFromCart,
		setCartNote,
		setOrder,
		emptyCart,
		setCheckoutData,
		closeDialog,
		openDialog,
		onProceedToCheckout,
		className,
	} = props
	let [loading, setLoading] = useState(false)
	let [error, setError] = useState(false)
	let [loginDialogOpen, setLoginDialogOpen] = useState(false)

	function confirmRemoveFromCart(entry) {
		openDialog({
			title: "Remove from Cart",
			body: "Are you sure you want to remove cart item?",
			actions: {
				cancel: {
					text: "Dismiss",
					color: "grey",
					onClick: closeDialog,
				},
				proceed: {
					text: "Remove",
					color: "error",
					onClick: () => {
						closeDialog()
						removeFromCart(entry)
					},
				},
			},
		})
	}

	function confirmEmptyCart() {
		openDialog({
			title: "Empty Cart",
			body: "Are you sure you want to remove all items from your cart?",
			actions: {
				cancel: {
					text: "Dismiss",
					color: "grey",
					onClick: closeDialog,
				},
				proceed: {
					text: "Empty",
					color: "error",
					onClick: () => {
						closeDialog()
						emptyCart()
					},
				},
			},
		})
	}

	function proceedToCheckout() {
		if (auth.isAuthenticated) {
			let currency = null
			if (Array.isArray(cart.entries)) {
				if (cart.entries.length > 0) {
					currency = cart.entries[0].item.currency ? cart.entries[0].item.currency._id : null
				}
			}

			let make_order_data = {
				currency: currency,
				total: cart.total,
				options_total: cart.options_total,
				discount: 0,
				tax: 0,
				customer: auth.user?._id,
				status: "awaiting_payment",
				apply_coupon: false,
				coupon: null,
				notes: cart.note,
				items: cart.entries.map((entry, index) => {
					return {
						item: entry.item._id,
						quantity: entry.quantity ? entry.quantity : 1,
						cost: entry.item.cost,
						options: entry.options ? entry.options : {},
						options_cost: entry.options_cost,
					}
				}),
			}

			if (order) {
				let gateway_params_data = {
					context: "order",
					order: order._id,
					currency: order.currency.symbol,
					amount: order.total,
					reference: order.reference,
					made_by: order.customer._id,
					account: "realfield",
					phone: order.customer.phone_number ? order.customer.phone_number : "",
					email: order.customer.email_address,
					mpesa: order.customer.country === "KE" ? "1" : "0",
					// p1: SocketIO ? SocketIO.socketId : "",
				}

				ApiService.get("/payments/gateway", gateway_params_data)
					.then(res => {
						setLoading(false)
						let gateway_params = res.body.data
						setCheckoutData(gateway_params)
						if (Function.isFunction(onProceedToCheckout)) {
							onProceedToCheckout()
						}
					})
					.catch(e => {
						setLoading(false)
					})
			} else {
				ApiService.post("retail/orders/make", make_order_data)
					.then(res => {
						let made_order = res.body.data
						setOrder(made_order)
						let gateway_params_data = {
							context: "order",
							order: made_order._id,
							currency: made_order.currency.symbol,
							amount: made_order.total,
							reference: made_order.reference,
							made_by: made_order.customer._id,
							account: "realfield",
							phone: made_order.customer.phone_number ? made_order.customer.phone_number : "",
							email: made_order.customer.email_address,
							mpesa: made_order.customer.country === "KE" ? "1" : "0",
							// p1: SocketIO ? SocketIO.socketId : "",
						}

						ApiService.get("/payments/gateway", gateway_params_data)
							.then(res => {
								setLoading(false)
								let gateway_params = res.body.data
								setCheckoutData(gateway_params)
								if (Function.isFunction(onProceedToCheckout)) {
									onProceedToCheckout()
								}
							})
							.catch(e => {
								setLoading(false)
							})
					})
					.catch(e => {
						setLoading(false)
					})
			}
		} else {
			setLoginDialogOpen(true)
		}
	}

	function setOrderNote(note) {
		if (order) {
			let updatedOrder = JSON.updateJSON(order, { notes: note })
			ApiService.put("retail/orders/" + order._id, updatedOrder)
				.then(res => {
					setOrder(updatedOrder)
					setCartNote(note)
				})
				.catch(e => {
					setLoading(false)
				})
		}
	}

	if (cart.entries.length > 0) {
		return (
			<Grid container className={"px-4" + (className ? " " + className : "")}>
				<Grid item  xs={12} sm={12} className="mb-4">
					<Typography variant="h4"> Cart </Typography>
					<Button color="warning" className="mt-2 w-auto" onClick={confirmEmptyCart}>
						{" "}
						Remove all{" "}
					</Button>
				</Grid>
				<Grid item  xs={12} className="p-0 m-0">
					<List className="w-full">
						{cart.entries.map((entry, index) => {
							let { item } = entry
							if (!JSON.isJSON(item)) {
								item = {}
							}
							return (
								<ListItem alignItems="flex-start" className="inverse mb-2 rounded" key={"cart-item-" + index}>
									<ListItemAvatar>
										<Avatar>
											<LazyImage
												alt={item.name}
												src={
													item.featured_image
														? ApiService.getAttachmentFileUrl(item.featured_image)
														: "https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo-chevron.svg"
												}
											/>
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={item.name}
										secondary={
											<Grid container className="p-0">
												<Grid item  xs={12} className="m-0 p-0">
													<Typography component="span" variant="body2" className="w-full " color="grey">
														{" "}
														{item.description}{" "}
													</Typography>
												</Grid>
												<Grid item  xs={12} className="m-0 mt-2 p-0">
													<Typography component="span" variant="body2" className="inline">
														{" "}
														Cost: {item.cost}{" "}
													</Typography>
												</Grid>
												<Grid item  xs={12} className="m-0 mt-2 p-0">
													<Typography component="span" variant="body2" className="inline">
														{" "}
														Options: {entry.options_cost}{" "}
													</Typography>
												</Grid>
												<Grid item  xs={12} className="m-0 mt-2 p-0">
													<Button
														color="warning"
														onClick={event => confirmRemoveFromCart(entry)}
														disabled={loading}
													>
														{" "}
														Remove{" "}
													</Button>
												</Grid>
											</Grid>
										}
									/>
								</ListItem>
							)
						})}
					</List>
				</Grid>
				<Grid item  xs={12} className="p-2">
					<Grid container className="p-0">
						<Grid item  xs={12} sm={12} md={6} className="mb-2">
							<TextInput
								type="text"
								label="Order Note"
								name="note"
								multiline
								rows={4}
								variant="outlined"
								value={cart.note}
								onChange={value => setOrderNote(value)}
								helperText="Leave a note with your order"
							/>
						</Grid>

						<Grid item  xs={12} sm={12} md={6} className="mb-4 flex flex-col">
							<Typography component="span" variant="h2" className="text-right">
								<span className="text-gray-500 mr-2 text-base">{cart.currency}</span>
								<span className="text-3xl">{cart.total}</span>
							</Typography>

							<Typography component="span" variant="h4" className="text-right">
								<span className="text-gray-400 mr-4 text-xs">Options: </span>
								<span className="text-gray-500 mr-2 text-xs">{cart.currency}</span>
								<span className="text-sm">{cart.options_total}</span>
							</Typography>
						</Grid>
					</Grid>

					<Grid container className="p-0">
						<Grid item  xs={12} sm={12} className="mb-2">
							<Button
								color="primary"
								className=" w-auto"
								onClick={e => {
									proceedToCheckout()
								}}
								right
							>
								{" "}
								Proceed to Checkout{" "}
							</Button>
						</Grid>
						<Grid item  xs={12} sm={12} className="mb-4">
							<Typography component="span" variant="body2" className="w-full text-right text-gray-700">
								{" "}
								Shipping & taxes calculated at checkout{" "}
							</Typography>
						</Grid>
					</Grid>
					<LoginDialog open={loginDialogOpen} onLogin={proceedToCheckout} title="Login to Proceed" />
				</Grid>
			</Grid>
		)
	} else {
		return (
			<Grid container className={"px-4" + (className ? " " + className : "")}>
				<Grid item  xs={12} className="p-0 m-0 my-20 text-center">
					<CartIcon className="text-6xl m-auto text-gray-500" />
				</Grid>

				<Grid item  xs={12} className="p-0 m-0">
					<Typography component="span" variant="subtitle1" className="w-full text-center text-gray-500">
						{" "}
						Your Cart is empty{" "}
					</Typography>
				</Grid>
			</Grid>
		)
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	cart: state.ecommerce.cart,
	order: state.ecommerce.order,
})

export default connect(mapStateToProps, {
	removeFromCart,
	setCartNote,
	setOrder,
	emptyCart,
	setCheckoutData,
	closeDialog,
	openDialog,
})(Widget)
