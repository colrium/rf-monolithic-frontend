import {
    FORMS_ADD,
    FORMS_REMOVE,
    FORMS_SET,
} from "state/actions/types";

export function addForm(name, payload) {
    return {
        type: FORMS_ADD,
		name,
        payload,
    };
}


export function setForm(name, payload) {
    return {
        type: FORMS_SET,
		name,
        payload,
    };
}

export function removeForm(name) {
    return {
		type: FORMS_REMOVE,
		name,
	}
}
