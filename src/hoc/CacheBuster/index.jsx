import React from 'react';
import { app } from "assets/jss/app-theme";
import packageJson from '../../../package.json';
global.appVersion = packageJson.version;

// version from response - first param, local version second param
const semverGreaterThan = (versionA, versionB) => {
	const versionsA = versionA.replaceAll(".", "").split(/\./g);
	console.log("versionA", versionA, "versionB", versionB);
	const versionsB = versionB.replaceAll(".", "").split(/\./g);
	while (versionsA.length || versionsB.length) {
		const a = Number(versionsA.shift());

		const b = Number(versionsB.shift());
		// eslint-disable-next-line no-continue
		if (a === b) continue;
		// eslint-disable-next-line no-restricted-globals
		return a > b || isNaN(b);
	}
	return false;
};

class CacheBuster extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			isLatestVersion: false,
			refreshCacheAndReload: () => {
				console.log('Clearing cache and hard reloading...')
				if (caches) {
					// Service worker cache should be cleared with caches.delete()
					caches.keys().then(function(names) {
						for (let name of names) caches.delete(name);
					});
				}

				// delete browser cache and hard reload
				window.location.reload(true);
			}
		};
	}

	componentDidMount() {
		fetch('/meta.json', {cache: "force-cache"})
			.then(async (response) => {
				let responseJSON = await response.json().then(data => {
					return data;
				}).catch(err => {
					return {version: "0.0.0"};
				});			
				return responseJSON;
			})
			.then((meta) => {
				const latestVersion = global.appVersion;
				const currentVersion = meta.version;
				if (currentVersion === "0.0.0") {
					const serializedState = localStorage.getItem( app.name.replace(/\s+/g, "").toLowerCase() + "-state" );
					if (serializedState === null) {
						this.setState({ loading: false, isLatestVersion: true });
					}
					else{
						if (serializedState.auth) {
							if (serializedState.auth.isAuthenticated) {
								localStorage.clear();
								this.setState({ loading: false, isLatestVersion: true });
							}
							else{
								this.setState({ loading: false, isLatestVersion: true });
							}
						}
						else{
							this.setState({ loading: false, isLatestVersion: true });
						}
					}
				}
				else {
					const shouldForceRefresh = currentVersion !== latestVersion;
					if (shouldForceRefresh) {
						console.log(`We have a new version - ${latestVersion}. Should force refresh`);
						this.setState({ loading: false, isLatestVersion: false });
					} else {
						console.log(`${app.name} version - ${latestVersion}.`);
						this.setState({ loading: false, isLatestVersion: true });
					}
				}

					
			}).catch(e => {
				console.log("meta.json error", e);
				this.setState({ loading: false, isLatestVersion: true });
			});
	}
	render() {
		const { loading, isLatestVersion, refreshCacheAndReload } = this.state;
		return this.props.children({ loading, isLatestVersion, refreshCacheAndReload });
	}
}

export default CacheBuster;