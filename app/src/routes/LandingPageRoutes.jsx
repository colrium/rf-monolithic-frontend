/** @format */

import React, { Component } from "react";
import { Switch } from "react-router-dom";
//

import Route from "routes/Route";
import asyncComponent from "views/widgets/asyncComponent";

const HomePage = asyncComponent(() => import("views/pages/LandingPage/Home"));
const RecruitmentPage = asyncComponent(() => import("views/pages/LandingPage/Recruitment"));
const ApplyPage = asyncComponent(() => import("views/pages/LandingPage/Apply"));
const Order = asyncComponent(() => import("views/pages/LandingPage/Order"));
const Cart = asyncComponent(() => import("views/pages/LandingPage/Cart"));
const Catalog = asyncComponent(() => import("views/pages/LandingPage/Catalog"));
const FAQs = asyncComponent(() => import("views/pages/LandingPage/FAQs"));
const AboutUs = asyncComponent(() => import("views/pages/LandingPage/AboutUs"));
const WhyUs = asyncComponent(() => import("views/pages/LandingPage/WhyUs"));
const CatalogItem = asyncComponent(() => import("views/pages/LandingPage/CatalogItem"));
const Checkout = asyncComponent(() => import("views/pages/LandingPage/Checkout"));
const Thankyou = asyncComponent(() => import("views/pages/LandingPage/Thankyou"));
const PrivacyPolicy = asyncComponent(() => import("views/pages/LandingPage/PrivacyPolicy"));
const EthicalPrinciples = asyncComponent(() => import("views/pages/LandingPage/EthicalPrinciples"));
const DemoRequest = asyncComponent(() => import("views/pages/LandingPage/DemoRequest"));
const ProjectComposer = asyncComponent(() => import("views/pages/LandingPage/ProjectComposer"));
const NotFound = asyncComponent(() => import("views/pages/System/NotFound"));



export default class LandingPageRoutes extends Component {
	render() {
		return (
			<Switch>
				{/*<Redirect
						exact
						from={"/".toUriWithLandingPagePrefix()}
						to={"/home".toUriWithLandingPagePrefix()}
					/>*/}

				<Route
					exact
					path={"/home".toUriWithLandingPagePrefix()}
					component={HomePage}
				/>


				<Route
					exact
					path={"/recruitment".toUriWithLandingPagePrefix()}
					component={RecruitmentPage}
				/>
				<Route
					exact
					path={"/jobs".toUriWithLandingPagePrefix()}
					component={RecruitmentPage}
				/>
				<Route
					exact
					path={"/apply".toUriWithLandingPagePrefix()}
					component={ApplyPage}
				/>
				<Route
					exact
					path={"/order".toUriWithLandingPagePrefix()}
					component={Order}
				/>
				<Route
					exact
					path={"/catalog".toUriWithLandingPagePrefix()}
					component={Catalog}
				/>
				<Route
					exact
					path={"/catalog/:id".toUriWithLandingPagePrefix()}
					component={CatalogItem}
				/>
				<Route
					exact
					path={"/request-quote".toUriWithLandingPagePrefix()}
					component={Order}
				/>
				<Route
					exact
					path={"/faqs".toUriWithLandingPagePrefix()}
					component={FAQs}
				/>
				<Route
					exact
					path={"/about-us".toUriWithLandingPagePrefix()}
					component={AboutUs}
				/>

				<Route
					exact
					path={"/why-us".toUriWithLandingPagePrefix()}
					component={WhyUs}
				/>

				<Route
					exact
					path={"/cart".toUriWithLandingPagePrefix()}
					component={Cart}
				/>
				<Route
					exact
					path={"/checkout".toUriWithLandingPagePrefix()}
					component={Checkout}
				/>
				<Route
					exact
					path={"/privacy-policy".toUriWithLandingPagePrefix()}
					component={PrivacyPolicy}
				/>
				<Route
					exact
					path={"/ethical-principles".toUriWithLandingPagePrefix()}
					component={EthicalPrinciples}
				/>
				<Route
					exact
					path={"/thankyou".toUriWithLandingPagePrefix()}
					component={Thankyou}
				/>
				<Route
					exact
					path={"/request-demo".toUriWithLandingPagePrefix()}
					component={DemoRequest}
				/>
				<Route
					exact
					path={"/start-project".toUriWithLandingPagePrefix()}
					component={ProjectComposer}
				/>
				<Route
					path={"*".toUriWithLandingPagePrefix()}
					component={NotFound}
				/>
			</Switch>
		);
	}
}
