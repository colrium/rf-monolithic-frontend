import React from "react";

import { Dialog } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "components/Typography";
import Button from "components/Button";

import { useDispatch, useSelector } from "react-redux";
import * as Actions from "state/actions";

function ActionDialog(props) {
  const dispatch = useDispatch();
  const state = useSelector(state => state.dialog.state);
  const options = useSelector(state => state.dialog.options);

  return (
    <Dialog
      open={state}
      onClose={ev => dispatch(Actions.closeDialog())}
      aria-labelledby="action-dialog-title"
    >
      {options.title ? (
        <DialogTitle id="action-dialog-title" variant="h4">{options.title}</DialogTitle>
      ) : (
        <DialogTitle id="action-dialog-title" variant="h4">Heads up!</DialogTitle>
      )}
      {options.body ? (
        <DialogContent>
          <DialogContentText id="action-dialog-content">
            {options.body}
          </DialogContentText>
        </DialogContent>
      ) : (
        ""
      )}

      {options.actions ? (
        <DialogActions>
          {Object.keys(options.actions).map(action => (
            <Button
              onClick={
                options.actions[action].onClick
                  ? options.actions[action].onClick
                  : () => dispatch(Actions.closeDialog())
              }
              color={
                options.actions[action].color
                  ? options.actions[action].color
                  : "default"
              }
              simple
              key={"action-dialog-action-" + action}
            >
              {options.actions[action].text
                ? options.actions[action].text
                : action}
            </Button>
          ))}
        </DialogActions>
      ) : (
        ""
      )}
    </Dialog>
  );
}

export default ActionDialog;
