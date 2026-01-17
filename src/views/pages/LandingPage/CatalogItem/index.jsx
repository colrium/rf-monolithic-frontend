/** @format */

import { app } from "assets/jss/app-theme";
import Grid from '@mui/material/Grid';
;
import React from "react";

import RequestError from "views/widgets/Catch/RequestError";
import CatalogItem from "views/widgets/Ecommerce/Item";
import ApiService from "services/Api";

class Page extends React.Component {
	state = {
		item: null,
		item_id: null,
		loading: true,
		error: false,
	};
	constructor(props) {
		super(props);
		const {
			match: { params },
			history,
		} = props;
		if ("id" in params) {
			this.state.item_id = params.id;
		} else {
			if (history) {
				history.push("/catalog".toUriWithLandingPagePrefix());
			}
		}
	}

	componentDidMount() {
		document.title = app.title("Catalog");
		this.getRecord();
	}

	async getRecord() {
		const { history } = this.props;
		ApiService.get(("retail/items/" + this.state.item_id))
			.then(response => {
				let item = response.body.data;
				this.setState(state => ({ item: item, loading: false }));
			})
			.catch(err => {
				if (err.code === 404) {
					history.push("/not-found");
				} else {
					this.setState(state => ({ error: err, loading: false }));
				}
			});
	}

	render() {
		const { item, loading, error } = this.state;
		if (error) {
			return (
				<Grid container
					style={{ minHeight: "90vh" }}
					className="relative"
				>
					<Grid item  xs={12} sm={12} md={10} className="m-auto">
						<RequestError
							code={error.code ? error.code : 503}
							description={error.msg}
						/>
					</Grid>
				</Grid>
			);
		} else {
			return (
				<Grid container
					style={{ minHeight: "90vh" }}
					className="relative"
				>
					<Grid item  xs={12} sm={12} md={10} className="m-auto">
						<CatalogItem
							item={this.state.item}
							loading={loading}
							className="w-full"
						/>
					</Grid>
				</Grid>
			);
		}
	}
}

export default (Page);
