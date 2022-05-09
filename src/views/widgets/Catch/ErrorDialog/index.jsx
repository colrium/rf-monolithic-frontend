import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const ErrorDialog = (props) => {
    const { open, title, message, persist } = props
    const [isOpen, setIsOpen] = React.useState(Boolean(open));
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (

        <Dialog
            fullScreen={fullScreen}
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="error-dialog-title"
            disableEscapeKeyDown={Boolean(persist)}
        >
            <DialogTitle id="error-dialog-title">
                {title || "Something went wrong!"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message || "An error occured. Error Code: 000FFF. Please contact your system admin for more details."}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={!persist} autoFocus>
                    Dismiss
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ErrorDialog;