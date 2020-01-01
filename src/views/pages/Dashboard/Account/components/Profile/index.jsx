import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { Avatar, LinearProgress } from "@material-ui/core";
import { PersonOutlined as UserIcon, MailOutline as EmailIcon, Call as PhoneIcon, Person as UserRoleIcon } from "@material-ui/icons";
import Typography from "components/Typography";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import LazyImage from "components/LazyImage";
import Status from "components/Status";
import { attachments as AttachmentsService } from "services";
import withRoot from "utils/withRoot";

class Profile extends Component {

	render() {
		const { auth } = this.props;

		return (
			<GridContainer>
				<GridItem xs={12}>
					<div className="max-w-4xl flex items-center h-auto flex-wrap mx-auto my-32 lg:my-0">
						<div className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none bg-white  mx-6 lg:mx-0">
							<div className="p-4 md:p-12 text-center lg:text-left">
								<LazyImage src={AttachmentsService.getAttachmentFileUrl(auth.user.avatar)} className="block lg:hidden rounded-full mx-auto -mt-16 h-48 w-48 bg-cover bg-center" />

								<h1 className="text-3xl pt-8 lg:pt-0">{auth.user.honorific + " " +auth.user.first_name + " " + auth.user.last_name}</h1>
								<p className="text-sm"><Status color={auth.user.presence === "online" ? "#00796b" : (auth.user.presence === "away" ? "#b88d00" : "#5C5C5C")} text={auth.user.presence} /></p>
								<div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-grey-500 opacity-25"></div>
								<p className="flex items-center justify-center lg:justify-start">
									<UserRoleIcon className="mr-4"/> {auth.user.role} 
								</p>

								<p className="flex items-center justify-center lg:justify-start">
									<EmailIcon className="mr-4"/> {auth.user.email_address} 
								</p>
								
								<p className="flex items-center justify-center lg:justify-start">
									<PhoneIcon className="mr-4"/> {auth.user.phone_number} 
								</p>

							</div>

						</div>

						<LazyImage src={AttachmentsService.getAttachmentFileUrl(auth.user.avatar)} className="rounded-none lg:rounded-lg shadow-xl hidden lg:w-2/5 lg:block" style={{height: "50vh"}}/>
					</div>
				</GridItem>
			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth
});

export default withRoot(compose( connect( mapStateToProps, {} ))(Profile));
