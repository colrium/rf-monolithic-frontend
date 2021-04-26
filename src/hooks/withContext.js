/** @format */

import React, { useState, useEffect } from "react";
import * as models from "definations";
import { settings as SettingsService } from "services";

let defaultContext = {
	models: models,
	settings: {
		"site-title": "Realfield",
		"site-tagline": "Real data",
		social: {
			twitter: "https://twitter.com/realfieldwork",
			facebook: "https://facebook.com/realfieldwork",
			instagram: "https://instagram.com/realfieldwork",
		},
		"privacy-policy":
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra. At consectetur lorem donec massa sapien. Et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Tellus in hac habitasse platea. Amet volutpat consequat mauris nunc. Non tellus orci ac auctor augue. Nulla aliquet enim tortor at auctor urna. Non curabitur gravida arcu ac. Etiam tempor orci eu lobortis elementum nibh tellus.Mauris vitae ultricies leo integer. Diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet. Justo laoreet sit amet cursus sit amet dictum sit. Sit amet purus gravida quis blandit turpis cursus in hac. In ante metus dictum at. Fames ac turpis egestas maecenas. Vivamus at augue eget arcu dictum varius duis. Vestibulum rhoncus est pellentesque elit. Ante in nibh mauris cursus. Quam nulla porttitor massa id neque aliquam. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Consectetur adipiscing elit ut aliquam purus sit. Est ultricies integer quis auctor elit sed vulputate mi sit. Enim ut tellus elementum sagittis vitae. Ultrices mi tempus imperdiet nulla. Habitant morbi tristique senectus et netus et malesuada fames. Velit euismod in pellentesque massa placerat duis ultricies lacus sed. Hac habitasse platea dictumst quisque sagittis purus sit amet. Cursus turpis massa tincidunt dui ut ornare. Rhoncus urna neque viverra justo nec ultrices dui sapien. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Sit amet mattis vulputate enim.Nec feugiat nisl pretium fusce id velit ut. Morbi quis commodo odio aenean sed adipiscing diam donec adipiscing. Pretium viverra suspendisse potenti nullam ac. Porta lorem mollis aliquam ut porttitor. Iaculis at erat pellentesque adipiscing. Facilisis volutpat est velit egestas dui id ornare. Congue eu consequat ac felis donec et. Augue lacus viverra vitae congue eu consequat ac felis. Aliquet enim tortor at auctor urna. Amet consectetur adipiscing elit pellentesque habitant morbi tristique. Sit amet nisl purus in mollis nunc. Enim diam vulputate ut pharetra sit amet aliquam id. Dictum varius duis at consectetur lorem donec. Dignissim sodales ut eu sem integer vitae justo eget. Nibh sit amet commodo nulla facilisi. Molestie a iaculis at erat pellentesque adipiscing commodo elit. In nulla posuere sollicitudin aliquam ultrices sagittis.Commodo odio aenean sed adipiscing. Libero id faucibus nisl tincidunt eget nullam non nisi est. Malesuada fames ac turpis egestas. Tortor vitae purus faucibus ornare suspendisse sed nisi. Etiam erat velit scelerisque in dictum non consectetur a. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Non tellus orci ac auctor augue. Bibendum est ultricies integer quis auctor elit sed vulputate. Sed velit dignissim sodales ut eu sem. Donec massa sapien faucibus et molestie ac feugiat. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Eu ultrices vitae auctor eu augue ut. Nulla facilisi nullam vehicula ipsum. Ultricies mi eget mauris pharetra.",
	},
	context_test: "context_testcontext_testcontext_test jidhihd ",
};

const AppContext = React.createContext(defaultContext);

const isFunctionalComponent = Component => {
	return (
		typeof Component === "function" &&
		!(Component.prototype && Component.prototype.render)
	);
};

const isReactComponent = Component => {
	return Component.prototype && Component.prototype.render;
};

let fetched = false;
let fetching = false;

function withContext(Component) {
	function WithContext(props) {
		let [state, setState] = useState(props);
		let [context, setContext] = useState(defaultContext);
		useEffect(() => {
			setContext(defaultContext);
		}, [defaultContext]);
		useEffect(() => {
			setState(props);
		}, [props]);
		const fetchSettings = () => {
			fetching = true;
			SettingsService.getRecords({})
				.then(res => {
					fetched = true;
					fetching = false;
					let fetchedSettings = JSON.fromJSON(context.settings);
					res.body.data.map((setting, index) => {
						fetchedSettings[setting.slug] = setting.value;
					});
					defaultContext = {
						...context,
						settings: fetchedSettings,
						settingsFetched: true,
					};
				})
				.catch(e => {
					fetched = false;
					fetching = false;
				});
		};

		const updateContextSettings = async (name, value) => {
			if (String.isString(name)) {
                let slug = name.toLowerCase().variablelize("-");
                let postData = {
					name: name,
					slug: slug,
					value: value,
				};
                let updatedContext = await SettingsService.update(
					slug,
					postData,
					{ create: 1 }
				)
					.then(res => {
						return {
							...context,
							settings: { ...context.settings, [slug]: value },
						};
					})
					.catch(e => {
						return false;
					});
                if (updatedContext) {
					setContext(updatedContext);
				}
                return updatedContext;
            }
		};

		if (!fetched && !fetching) {
			fetchSettings();
		}

		if (isFunctionalComponent(Component)) {
			return (
				<AppContext.Provider value={context}>
					<Component
						{...state}
						context={context}
						updateContextSettings={updateContextSettings}
					/>
				</AppContext.Provider>
			);
		} else {
			return (
				<AppContext.Provider value={context}>
					<Component
						{...state}
						context={context}
						updateContextSettings={updateContextSettings}
					/>
				</AppContext.Provider>
			);
		}
	}

	return WithContext;
}

export default withContext;
