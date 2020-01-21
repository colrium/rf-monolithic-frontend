import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from 'components/Typography';
import Button from 'components/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import LoginForm from "views/forms/LoginForm";
import ScrollBars from "components/ScrollBars";
import withRoot from 'utils/withRoot';


function Widget(props) {
	const { auth, open, onLogin, onCancel, title, className } = props;
	const [isOpen, setIsOpen] = useState(open);
	const [error, setError] = useState(false);
	useEffect(() => {
		setIsOpen(props.open);
	}, [props.open]);

	function onLoginInternal(user){
		if (isOpen && Function.isFunction(onLogin)) {
			onLogin(user);
		}
		setIsOpen(false);
	}
	function onLoginCancel(event){
		if (Function.isFunction(onCancel)) {
			onCancel();
		}
		setIsOpen(false);
	}
	return (
			<Dialog onClose={e=>setIsOpen(false)} className={className} aria-labelledby="login-dialog-title" open={isOpen}>
				<DialogTitle id="login-dialog-title"><Typography variant="h5" >{title? title : "Login"} </Typography></DialogTitle>
				<ScrollBars>
					<DialogContent>					
						<GridContainer className="px-4">				
							<GridItem xs={12} className="p-0 m-0">
								<LoginForm onLogin={onLoginInternal}/>
							</GridItem>
						</GridContainer>
					</DialogContent>
				</ScrollBars>
				
				<DialogActions>
					<Button color="error" simple onClick={onLoginCancel}>Cancel</Button>
				</DialogActions>
			</Dialog>
			
	);		
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withRoot(connect(mapStateToProps, {})(Widget));