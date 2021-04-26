/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import { retailitems as service } from "services";
import { withErrorHandler } from "hoc/ErrorHandler";
import RequestError from "views/widgets/Catch/RequestError";
import CatalogItem from "views/widgets/Ecommerce/Item";

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
		service
			.getRecordById(this.state.item_id)
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
				<GridContainer
					style={{ minHeight: "90vh" }}
					className="relative"
				>
					<GridItem xs={12} sm={12} md={10} className="m-auto">
						<RequestError
							code={error.code ? error.code : 503}
							description={error.msg}
						/>
					</GridItem>
				</GridContainer>
			);
		} else {
			return (
				<GridContainer
					style={{ minHeight: "90vh" }}
					className="relative"
				>
					<GridItem xs={12} sm={12} md={10} className="m-auto">
						<CatalogItem
							item={this.state.item}
							loading={loading}
							className="w-full"
						/>
					</GridItem>
				</GridContainer>
			);
		}
	}
}

export default withErrorHandler(Page);
