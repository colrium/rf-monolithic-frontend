import { app } from "assets/jss/app-theme";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "state/reducers";


function saveStateToLocalStorage(state) {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem( app.name.replace(/\s+/g, "").toLowerCase() + "-state", serializedState );
	} catch (e) {
		console.log("saveStateToLocalStorage error ", e);
	}
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
		console.log("loadStateFromLocalStorage error ", e);
		return undefined;
	}
}

let volatile_state = {};
function applyPermanence(state){
	let persistent_state = {};	
	for (const [name, value] of Object.entries(state)) {
		if (value.volatile) {
			//console.log("volatile_state[name]", state[name]);
			volatile_state[name] = state[name];
		}
		else{
			persistent_state[name] = state[name];
		}
	}
	saveStateToLocalStorage(persistent_state);
	return state;
}

//
const persistedState = loadStateFromLocalStorage();

let storeState = { ...persistedState, ...volatile_state};

//
//Create Store with persistested save
const store = createStore(
	reducers,
	storeState,
	compose( applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f )
);
//Subscribe store for peristent states
store.subscribe(() => applyPermanence(store.getState()));

export default store;
