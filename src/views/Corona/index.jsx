import React from "react";
import { connect } from "react-redux";
import { items as drawer_items } from "config/ui/drawer";
import DashboardRoutes from "routes/Dashboard";
import LandingPageRoutes from "routes/LandingPageRoutes";
import { Dashboard as DashboardLayout, Frontend as FrontendLayout } from "views/layouts";
import { setDashboardAppBarDisplayed, setDashboardDrawerDisplayed, setDashboardFooterDisplayed } from "state/actions";

class Corona extends React.Component {
	constructor(props) {
		super(props);
		const { nav, componentProps, match: { params } } = props;
		this.layout = componentProps.layout;
		this.layoutProps = componentProps.layoutProps;
		this.routing = componentProps.routing;

		this.state = { routes_key : props.location.key};
		
		this.contexts = ["events", "notifications", "surveys", "queries", "commissions", "responses", "teams", "tracks", "invoices", "payments", "orders", "orderitems", "retailitems", "coupons", "currencies", "fulfilments", "vacancies", "applications", "users", "forms", "attachments", "actionlogs", "responses", "posts", "demorequests", "quoterequests"];
		this.indexUri = Array.isArray(nav.entries) ? (nav.entries.length > 0 ? nav.entries[(nav.entries.length - 1)].uri : "/home".toUriWithDashboardPrefix()) : "/home".toUriWithDashboardPrefix();
	}

	
	componentWillReceiveProps(nextProps){
		if (nextProps.location.key !== this.props.location.key) {
			this.setState({ routes_key: nextProps.location.key });
		}		
	}

	render() {
		const { nav, layout, setDashboardAppBarDisplayed, setDashboardDrawerDisplayed, setDashboardFooterDisplayed } = this.props;
		
		if (this.layout == "dashboard") {

			setDashboardAppBarDisplayed(true);
			setDashboardDrawerDisplayed(true);
			//setDashboardFooterDisplayed(true);

			return (
				<DashboardLayout sidebar_items={drawer_items}>				
					<DashboardRoutes indexUri={this.indexUri} contexts={this.contexts} key={"routes"+this.state.routes_key}/>
				</DashboardLayout>
			);
		}
		else{
			return (
				<FrontendLayout {...this.layoutProps}>			
					<LandingPageRoutes />					
				</FrontendLayout>
			);
				
		}
		
	}
}
const mapStateToProps = state => ({
	nav: state.nav,
	sockets: state.sockets,
});

export default connect(mapStateToProps, { setDashboardAppBarDisplayed, setDashboardDrawerDisplayed, setDashboardFooterDisplayed })(Corona);
