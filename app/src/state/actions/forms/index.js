import {
    FORMS_ADD,
    FORMS_REMOVE,
    FORMS_SET,
} from "state/actions/types";

export function addForm(payload) {
    return {
        type: FORMS_ADD,
        payload,
    };
}


export function setForm(payload) {
    return {
        type: FORMS_SET,
        payload,
    };
}

export function removeForm(payload) {
    return {
        type: FORMS_REMOVE,
        payload,
    };
}