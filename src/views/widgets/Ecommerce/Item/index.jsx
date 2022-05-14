/** @format */

import Chip from "@mui/material/Chip";
import Skeleton from '@mui/material/Skeleton';
import Button from "@mui/material/Button";
import { DynamicInput } from "components/FormInputs";
import Grid from '@mui/material/Grid';
;
import LazyImage from "components/LazyImage";
import Typography from '@mui/material/Typography';
import React from "react";
import { connect } from "react-redux";
import ApiService from "services/Api";
import { addToCart } from "state/actions";


class Widget extends React.Component {
	state = {
		item: {},
		options: {},
		options_cost: 0,
		selected_image: null,
		loading: false,
		canAddToCart: false,
		variantsError: false,
	};

	constructor(props) {
		super(props);
		const { item, options, loading } = this.props;
		this.state.item = item;
		this.state.loading = loading ? true : false;
		this.state.options = JSON.isJSON(options) ? options : {};
		this.state.selected_image = JSON.isJSON(item)
			? item.featured_image
				? ApiService.getAttachmentFileUrl(item.featured_image)
				: null
			: null;
		this.handleOnItemAdd = this.handleOnItemAdd.bind(this);
		this.handleOnImageSelect = this.handleOnImageSelect.bind(this);
		this.handleOnVariantsChange = this.handleOnVariantsChange.bind(this);
	}

	componentDidMount() {
		const { item, options, loading } = this.state;
		if (JSON.isJSON(item)) {
			this.calculateOptionsPrice();
			this.canAddToCart();
		}
	}

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		if (!Object.areEqual(prevProps, this.props)) {
			return {
				applyChanges: true,
			};
		}
		return {
			applyChanges: false,
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot.applyChanges) {
			let newState = JSON.updateJSON(this.state, this.props);
			this.setState(newState);
			this.calculateOptionsPrice();
			this.canAddToCart();
		}
	}

	handleOnItemAdd = event => {
		const { onItemAdd, addToCart } = this.props;
		const { item, options, options_cost } = this.state;
		if (Function.isFunction(onItemAdd)) {
			onItemAdd({
				item: item,
				options: options,
				options_cost: options_cost,
			});
		}
	};

	calculateOptionsPrice(options = false) {
		const { item } = this.state;
		if (JSON.isJSON(item)) {
			const { variants, cost } = item;
			if (!JSON.isJSON(options)) {
				options = this.state.options;
			}
			let options_cost = 0;
			if (JSON.isJSON(variants)) {
				for (let { name, ...variant } of Object.values(variants)) {
					if (options[name]) {
						if (variant.cost_effect_type == "amount") {
							options_cost =
								options_cost +
								Number.parseNumber(variant.cost_effect, 0);
						} else if (variant.cost_effect_type == "percentage") {
							let option_price =
								(Number.parseNumber(cost, 0) *
									Number.parseNumber(
										variant.cost_effect,
										0
									)) /
								100;
							options_cost = options_cost + option_price;
						}
					}
				}
			}
			this.setState({ options_cost: options_cost });
		}
	}

	handleOnVariantsChange = name => value => {
		let options = {};

		if (JSON.isJSON(value)) {
			for (let [name, value] of Object.entries(value)) {
				options[name] = value;
			}
		}
		this.calculateOptionsPrice(options);
		this.canAddToCart(options);
		this.setState({ options: options });
	};

	handleOnImageSelect = src => event => {
		this.setState({ selected_image: src });
	};

	canAddToCart(options = false) {
		const { item } = this.state;
		if (JSON.isJSON(item)) {
			const { variants } = item;
			if (!JSON.isJSON(options)) {
				options = this.state.options;
			}
			let canAddToCart = true;
			let variantsError = false;
			if (JSON.isJSON(variants)) {
				for (let [name, variant] of Object.entries(variants)) {
					if (
						variant.required &&
						(!(variant.name in options) || !options[variant.name])
					) {
						canAddToCart = false;
						variantsError = variant.label + " is required ";
						break;
					}
				}
			}

			this.setState({
				canAddToCart: canAddToCart,
				variantsError: variantsError,
			});
		}
	}

	render() {
		const { item, options_cost, loading } = this.state;
		if (loading) {
			return (
				<Grid container className="p-0 m-0">
					<Grid container>
						<Grid item  xs={12} md={4} className="p-0 m-0">
							<Grid container className="p-0 m-0">
								<Grid item  xs={12}>
									<Skeleton
										variant="rect"
										width={"90%"}
										height={28}
									/>
								</Grid>

								<Grid item  xs={12}>
									<Skeleton
										variant="rect"
										width={"30%"}
										height={37}
									/>
								</Grid>

								<Grid item  xs={12}>
									<Skeleton
										variant="text"
										className="mb-1"
										width="80%"
									/>
									<Skeleton
										variant="text"
										className="mb-1"
										width="80%"
									/>
									<Skeleton
										variant="text"
										className="mb-1"
										width="70%"
									/>
									<Skeleton
										variant="text"
										className="mb-1"
										width="30%"
									/>
								</Grid>

								<Grid item  xs={12} className="flex">
									<Skeleton
										variant="rect"
										className="m-1 w-16 h-8 rounded-full"
									/>
									<Skeleton
										variant="rect"
										className="m-1 w-16 h-8 rounded-full"
									/>
									<Skeleton
										variant="rect"
										className="m-1 w-16 h-8 rounded-full"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item  xs={12} md={8} className="p-0 m-0">
							<Grid container className="p-0 m-0 flex flex-col">
								<Skeleton
									variant="rect"
									className="w-full"
									height={400}
								/>
								<div className="p-2 w-full flex">
									<Skeleton
										variant="rect"
										className="sm:w-1/4 md:w-16 mx-1"
										width={74}
										height={64}
									/>
									<Skeleton
										variant="rect"
										className="sm:w-1/4 md:w-16 mx-1"
										width={74}
										height={64}
									/>
									<Skeleton
										variant="rect"
										className="sm:w-1/4 md:w-16 mx-1"
										width={74}
										height={64}
									/>
								</div>
							</Grid>
						</Grid>
					</Grid>

					<Grid container>
						<Grid item  xs={12} className="px-0 m-0">
							<Skeleton
								variant="rect"
								className="w-24 rounded"
								height={34}
							/>
						</Grid>
					</Grid>
				</Grid>
			);
		} else {
			return (
				<Grid container className="p-0 m-0">
					<Grid item  xs={12} md={4} className="p-0 m-0">
						<Grid container className="p-0 m-0">
							<Grid item  xs={12}>
								<Typography variant="h3" gutterBottom>
									{item.name}
								</Typography>
							</Grid>

							{item.cost > 0 && JSON.isJSON(item.currency) && (
								<Grid item  xs={12}>
									<span className="text-2xl text-gray-500">
										{item.currency.html_symbol}
									</span>
									<span className="text-3xl text-gray-900">
										{(item.cost > 0 ? item.cost : 0) +
											options_cost}
									</span>
								</Grid>
							)}

							{
								<Grid item  xs={12}>
									<span className="text-gray-500 mr-2">
										Variants price:
									</span>
									<span className="text-gray-900">
										{(JSON.isJSON(item.currency)
											? item.currency.html_symbol
												? item.currency.html_symbol
												: ""
											: "") +
											" " +
											options_cost}
									</span>
								</Grid>
							}

							<Grid item  xs={12}>
								<Typography variant="body1" gutterBottom>
									{item.description}
								</Typography>
							</Grid>

							<Grid item  xs={12}>
								{item.item_type === "service" && (
									<Chip
										className="m-1"
										size="small"
										label={"Service"}
									/>
								)}
								{item.item_type === "product" && (
									<Chip
										className="m-1"
										size="small"
										label={"Product"}
									/>
								)}
								{item.available && (
									<Chip
										className="m-1"
										size="small"
										label={"Available"}
									/>
								)}
								{item.taxable && (
									<Chip
										className="m-1"
										size="small"
										label={"Taxable"}
									/>
								)}
								{item.discountable && (
									<Chip
										className="mx-1"
										size="small"
										label={"Discountable"}
									/>
								)}

								{Array.isArray(item.categories) && (
									<div>
										{" "}
										{item.categories.map(
											(category, index) => (
												<Chip
													label={category}
													className="m-1"
													size="small"
													key={"category-" + index}
												/>
											)
										)}{" "}
									</div>
								)}
								{Array.isArray(item.tags) && (
									<div>
										{" "}
										{item.tags.map((tag, index) => (
											<Chip
												label={tag}
												className="m-1"
												size="small"
												key={"tag-" + index}
											/>
										))}{" "}
									</div>
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid item  xs={12} md={8} className="p-0 m-0">
						<Grid container className="p-0 m-0 flex flex-col">
							<div className="p-2 w-full flex-grow">
								<LazyImage
									className="w-full h-auto"
									src={
										this.state.selected_image
											? this.state.selected_image
											: ("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo-chevron.svg")
									}
								/>
							</div>
							<div className="p-2 w-full flex">
								{item.featured_image && (
									<LazyImage
										className="sm:w-1/4 md:w-16 mx-1 cursor-pointer hover:opacity-50"
										src={ApiService.getAttachmentFileUrl(
											item.featured_image
										)}
										onClick={this.handleOnImageSelect(
											ApiService.getAttachmentFileUrl(
												item.featured_image
											)
										)}
									/>
								)}

								{item.images.map((image, index) => (
									<LazyImage
										className="sm:w-1/4 md:w-16 mx-1 cursor-pointer hover:opacity-50"
										src={ApiService.getAttachmentFileUrl(
											image
										)}
										onClick={this.handleOnImageSelect(
											ApiService.getAttachmentFileUrl(
												image
											)
										)}
										key={"item-image-" + index}
									/>
								))}
							</div>
						</Grid>
					</Grid>

					<Grid container className="px-0 m-0">
						{JSON.isJSON(item.variants) &&
							JSON.isJSON(item.variants) && (
								<Grid item  xs={12} className="px-0 m-0">
									<DynamicInput
										label="Variants"
										mode="generation"
										name="variants"
										blueprint={item.variants}
										value={this.state.options}
										onChange={this.handleOnVariantsChange(
											"variants"
										)}
										variant="outlined"
										error={this.state.variantsError}
										validate
									/>
								</Grid>
							)}

						<Grid item  xs={12} className="px-0 m-0">
							<Button
								color="primary"
								onClick={this.handleOnItemAdd}
								disabled={!this.state.canAddToCart}
							>
								{" "}
								Add to Cart{" "}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			);
		}
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	cart: state.ecommerce.cart,
});

export default (connect(mapStateToProps, { addToCart })(Widget));
