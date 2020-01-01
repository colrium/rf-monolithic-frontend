import { CLOSE_DIALOG, OPEN_DIALOG } from "state/actions/types";

export function closeDialog() {
    return {
        type: CLOSE_DIALOG
    };
}

export function openDialog(options) {
    return {
        type: OPEN_DIALOG,
        options
    };
}