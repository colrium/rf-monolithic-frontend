import { AccountCircleOutlined as ProfileIcon, DashboardOutlined as DashboardIcon, HelpOutlined as HelpSupportIcon, HistoryOutlined as ActionsLogIcon, SettingsOutlined as SettingsIcon } from "@material-ui/icons";
import * as definations from "definations";
import React from "react";

export const items = [
	{
		icon: <DashboardIcon />,
		text: "Dashboard",
		route: "/home".toUriWithDashboardPrefix()
	},
	{
		icon: definations.events.icon,
		text: "Calendar",
		section: true,
		links: [
			{
				icon: definations.events.icon,
				text: "Calendar",
				route: "/calendar".toUriWithDashboardPrefix(),
				restricted: false
			}
		]
	},
	{
		icon: definations.surveys.icon,
		text: definations.surveys.label,
		section: true,
		links: [
			{
				icon: definations.surveys.icon,
				text: definations.surveys.label,
				route: "/surveys".toUriWithDashboardPrefix(),
				restricted: user => {
					return !(user.isAdmin || user.isCustomer);
				}
			},
			{
				icon: definations.queries.icon,
				text: definations.queries.label,
				route: "/queries".toUriWithDashboardPrefix(),
				restricted: user => {
					return !(user.isAdmin || user.isCustomer);
				}
			},
			{
				icon: definations.responses.icon,
				text: definations.responses.label,
				route: "/responses".toUriWithDashboardPrefix()
			}
		]
	},
	{
		text: definations.commissions.label,
		section: true,
		restricted: user => {
			return !(user.isAdmin || user.isCollector);
		},
		links: [
			{
				icon: definations.commissions.icon,
				text: definations.commissions.label,
				route: "/commissions".toUriWithDashboardPrefix()
			},
			{
				icon: definations.teams.icon,
				text: definations.teams.label,
				route: "/teams".toUriWithDashboardPrefix(),
				restricted: user => {
					return !(user.isAdmin || user.isCollector);
				}
			},
			{
				icon: definations.tracks.icon,
				text: definations.tracks.label,
				route: "/tracks".toUriWithDashboardPrefix(),
				restricted: ["collector", "admin"]
			}
		]
	},
	{
		text: "Financial",
		section: true,
		restricted: user => {
			return !(user.isAdmin || user.isCustomer);
		},
		links: [
			{
				icon: definations.invoices.icon,
				text: definations.invoices.label,
				route: "/invoices".toUriWithDashboardPrefix(),
				restricted: user => {
					return !(user.isAdmin || user.isCustomer);
				}
			},
			{
				icon: definations.payments.icon,
				text: definations.payments.label,
				route: "/payments".toUriWithDashboardPrefix(),
				restricted: user => {
					return !(user.isAdmin || user.isCustomer);
				}
			}
		]
	},

	{
		text: "Orders",
		section: true,
		restricted: user => {
			return !user.isCustomer;
		},
		links: [
			{
				icon: definations.orders.icon,
				text: "My " + definations.orders.label,
				route: "/orders".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isCustomer;
				}
			},

			{
				icon: definations.fulfilments.icon,
				text: "Order " + definations.fulfilments.label,
				route: "/fulfilments".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isCustomer;
				}
			},



			{
				icon: definations.coupons.icon,
				text: "My " + definations.coupons.label,
				route: "/coupons".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isCustomer;
				}
			}
		]
	},
	{
		text: "Retail",
		section: true,
		restricted: user => {
			return !user.isAdmin;
		},
		links: [
			{
				icon: definations.retailitems.icon,
				text: definations.retailitems.label,
				route: "/retailitems".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				}
			},

			

			{
				icon: definations.orders.icon,
				text: definations.orders.label,
				route: "/orders".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				}
			},



			{
				icon: definations.fulfilments.icon,
				text: "Order " + definations.fulfilments.label,
				route: "/fulfilments".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				}
			},

			{
				icon: definations.demorequests.icon,
				text: definations.demorequests.label,
				route: "/demorequests".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				}
			},

			{
				icon: definations.proposalrequests.icon,
				text: definations.proposalrequests.label,
				route: "/proposalrequests".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				}
			},

			{
				icon: definations.coupons.icon,
				text: definations.coupons.label,
				route: "/coupons".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				}
			},

			{
				icon: definations.currencies.icon,
				text: definations.currencies.label,
				route: "/currencies".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				}
			},
		]
	},

	{
		text: "Recruitment",
		section: true,
		restricted: user => {
			return !user.isAdmin;
		},
		links: [
			{
				icon: definations.vacancies.icon,
				text: definations.vacancies.label,
				route: "/vacancies".toUriWithDashboardPrefix()
			},
			{
				icon: definations.applications.icon,
				text: definations.applications.label,
				route: "/applications".toUriWithDashboardPrefix()
			}
		]
	},

	{
		text: "Administration",
		section: true,
		restricted: user => {
			return !user.isAdmin;
		},
		links: [
			{
				icon: definations.users.icon,
				text: definations.users.label,
				route: "/users".toUriWithDashboardPrefix()
			},
			{
				icon: definations.forms.icon,
				text: definations.forms.label,
				route: "/forms".toUriWithDashboardPrefix()
			}
			/* {
				icon: <SettingsIcon />,
				text: "System Settings",
				route: "/settings".toUriWithDashboardPrefix()
			} */
		]
	},

	
	{
		text: "Other",
		section: true,
		restricted: false,
		links: [
			{
				icon: definations.attachments.icon,
				text: definations.attachments.label,
				route: "/attachments".toUriWithDashboardPrefix()
			},
			{
				icon: definations.posts.icon,
				text: definations.posts.label,
				route: "/posts".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				},
			},
			{
				icon: definations.actionlogs.icon,
				text: definations.actionlogs.label,
				route: "/actionlogs".toUriWithDashboardPrefix(),
				restricted: user => {
					return !user.isAdmin;
				},
			}
		]
	},

	{
		text: "Account",
		section: true,
		restricted: false,
		links: [
			{
				icon: <ProfileIcon />,
				text: "Profile",
				route: "/account".toUriWithDashboardPrefix()
			},
			{
				icon: <SettingsIcon />,
				text: "Preferences",
				route: "/preferences".toUriWithDashboardPrefix()
			}
		]
	},
	{
		text: "Help & Support",
		section: true,
		links: [
			{
				icon: <HelpSupportIcon />,
				text: "Help & Support",
				color: "grey",
				route: "/support".toUriWithDashboardPrefix()
			}
		]
	}
];

export const width = 320;
