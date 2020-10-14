/** @format */

import React, {memo, useState, useEffect} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "@material-ui/core/Badge";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ForumIcon from '@material-ui/icons/Forum';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Skeleton from '@material-ui/lab/Skeleton';
import Fab from "@material-ui/core/Fab";
import Paper from '@material-ui/core/Paper';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from "@material-ui/core/IconButton";
import ScrollBars from "components/ScrollBars";

import { useGlobals } from "contexts/Globals";


import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import compose from "recompose/compose";
import { apiCallRequest } from "state/actions";

import { attachments as AttachmentsService } from "services";

import styles from "./styles";

function Chat(props) {
	const { classes, className, layout, cache:{ data: { conversations } }, activeConversation, auth:{user}, apiCallRequest, theme, ...rest } = props;

	const { definations } = useGlobals();

	const [chats, setChats] = useState(Array.isArray(conversations)? conversations : []);
	const [activeChat, setActiveChat] = useState(false);
	const [query, setQuery] = useState({desc: "created_on"});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);


	const loadConversations = () => {
		if (definations) {
			setLoading(true);
			apiCallRequest( definations.conversations.name,
					{
						uri: definations.conversations.endpoint,
						type: "records",
						params: {...query, p: "1"},
						data: {},
						cache: true,
					}
			).then(data => {
				console.log("conversations data", data);
				setError(false);
				setLoading(false);					
			}).catch(e => {
				console.log("conversations e", e);
				setError(e);
				setLoading(false);
			});
		}
	}

	useEffect(() => {

	}, []);

	useEffect(() => {
		console.log("conversations", conversations);
		setChats(conversations);
	}, [conversations]);

	useEffect(() => {
		console.log("chats", chats);
	}, [chats]);

	useEffect(() => {
		loadConversations();
	}, [definations, query]);


	
	return (
		<Paper className={classNames({"p-0 m-0 relative": true, [classes.root] : true, [className]: true})} >
			<AppBar position="absolute" color="transparent" className={classes.mainAppBar}>
				<Toolbar>
					{activeChat && <IconButton 
						onClick={()=>setActiveChat(false)}
						edge="start" 
						color="inherit" 
						aria-label="back-to-chats"
					>
						<ArrowBackIcon />
					</IconButton>}
					{activeChat && <Typography variant="h6" className={classes.title}>
						{activeChat.type == "individual"? (user._id === activeChat.owner._id? (activeChat.recipients[0].first_name +" "+activeChat.recipients[0].last_name) : (activeChat.owner.first_name +" "+activeChat.owner.last_name)) : (activeChat.type == "group"? activeChat.group_name : "Realfield Assistant")}
					</Typography>}

					{!activeChat && <Typography variant="h6" className={classes.title}>
						Chats
					</Typography>}
				</Toolbar>
			</AppBar>
			{!activeChat && <GridItem md={12} className={"flex flex-col relative min-h-full p-0"}>					
						<Paper square className={classes.paper}>
							<ScrollBars className={classes.bodyWrapper}>
							{loading && <GridContainer>
								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-3/6"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={110} className="mb-1"/>
										<Skeleton variant="text" className="w-8/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-4/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={90} className="mb-1"/>
										<Skeleton variant="text" className="w-3/6"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={70} className="mb-1"/>
										<Skeleton variant="text" className="w-10/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-9/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={120} className="mb-1"/>
										<Skeleton variant="text" className="w-4/5"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={100} className="mb-1"/>
										<Skeleton variant="text" className="w-3/6"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-2 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-11/12"/>
									</div>
								</GridItem>
							</GridContainer>}
							{(Array.isArray(chats) && !loading) && <List className={classes.list}>
							{chats.map((chat, index)=> {
								let primaryText = "";
								let avatar = false;
								if (chat.type == "individual") {
									if (user._id === chat.owner._id) {
										primaryText = chat.recipients[0].first_name +" "+chat.recipients[0].last_name
										avatar = chat.recipients[0].avatar;
									}
									else{
										primaryText = chat.owner.first_name +" "+chat.owner.last_name;
										avatar = chat.owner.avatar;
									}
								} 
								else if (chat.type == "group") {
									primaryText = chat.group_name;
									avatar = chat.group_avatar;
								}

								return (
									<ListItem 
										className="px-2" 
										onClick={(event)=> setActiveChat(chat)}
										key={"chat-"+index}
										button
									>
										<ListItemAvatar>
											{ avatar && <Avatar src={AttachmentsService.getAttachmentFileUrl(avatar)} />}
											{!avatar && <Avatar>
												{chat.type === "group"? <PeopleIcon /> : <PersonIcon />}
											</Avatar>}
										</ListItemAvatar>
										<ListItemText primary={primaryText} secondary="Jan 9, 2014" />
									</ListItem>
								);
							})}
								
							</List>}
							</ScrollBars>
						</Paper>
						<AppBar position="absolute" color="secondary" className={classes.chatsAppBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" aria-label="open drawer">
									<MenuIcon />
								</IconButton>
								<Fab color="secondary" aria-label="add" className={classes.fabButton}>
									<AddIcon />
								</Fab>
								<div className={classes.grow} />
								<IconButton color="inherit">
									<SearchIcon />
								</IconButton>
								<IconButton edge="end" color="inherit">
									<MoreIcon />
								</IconButton>
							</Toolbar>
						</AppBar>
			</GridItem>}

			{activeChat && <GridItem md={12} >


			</GridItem>}

		</Paper>
	);
}



const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
});

Chat.defaultProps = {
	layout: "full",
	firstView: "conversations",
	activeConversation: undefined,
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, {apiCallRequest}),
	withTheme,
)((Chat));
