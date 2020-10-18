/** @format */

import React, {memo, useState, useEffect, useCallback} from "react";
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
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ContactsIcon from '@material-ui/icons/Contacts';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ForumIcon from '@material-ui/icons/Forum';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

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

import {
	TextInput,
} from "components/FormInputs";

import { useGlobals } from "contexts/Globals";


import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import compose from "recompose/compose";
import { apiCallRequest } from "state/actions";

import { attachments as AttachmentsService } from "services";

import styles from "./styles";

const contactsDrawerWidth = 240;

function Chat(props) {
	const { classes, className, layout, cache:{ data: { conversations } }, activeConversation, auth, device, apiCallRequest, theme, ...rest } = props;

	const { definations, sockets } = useGlobals();

	const [chats, setChats] = useState(Array.isArray(conversations)? conversations : []);
	const [activeChat, setActiveChat] = useState(false);
	const [query, setQuery] = useState({desc: "created_on"});
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [loadingContacts, setLoadingContacts] = useState(true);
	const [draft, setDraft] = useState({});
	const [individualConversationsRecipients, setIndividualConversationsRecipients] = useState([]);
	const [error, setError] = useState(false);
	const [contacts, setContacts] = useState([]);
	const [contactsDrawerOpen, setContactsDrawerOpen] = React.useState(false);

	


	const loadConversations = () => {
		if (definations) {
			setLoadingConversations(true);
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
				setLoadingConversations(false);					
			}).catch(e => {
				console.log("conversations e", e);
				setError(e);
				setLoadingConversations(false);
			});
		}
	}

	const loadContacts = () => {
		if (definations) {
			setLoadingContacts(true);
			apiCallRequest( "contacts",
					{
						uri: "/contacts",
						type: "records",
						params: {p: "1"},
						data: {},
						cache: true,
					}
			).then(data => {
				console.log("contacts data", data);
				if (Array.isArray(data)) {
					setContacts(data);
				}
				setError(false);
				setLoadingContacts(false);					
			}).catch(e => {
				console.log("contacts e", e);
				setError(e);
				setLoadingContacts(false);
			});
		}
	}

	const handleNewChat = (recipients) => {
		if (recipients) {
			setContactsDrawerOpen(false);
			let newChat = {
				recipients: Array.isArray(recipients)? recipients : [recipients],
				owner: auth.user._id,
				type: Array.isArray(recipients)? (recipients.length > 1? "group" : "individual") : "individual",
			};
			let updatedChats = chats;
			updatedChats.unshift(newChat);
			setActiveChat(newChat);
			setChats(updatedChats);

			console.log("updatedChats", updatedChats);

			if (sockets.default) {
				sockets.default.emit("create-conversation", newChat);
			}
		}
			
	}

	const handleRefresh = () => {
		loadConversations();
		loadContacts();	
	}

	const handlePresenceChanged = ({user, presence}) => {		
		setContacts(currentContacts => {
			try {
				let newContacts = JSON.parse(JSON.stringify(currentContacts));
				let user_id = user;
				if (JSON.isJSON(user)) {
					user_id = user._id;
				}
				newContacts.forEach(function(contact) {
					if (user_id === contact._id) {
						contact.presence = presence;
					}
				});
				return newContacts;
			} catch(err) {
				console.error(err);
				return currentContacts;
			}
				
		});
		setChats(currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));
				let user_id = user;
				if (JSON.isJSON(user)) {
					user_id = user._id;
				}
				newChats.forEach(function(chat) {
					if (chat.type === "individual") {
						let chat_owner_id = chat.owner;
						if (JSON.isJSON(chat.owner)) {
							chat_owner_id = chat.owner._id;
						}
						if (chat_owner_id === user_id) {
							if (JSON.isJSON(chat.owner)) {
								chat.owner.presence = presence;
							}
						}
						else {
							if (Array.isArray(chat.recipients) && chat.recipients.length > 0) {
								if (JSON.isJSON(chat.recipients[0])) {
									chat.recipients[0].presence = presence;
								}
							}
						}
					}
				});
				return newChats;
			} catch(err) {
				console.error(err);
				return currentChats;
			}
				
			
		});
	}

	const handleOnUserStartedTypingMessage = ({conversation, user}) => {
		console.log("message-typing-started", conversation, user)
		setChats(currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));
				let user_id = user; 
				if (JSON.isJSON(user)) {
					user_id = user._id;
				}
				let chat_id = conversation;
				if (JSON.isJSON(conversation)) {
					chat_id = conversation._id;
				}
				newChats.forEach(function(chat) {

					if (chat._id === chat_id) {
						let typing_users_arr = Array.isArray(chat.typing)? chat.typing : [];
						let exists = false;
						typing_users_arr.map(chat_typing_user => {
							if (!exists && chat_typing_user._id.toString() === user_id.toString()) {
								exists = true;
							}
							
						});
						if (!exists) {
							chat.typing = typing_users_arr.concat([user]);
						}
					}
				});
				return newChats;
			} catch(err) {
				console.error(err);
				return currentChats;
			}
				
			
		});
	}
	

	const handleOnUserStoppedTypingMessage = ({conversation, user}) => {
		console.log("message-typing-stopped", conversation, user)
		setChats(currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));
				let user_id = user; 
				if (JSON.isJSON(user)) {
					user_id = user._id;
				}
				let chat_id = conversation;
				if (JSON.isJSON(conversation)) {
					chat_id = conversation._id;
				}
				newChats.forEach(function(chat) {
					if (chat._id.toString() === chat_id.toString()) {
						let typing_users_arr = Array.isArray(chat.typing)? chat.typing : [];
						chat.typing = typing_users_arr.filter(chat_typing_user => {
							return chat_typing_user._id.toString() !== user_id.toString()
						});
					}
				});
				return newChats;
			} catch(err) {
				console.error(err);
				return currentChats;
			}
				
			
		});
	}
	

	//console.log("handlePresenceChanged.bind", handlePresenceChanged.bind(contacts));

	useEffect(() => {
		setChats(conversations);
	}, [conversations]);

	useEffect(() => {
		if (Array.isArray(chats)) {
			let newIndividualConversationsRecipients = [];
			chats.map(chat => {
				if (chat.type === "individual") {
					let chat_owner_id = chat.owner;
					if (JSON.isJSON(chat.owner)) {
						chat_owner_id = chat.owner._id;
					}
					if (chat_owner_id !== auth.user._id) {
						newIndividualConversationsRecipients.push(chat_owner_id);
					}
					else {
						if (Array.isArray(chat.recipients) && chat.recipients.length > 0) {
							if (JSON.isJSON(chat.recipients[0])) {
								newIndividualConversationsRecipients.push(chat.recipients[0]._id);
							}
							else{
								newIndividualConversationsRecipients.push(chat.recipients[0]);
							}
						}
					}
				}
			});
			setIndividualConversationsRecipients(newIndividualConversationsRecipients);
		}			
	}, [chats]);

	useEffect(() => {
		loadContacts();
		loadConversations();
	}, [definations, query]);

	useEffect(() => {		
		if (activeChat) {
			if (activeChat._id && sockets.default) {
				sockets.default.emit("get-conversation-messages", {conversation: activeChat._id, user: auth.user});				
			}
		}
	}, [activeChat, sockets]);

	useEffect(() => {
		if (sockets.default) {
			sockets.default.on("presence-changed", handlePresenceChanged);
			sockets.default.on("user-changed-presence", handlePresenceChanged);
			sockets.default.on("message-typing-started", handleOnUserStartedTypingMessage);
			sockets.default.on("message-typing-stopped", handleOnUserStoppedTypingMessage);
			

			return ()=>{
				sockets.default.off("presence-changed", handlePresenceChanged);
				sockets.default.off("user-changed-presence", handlePresenceChanged);
				sockets.default.off("message-typing-started", handleOnUserStartedTypingMessage);
				sockets.default.off("message-typing-stopped", handleOnUserStoppedTypingMessage);
			}
		}
	}, [sockets]);


	
	return (
		<Paper className={classNames({"p-0 m-0 relative": true, [classes.root] : true, [className]: true})} >
			<AppBar position="absolute" color="transparent" className={classes.mainAppBar}>
				<Toolbar>
					{activeChat && <IconButton 
						onClick={()=>setActiveChat(false)}
						className={"mr-2"}
						edge="start" 
						color="inherit" 
						aria-label="back-to-chats"
					>
						<ArrowBackIcon />
					</IconButton>}
					{activeChat && (activeChat.type == "individual"? ((auth.user._id === activeChat.owner._id || auth.user._id === activeChat.owner) && activeChat.recipients[0].avatar? (<Avatar className={"mr-6 w-6 h-6"} src={AttachmentsService.getAttachmentFileUrl(activeChat.recipients[0].avatar)} />) : (<Avatar className={"mr-2 w-6 h-6 bg-transparent accent-text"}><PersonIcon /></Avatar>)) : (activeChat.group_avatar? (<Avatar className={"mr-6"} src={AttachmentsService.getAttachmentFileUrl(activeChat.group_avatar)} />) : (<Avatar className={"mr-6 w-6 h-6 bg-transparent accent-text"}> {activeChat.type === "group"? <PeopleIcon /> : <PersonIcon />}</Avatar>)))}
					{activeChat && <Typography variant="h6" className={"capitalize flex-grow"}>
						{activeChat.type == "individual"? ((auth.user._id === activeChat.owner._id || auth.user._id === activeChat.owner)? (activeChat.recipients[0].first_name +" "+activeChat.recipients[0].last_name) : (activeChat.owner.first_name +" "+activeChat.owner.last_name)) : (activeChat.type == "group"? activeChat.group_name : "Realfield")}
					</Typography>}

					{!activeChat && <Typography variant="h6" className={"capitalize flex-grow"}>
						Conversations
					</Typography>}

					{(!activeChat && !contactsDrawerOpen) && <IconButton 
						onClick={()=>setContactsDrawerOpen(true)}
						className={"mr-2"}
						edge="end" 
						color="inherit" 
						aria-label="Contacts"
					>
						<ContactsIcon />
					</IconButton>}
				</Toolbar>
			</AppBar>
			<SwipeableDrawer
				className={classNames({[classes.drawer]: true/*, "hidden": !contactsDrawerOpen*/})}
				variant={device.window_size.width >= 768? "persistent" : "temporary" }
				anchor="right"
				open={contactsDrawerOpen}
				onClose={()=>setContactsDrawerOpen(false)}
				onOpen={()=>setContactsDrawerOpen(true)}
				classes={{
					paper: device.window_size.width >= 768? classes.drawerPaper : classes.temporaryDrawerPaper,
				}}
			>
				<div className={"w-full flex flex-row items-center h-16 secondary"}>
					<IconButton className={"mx-2"} color="inherit">
						<ContactsIcon />
					</IconButton>
					<Typography variant="subtitle1" color="inherit" className="flex-grow">
						Contacts
					</Typography>

					<IconButton className={"mx-2"} color="inherit" onClick={()=>setContactsDrawerOpen(false)}>
						{theme.direction === 'ltr' ?  <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
				<Divider />

				<ScrollBars className={classes.bodyWrapper}>
					{loadingContacts && <GridContainer>
								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-3/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-8/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-4/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-3/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-5/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-9/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-4/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-3/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" className="w-4/12"/>
									</div>
								</GridItem>
							</GridContainer>}

							{(Array.isArray(contacts) && !loadingContacts) && <List className={classes.list}>
								{contacts.map((contact, cursor)=> (
									<ListItem 
										className={"px-8 "} 
										key={"contact-"+cursor}
										onClick={() => {
											if (!individualConversationsRecipients.includes(contact._id)) {
												handleNewChat(contact)
											}
										}}
										button
									>
										<ListItemAvatar>
											<Badge 
												variant="dot" 
												badgeContent=" "
												anchorOrigin={{
													vertical: 'bottom',
													horizontal: 'right',
												}}
												classes={{
													dot: contact.presence === "online"? "bg-green-600" : (contact.presence == "away"? "bg-orange-500" : "bg-gray-500")
												}}
											>
												{ contact.avatar && <Avatar className={classes.contactAvatar} src={AttachmentsService.getAttachmentFileUrl(contact.avatar)} />}
												{!contact.avatar && <Avatar className={classes.contactAvatar}>
													<PersonIcon />
												</Avatar>}
											</Badge>
										</ListItemAvatar>

										<ListItemText 
											className="flex flex-col justify-center"
											primary={(
												<Typography variant="body1" color="textPrimary" className={"capitalize text-bold"}>
													{contact.first_name+" "+contact.last_name}
												</Typography>
											)} 
										/>
									</ListItem>
								))}
							</List>}

				</ScrollBars>
			</SwipeableDrawer>
			{!activeChat && <GridItem md={12} className={"flex flex-col relative min-h-full p-0"}>					
						<Paper square className={classes.paper}>
							<ScrollBars className={classes.bodyWrapper}>
							{loadingConversations && <GridContainer>
								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-3/6"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={110} className="mb-1"/>
										<Skeleton variant="text" className="w-8/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-4/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={90} className="mb-1"/>
										<Skeleton variant="text" className="w-3/6"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={70} className="mb-1"/>
										<Skeleton variant="text" className="w-10/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-9/12"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={120} className="mb-1"/>
										<Skeleton variant="text" className="w-4/5"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={100} className="mb-1"/>
										<Skeleton variant="text" className="w-3/6"/>
									</div>
								</GridItem>

								<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
									<Skeleton variant="circle" width={40} height={40} />
									<div className="flex-grow mx-2 flex flex-col">
										<Skeleton variant="text" width={80} className="mb-1"/>
										<Skeleton variant="text" className="w-11/12"/>
									</div>
								</GridItem>
							</GridContainer>}

							{(Array.isArray(chats) && !loadingConversations) && <List className={classes.list}>
							{chats.map((chat, index)=> {
								let primaryText = "";
								let chatUser = false;
								let avatar = false;
								if (chat.type == "individual") {
									let chat_owner_id = chat.owner;
									if (JSON.isJSON(chat.owner)) {
										chat_owner_id = chat.owner._id;
									}
									if (auth.user._id === chat_owner_id) {
										chatUser = chat.recipients[0];
										primaryText = chat.recipients[0].first_name +" "+chat.recipients[0].last_name
										avatar = chat.recipients[0].avatar;
									}
									else{
										chatUser = chat.owner;
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
										className={"px-8 "} 
										onClick={(event)=> setActiveChat(chat)}
										key={"chat-"+index}
										button
									>
										{chatUser && <ListItemAvatar>
											<Badge 
												variant="dot" 
												badgeContent=" "
												anchorOrigin={{
													vertical: 'bottom',
													horizontal: 'right',
												}}
												classes={{
													dot: chatUser.presence === "online"? "bg-green-600" : (chatUser.presence == "away"? "bg-orange-500" : "bg-gray-500")
												}}
											>
												{ chatUser.avatar && <Avatar className={classes.contactAvatar} src={AttachmentsService.getAttachmentFileUrl(chatUser.avatar)} />}
												{!chatUser.avatar && <Avatar className={classes.contactAvatar}>
													<PersonIcon />
												</Avatar>}
											</Badge>
										</ListItemAvatar>}
										{!chatUser && <ListItemAvatar>
											{ avatar && <Avatar src={AttachmentsService.getAttachmentFileUrl(avatar)} />}
											{!avatar && <Avatar className={classes.iconAvatar}>
												{chat.type === "group"? <PeopleIcon /> : <PersonIcon />}
											</Avatar>}
										</ListItemAvatar>}
										<ListItemText 
											className="flex flex-col justify-center"
											primary={(
												<Typography variant="body1" color="textPrimary" className={"capitalize text-bold"}>
													{primaryText}
												</Typography>
											)} 
											secondary={(
												<div className="w-full flex flex-row">
													{Array.isArray(chat.typing) && <Typography variant="body2" color="primary" className="mx-0">
														{chat.typing.length > 1? (chat.typing.length+" people are typing...") : (chat.typing.length === 1? (chat.typing[0].first_name+" is typing...") : "")}
													</Typography>}
													{(!Array.isArray(chat.typing) || chat.typing.length ===0) && <Typography variant="body2" color="textSecondary" className="truncate mr-2 flex-grow font-normal">
														Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
													</Typography>}
													{(!Array.isArray(chat.typing) || chat.typing.length ===0) && <Typography variant="body2" color="secondary" className="mx-2">
														<DoneAllIcon fontSize="inherit" />
													</Typography>}
												</div>
											)}
										/>
										{/*<ListItemSecondaryAction>
											<IconButton edge="end" aria-label="receipt-status">
											  <DoneAllIcon />
											</IconButton>
										</ListItemSecondaryAction>*/}
									</ListItem>
								);
							})}
								
							</List>}
							</ScrollBars>
						</Paper>
						<AppBar position="absolute" color="secondary" className={classes.chatsAppBar}>
							<Toolbar>
								<IconButton 
									edge="start" 
									color="inherit" 
									aria-label="Refresh"
									onClick={handleRefresh}
								>
									<RefreshIcon />									
								</IconButton>

								<Fab 
									color="primary" 
									aria-label="add" 
									className={classes.fabButton}
									onClick={()=>setContactsDrawerOpen(!contactsDrawerOpen)}
								>
									{!contactsDrawerOpen && <ChatBubbleOutlineIcon />}
									{contactsDrawerOpen && <CloseIcon />}
								</Fab>

								<div className={classes.grow} />

								{/*<IconButton edge="end" color="inherit">
									<MoreIcon />
								</IconButton>*/}

								<IconButton 
									color="inherit" 
									aria-label="Search"
									edge="end"
									
								>
									<SearchIcon />
								</IconButton>
							</Toolbar>
						</AppBar>
			</GridItem>}

			{activeChat && <Paper square elevation={0} className={classes.chatPaperWrapper}>
				<GridItem md={12} className="h-full p-0 flex flex-col relative">
					<ScrollBars 
						className={classes.scrollWrapper+"  flex-grow"} 
						style={{flex: 10, backgroundColor: theme.palette.background.default}}
					>
						<GridContainer className="px-4">
							<GridItem xs={12}>
								
								
							</GridItem>
						</GridContainer>
					</ScrollBars>

					

					<GridContainer 
						className={classes.chatInputsWrapper} 
						style={{ backgroundColor: theme.palette.background.paper}}
					>

						<GridItem xs={12}>
							<TextInput
								variant="outlined"
								multiline
								rows={4}
								onBlur={()=>{
									if (activeChat._id && sockets.default) {
										sockets.default.emit("stopped-typing-message", {conversation: activeChat._id, user: auth.user});
										
									}
								}}
								defaultValue={activeChat._id === draft.conversation? draft.message : undefined}
								onChange={(new_value)=>{

									if (activeChat._id && sockets.default && !String.isEmpty(new_value)) {
										sockets.default.emit("started-typing-message", {conversation: activeChat._id, user: auth.user});
										setDraft({
											message: new_value,
											conversation: activeChat._id,
										})
										
									}
								}}
							/>
						</GridItem>
					</GridContainer>

				</GridItem>
			</Paper>}

		</Paper>
	);
}



const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
	device: state.device,
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
