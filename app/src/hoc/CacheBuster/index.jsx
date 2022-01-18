import React from 'react';
import { connect } from "react-redux";
import { setVersion, setInitialized } from "state/actions";
import { app as themeApp } from "assets/jss/app-theme";

// version from response - first param, local version second param
const semverGreaterThan = (versionA, versionB) => {
    const versionsA = versionA.replaceAll(".", "").split(/\./g);
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
		const { app, auth } = this.props;
		this.state = {
			loading: true,
			isLatestVersion: false,
			latestVersion: app.version,
			refreshCacheAndReload: () => {			
				
				try {
					if (Function.isFunction(localStorage?.clear)) {
						localStorage.clear();
					}
					if (Function.isFunction(caches?.keys)) {
						// Service worker cache should be cleared with caches.delete()
						caches.keys().then(function (names) {
							for (let name of names) caches.delete(name);
						});
					}

					if (Function.isFunction(window?.location?.reload)) {
						window.location.reload(true);
					}
				} catch (e) {
					console.error("Error clearing cached data: ", e);
				}
				
			}
		};
	}

	async getCacheVersion() {

	}

	componentDidMount() {
		const { app, auth, setVersion, setInitialized } = this.props;
		fetch('/meta.json', {cache: "reload"})
			.then(async (response) => {
				let responseJSON = await response.json().then(data => {
					return data;
				}).catch(err => {
					return {version: "0.0.0"};
				});			
				return responseJSON;
			})
			.then((meta) => {
				const currentVersion = app? (app.version? app.version : "0.0.0") : "0.0.0" ;
				const latestVersion = meta.version;

				if (currentVersion === "0.0.0") {
					setVersion(latestVersion);
                    this.setState({ loading: false, isLatestVersion: false, latestVersion: latestVersion });
                    
                    // setInitialized(true);
                }
				else {
					const shouldForceRefresh = currentVersion !== latestVersion;
					if (shouldForceRefresh) {
                        this.setState({ loading: false, isLatestVersion: false, latestVersion: latestVersion });
                        setVersion(latestVersion);
                        // setInitialized(true);
                    } else {
                        this.setState({ loading: false, isLatestVersion: true, latestVersion });
                        // setInitialized(true);
                    }
				}
					
			}).catch(e => {
            this.setState({ loading: false, isLatestVersion: true });
        });
	}
	render() {
		const { loading, isLatestVersion, refreshCacheAndReload, latestVersion } = this.state;
		return this.props.children({ loading, isLatestVersion, refreshCacheAndReload, latestVersion });
	}
}


const mapStateToProps = state => ({		
	app: state.app,
	auth: state.auth,
});

export default connect(mapStateToProps, { setVersion, setInitialized })(CacheBuster);
