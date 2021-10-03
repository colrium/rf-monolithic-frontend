/** @format */

import Skeleton from "@material-ui/lab/Skeleton";
import LogoChevron from "assets/img/realfield/logo-chevron.svg";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import LazyImage from "components/LazyImage";
import ScrollBars from "components/ScrollBars";
import React from "react";
import ApiService from "services/Api";
import withRoot from "hoc/withRoot";

class GridView extends React.Component {
	state = {
		retailitems: [],
		loading: true,
		load_err: false,
	};

	constructor(props) {
		super(props);
		const { params } = this.props;
		this.state.params = { p: 1 };
		if (JSON.isJSON(params)) {
			this.state.params = { ...params, p: 1 };
		}
		this.handleOnItemSelect = this.handleOnItemSelect.bind(this);
	}

	componentDidMount() {
		this.loadItems();
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		const { params } = this.props;
		let updatedParams = { p: 1 };
		if (JSON.isJSON(params)) {
			updatedParams = { ...params, p: 1 };
			if (!Object.areEqual(this.state.params, updatedParams)) {
				this.setState({ params: params }, () => {
					this.loadItems();
				});
			}
		}
	}

	loadItems() {
		const params = this.state.params;
		this.setState(prevState => ({ loading: true, load_err: null }));
		ApiService.get("retail/items", params)
			.then(res => {
				this.setState(prevState => ({
					retailitems: res.body.data,
					loading: false,
					load_err: null,
				}));
			})
			.catch(err => {
				this.setState(prevState => ({
					retailitems: [],
					loading: false,
					load_err: err,
				}));
			});
	}

	handleOnItemSelect = item => event => {
		const { onItemSelect } = this.props;
		if (Function.isFunction(onItemSelect)) {
			onItemSelect(item, event);
		}
	};

	render() {
		return (
			<GridContainer className="p-0 m-0">
				{this.state.loading && (
					<GridContainer className="flex-10">
						<GridItem xs={12} md={6} lg={4}>
							<div className="bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
								<Skeleton
									variant="rect"
									width={"100%"}
									height={224}
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-2 mx-auto"
								/>
								<Skeleton
									variant="rect"
									width={"30%"}
									height={50}
									className="mt-2 ml-4"
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-2 mx-auto"
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-6 mx-auto"
								/>
								<Skeleton
									variant="rect"
									width={"80%"}
									height={34}
									className="mt-8 mb-6 mx-auto rounded"
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={6} lg={4}>
							<div className="bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
								<Skeleton
									variant="rect"
									width={"100%"}
									height={224}
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-2 mx-auto"
								/>
								<Skeleton
									variant="rect"
									width={"30%"}
									height={50}
									className="mt-2 ml-4"
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-2 mx-auto"
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-6 mx-auto"
								/>
								<Skeleton
									variant="rect"
									width={"80%"}
									height={34}
									className="mt-8 mb-6 mx-auto rounded"
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={6} lg={4}>
							<div className="bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
								<Skeleton
									variant="rect"
									width={"100%"}
									height={224}
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-2 mx-auto"
								/>
								<Skeleton
									variant="rect"
									width={"30%"}
									height={50}
									className="mt-2 ml-4"
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-2 mx-auto"
								/>
								<Skeleton
									variant="text"
									width={"95%"}
									className="mt-6 mx-auto"
								/>
								<Skeleton
									variant="rect"
									width={"80%"}
									height={34}
									className="mt-8 mb-6 mx-auto rounded"
								/>
							</div>
						</GridItem>
					</GridContainer>
				)}

				{!this.state.loading && Array.isArray(this.state.retailitems) && (
					<ScrollBars className="flex-10 overflow-x-hidden overflow-y-scroll">
						<GridContainer className="p-4 m-0">
							{this.state.retailitems.map(
								(retailitem, cursor) =>
									retailitem.available && (
										<GridItem
											xs={12}
											md={6}
											lg={4}
											className="flex flex-col"
											key={retailitem._id}
										>
											<div className="bg-white shadow-xl rounded-lg overflow-hidden">
												<div className="bg-cover bg-center h-56 p-0">
													<LazyImage
														className="w-full h-full"
														src={
															retailitem.featured_image
																? ApiService.getAttachmentFileUrl(
																		retailitem.featured_image
																  )
																: LogoChevron
														}
													/>
												</div>
												<div className="p-4">
													<p className="uppercase truncate tracking-wide text-sm  text-gray-900">
														{retailitem.name}
													</p>
													{retailitem.cost > 0 &&
														JSON.isJSON(
															retailitem.currency
														) && (
															<p className="text-3xl text-gray-900 my-4">
																{retailitem
																	.currency
																	.html_symbol +
																	" " +
																	retailitem.cost}
															</p>
														)}
													<p className="truncate tracking-wide text-sm  text-gray-500">
														{retailitem.description
															? retailitem.description
															: "No description available"}
													</p>
												</div>
												<div className="flex p-4 border-t border-gray-300 text-gray-700">
													<div className="flex-1 inline-flex items-center">
														<p className=" text-gray-900 font-bold">
															Type
														</p>
													</div>
													<div className="flex-1 inline-flex items-left">
														<p className="capitalize">
															{
																retailitem.item_type
															}
														</p>
													</div>
												</div>
												<div className="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
													<Button
														className="w-full"
														color="primary"
														onClick={this.handleOnItemSelect(
															retailitem
														)}
													>
														View
													</Button>
												</div>
											</div>
										</GridItem>
									)
							)}
						</GridContainer>
					</ScrollBars>
				)}
			</GridContainer>
		);
	}
}

export default withRoot(GridView);
