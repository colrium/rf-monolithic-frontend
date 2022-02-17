/** @format */
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Avatar from '@mui/material/Avatar';
import { Call as PhoneIcon, MailOutline as EmailIcon, Person as UserRoleIcon } from "@mui/icons-material";
import Card from "components/Card";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import LazyImage from "components/LazyImage";
import Status from "components/Status";
import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import Badge from '@mui/material/Badge';
import ApiService from "services/Api";
import { updateCurrentUser } from "state/actions/auth";
import { useLazyImage } from "hooks";


const icon_names = ["female", "female_1", "female_2", "female_3", "female_4", "female_5", "female_6", "male", "male_1", "male_2", "male_3", "male_4", "male_5", "male_6", "them_1", "them_2", "them_3"]

const Profile = (props) => {
	const { auth, updateCurrentUser } = props;
	const [avatarSrc, { ref: imageRef }] = useLazyImage(ApiService.getAttachmentFileUrl(auth.user?.avatar), ApiService.endpoint(`/public/img/avatars/${auth.user?.icon}.png`));



	return (
		<GridContainer>
			<GridItem xs={12}>
				<div className="max-w-4xl flex items-center h-auto flex-wrap mx-auto my-32 lg:my-0">
					<Card className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none  mx-6 lg:mx-0">
						<div className="p-4 md:p-12 text-center lg:text-left">
							<img
								src={avatarSrc}
								className="block lg:hidden rounded-full mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
							/>

							<h1 className="text-3xl pt-8 lg:pt-0">
								{auth.user?.first_name + " " + auth.user?.last_name}
							</h1>
							<p className="text-sm">
								<Status
									color={
										auth.user?.presence === "online"
											? "#00796b"
											: auth.user?.presence === "away"
												? "#b88d00"
												: "#5C5C5C"
									}
									text={auth.user?.presence}
								/>
							</p>
							<div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-grey-500 opacity-25"></div>
							<p className="flex items-center justify-center lg:justify-start">
								<UserRoleIcon className="mr-4" />{" "}
								{auth.user?.role}
							</p>

							<p className="flex items-center justify-center lg:justify-start">
								<EmailIcon className="mr-4" />{" "}
								{auth.user?.email_address}
							</p>

							<p className="flex items-center justify-center lg:justify-start">
								<PhoneIcon className="mr-4" />{" "}
								{auth.user?.phone_number}
							</p>
						</div>
					</Card>

					<img
						src={avatarSrc}
						ref={imageRef}
						className="rounded-none lg:rounded-lg shadow-xl hidden lg:w-2/5 lg:block"
						style={{ height: "50vh" }}
					/>
				</div>
			</GridItem>

			<GridItem xs={12} className={""}>

				<Card className="w-full rounded-lg lg:rounded-l-lg lg:rounded-r-none p-4  mx-6 lg:mx-0">
					<GridItem xs={12}>
						<h1 className="text-xl pt-8 lg:pt-0">Preffered Icon</h1>
					</GridItem>
					<GridItem xs={12} className={"inline-flex flex-wrap flex-row items-center"}>
						{icon_names.map((icon_name) => (
							auth.user?.icon === icon_name ? (
								<Avatar className={"m-2 h-20 w-20 border-2 border-green-600"} src={ApiService.endpoint(`/public/img/avatars/${icon_name}.png`)} key={icon_name} alt={icon_name} />
							) : (
								<Avatar
									className={"m-2 h-16 w-16 cursor-pointer"}
									src={ApiService.endpoint(`/public/img/avatars/${icon_name}.png`)}
									alt={icon_name}
									key={icon_name}
									onClick={() => {
										updateCurrentUser({ ...auth.user, icon: icon_name });
									}}
								/>
							)


						))}
					</GridItem>
				</Card>
			</GridItem>
		</GridContainer>
	);

}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(connect(mapStateToProps, { updateCurrentUser }))(Profile);
