/** @format */

import { app } from "assets/jss/app-theme";
import { compose, createStore } from "redux";
import middleware from "state/middleware";
import reducers from "state/reducers";
import {environment} from "config";

function saveStateToLocalStorage(state) {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(
			app.name.replace(/\s+/g, "").toLowerCase() + "-state",
			serializedState
		);
	} catch (e) {}
}
function loadStateFromLocalStorage() {
	try {
		const serializedState = localStorage.getItem(
			app.name.replace(/\s+/g, "").toLowerCase() + "-state"
		);
		//
		//redux expects undefined or object types so ensure check for null serializedState
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (e) {
        return undefined;
    }
}

let volatile_state = {};
export const applyPermanence = (state) => {
	let persistent_state = {};
	for (const [name, value] of Object.entries(state)) {
		if (value.volatile) {
			//console.log("volatile_state[name]", state[name]);
			volatile_state[name] = state[name];
		} else {
			persistent_state[name] = state[name];
		}
	}
	saveStateToLocalStorage(persistent_state);
	return state;
}

//
const persistedState = loadStateFromLocalStorage();

let storeState = { ...persistedState, ...volatile_state };





const StoreSingleton = (function () {
	var instance;
	function createInstance(state=false) {
        var newInstance =  createStore(reducers, (state? state : storeState), compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__ && environment === "development"? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f ));
        
        //Subscribe store for peristent states
		newInstance.subscribe(() => applyPermanence(newInstance.getState()));
        return newInstance;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
        destroyInstance: function() {	
			instance = undefined;
			return instance;
		},
		newInstance: function(state) {	
			instance = createInstance(state);
			return instance;
		},
    };

})();

export const store = StoreSingleton.getInstance();

export default store;
