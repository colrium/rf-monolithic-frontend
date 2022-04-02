/** @format */

import React, { Component } from "react";
import { Routes, Route } from "react-router-dom"
//
import Fairing from "views/Fairing"
import ProgressIndicator from "components/ProgressIndicator"


import LandingHomePage from "views/pages/LandingPage/Home"
import LandingRecruitmentPage from "views/pages/LandingPage/Recruitment"
import LandingApplyPage from "views/pages/LandingPage/Apply"
import LandingOrder  from "views/pages/LandingPage/Order"
import LandingCart from "views/pages/LandingPage/Cart"
import LandingCatalog from "views/pages/LandingPage/Catalog"
import LandingFAQs from "views/pages/LandingPage/FAQs"
import LandingAboutUs from "views/pages/LandingPage/AboutUs"
import LandingWhyUs from "views/pages/LandingPage/WhyUs"
import LandingCatalogItem from "views/pages/LandingPage/CatalogItem"
import LandingCheckout from "views/pages/LandingPage/Checkout"
import LandingThankyou from "views/pages/LandingPage/Thankyou"
import LandingPrivacyPolicy from "views/pages/LandingPage/PrivacyPolicy"
import LandingEthicalPrinciples from "views/pages/LandingPage/EthicalPrinciples"
import LandingDemoRequest from "views/pages/LandingPage/DemoRequest"
import LandingProjectComposer from "views/pages/LandingPage/ProjectComposer"





import AuthPage from "views/pages/System/Auth"
import NotFound from "views/pages/System/NotFound";


import LoginForm from "views/forms/Auth/Login"
import ForgotPasswordForm from "views/forms/Auth/ForgotPassword"
import ResetPasswordForm from "views/forms/Auth/ResetPassword"
import SignupForm from "views/forms/Auth/Signup"


import DashboardPreferences from "views/pages/Dashboard/Preferences"
import DashboardSettings from "views/pages/Dashboard/Settings"
import DashboardRecordForm from "views/pages/Dashboard/RecordForm"
import DashboardRecordsListing from "views/pages/Dashboard/RecordsListing"
import DashboardRecordView from "views/pages/Dashboard/RecordView"
import DashboardAccount from "views/pages/Dashboard/Account"
import DashboardMessaging from "views/pages/Dashboard/Messaging"

import DashboardHome from "views/pages/Dashboard/Home"
import ChatApp from "views/apps/Dashboard/Chat"
import ChatContacts from "views/apps/Dashboard/Chat/Contacts"
import ChatConversations from "views/apps/Dashboard/Chat/Conversations"
import ChatSidebar from "views/apps/Dashboard/Chat/Sidebar"

const RouteComponentPlaceHolder = () => <ProgressIndicator type="logo" size={200} />
const contexts = [
	"events",
	"notifications",
	"surveys",
	"queries",
	"commissions",
	"responses",
	"teams",
	"tracks",
	"invoices",
	"payments",
	"orders",
	"orderitems",
	"retailitems",
	"coupons",
	"currencies",
	"fulfilments",
	"vacancies",
	"applications",
	"users",
	"forms",
	"attachments",
	"actionlogs",
	"responses",
	"posts",
	"demorequests",
	"quoterequests",
	"courses",
	"quizes",
	"questions",
	"answers",
	"results",
]
const RoutesComponent = () => {
	return (
		<Routes>
			<Route
				path={"/".toUriWithLandingPagePrefix()}
				element={
					<Fairing
						routing="landingpage"
						layout="landingpage"
						layoutProps={{
							showHeader: true,
							showFooter: true,
						}}
					/>
				}
			>
				<Route path={"/*".toUriWithLandingPagePrefix()} element={<NotFound />} />
				<Route exact path={"/home".toUriWithLandingPagePrefix()} element={<LandingHomePage />} />

				<Route exact path={"/recruitment".toUriWithLandingPagePrefix()} element={<LandingRecruitmentPage />} />
				<Route exact path={"/jobs".toUriWithLandingPagePrefix()} element={<LandingRecruitmentPage />} />
				<Route exact path={"/apply".toUriWithLandingPagePrefix()} element={<LandingApplyPage />} />
				<Route exact path={"/order".toUriWithLandingPagePrefix()} element={<LandingOrder />} />
				<Route exact path={"/catalog".toUriWithLandingPagePrefix()} element={<LandingCatalog />} />
				<Route exact path={"/catalog/:id".toUriWithLandingPagePrefix()} element={<LandingCatalogItem />} />
				<Route exact path={"/request-quote".toUriWithLandingPagePrefix()} element={<LandingOrder />} />
				<Route exact path={"/faqs".toUriWithLandingPagePrefix()} element={<LandingFAQs />} />
				<Route exact path={"/about-us".toUriWithLandingPagePrefix()} element={<LandingAboutUs />} />

				<Route exact path={"/why-us".toUriWithLandingPagePrefix()} element={<LandingWhyUs />} />

				<Route exact path={"/cart".toUriWithLandingPagePrefix()} element={<LandingCart />} />
				<Route exact path={"/checkout".toUriWithLandingPagePrefix()} element={<LandingCheckout />} />
				<Route exact path={"/privacy-policy".toUriWithLandingPagePrefix()} element={<LandingPrivacyPolicy />} />
				<Route exact path={"/ethical-principles".toUriWithLandingPagePrefix()} element={<LandingEthicalPrinciples />} />
				<Route exact path={"/thankyou".toUriWithLandingPagePrefix()} element={<LandingThankyou />} />
				<Route exact path={"/request-demo".toUriWithLandingPagePrefix()} element={<LandingDemoRequest />} />
				<Route exact path={"/start-project".toUriWithLandingPagePrefix()} element={<LandingProjectComposer />} />
				<Route path={"*".toUriWithLandingPagePrefix()} element={<NotFound />} />
			</Route>

			<Route path="/auth" element={<AuthPage />}>
				<Route index path={"/auth/login"} element={<LoginForm />} />
				<Route path={"/auth/signin"} element={<LoginForm />} />
				<Route path={"/auth/forgot-password"} element={<ForgotPasswordForm />} />
				<Route path={"/auth/recover-account"} element={<ForgotPasswordForm />} />
				<Route path={"/auth/reset-password"} element={<ResetPasswordForm />} />
				<Route path={"/auth/signup/:role"} element={<SignupForm />} />
				<Route path={"/auth/register/:role"} element={<SignupForm />} />
			</Route>
			<Route
				path={"/".toUriWithDashboardPrefix()}
				element={
					<Fairing
						routing="dashboard"
						layout="dashboard"
						layoutProps={{
							showHeader: true,
							showFooter: true,
						}}
					/>
				}
			>
				<Route path={"/home".toUriWithDashboardPrefix()} element={<DashboardHome />} />
				<Route exact path={"/calendar".toUriWithDashboardPrefix()} element={<DashboardRecordsListing context="events" />} />

				<Route exact path={"/messaging".toUriWithDashboardPrefix()} element={<ChatApp />}>
					<Route index path={"/messaging/conversations".toUriWithDashboardPrefix()} element={<ChatConversations />} />
					<Route index path={"/messaging/contacts".toUriWithDashboardPrefix()} element={<ChatContacts />} />
					<Route index path={"/messaging/".toUriWithDashboardPrefix()} element={<ChatConversations />} />
					<Route index path={"/messaging/*".toUriWithDashboardPrefix()} element={<ChatConversations />} />
				</Route>

				<Route exact path={"/messages".toUriWithDashboardPrefix()} element={<DashboardMessaging />} />
				{contexts.map((context, cursor) => (
					<Route
						exact
						path={context.toUriWithDashboardPrefix()}
						element={<DashboardRecordsListing context={context} />}
						key={"context-route-" + context}
					/>
				))}

				{contexts.map((context, cursor) => (
					<Route
						path={`${context}/view/:id`.toUriWithDashboardPrefix()}
						element={<DashboardRecordView context={context} />}
						key={"context-view-route-" + context}
					/>
				))}

				{contexts.map((context, cursor) => (
					<Route
						path={`${context}/add`.toUriWithDashboardPrefix()}
						element={<DashboardRecordForm context={context} />}
						key={"context-add-route-" + context}
					/>
				))}

				{contexts.map((context, cursor) => (
					<Route
						path={`${context}/edit/:id`.toUriWithDashboardPrefix()}
						element={<DashboardRecordForm context={context} />}
						key={"context-edit-route-" + context}
					/>
				))}

				<Route path={"/account".toUriWithDashboardPrefix()} element={<DashboardAccount />} />
				<Route path={"/preferences".toUriWithDashboardPrefix()} element={<DashboardPreferences />} />
				<Route path={"/settings".toUriWithDashboardPrefix()} element={<DashboardSettings />} />

				<Route path={"/*".toUriWithDashboardPrefix()} element={<NotFound />} />
			</Route>
			<Route
				path={"*"}
				element={
					<Fairing
						routing="landingpage"
						layout="landingpage"
						layoutProps={{
							showHeader: true,
							showFooter: true,
						}}
					/>
				}
			>
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	)
}
export default RoutesComponent
