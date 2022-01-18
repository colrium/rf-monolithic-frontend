import React, { useState, useEffect, useCallback, useRef } from "react";
import classNames from "classnames";

import Badge from "@mui/material/Badge";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ContactsIcon from '@mui/icons-material/Contacts';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BlockIcon from '@mui/icons-material/Block';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ScheduleIcon from "@mui/icons-material/Schedule";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Fab from '@mui/material/Fab';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";
import ScrollBars from "components/ScrollBars";
import LazyImage from "components/LazyImage";
import ViewPortSensor from "components/ViewPortSensor";
import Listings from "views/widgets/Listings";


import {
	FileInput,
	TextInput,
} from "components/FormInputs";

import { useNetworkServices } from "contexts";
import * as definations from "definations";
import { useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";
import { apiCallRequest, setMessagingCache, setActiveConversation, sendMessage, fetchMessages, updateMessage, fetchContacts, fetchInbox, createConversation } from "state/actions";

import { useDidMount, useWillUnmount } from "hooks";





const drawerWidth = 240;


function Alert (props) {
	return <MuiAlert elevation={ 6 } variant="filled" { ...props } />;
}


const AlwaysScrollToBottom = React.forwardRef((props, ref) => {

	const scrollIntoView = useCallback(() => {
		if (ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [ref.current]);

	useEffect(() => {
		/*Sockets.on("message-sent", scrollIntoView);
		Sockets.on("new-message", scrollIntoView);*/
		//scrollIntoView();
		return () => {
			/*Sockets.off("message-sent", scrollIntoView);
			Sockets.off("new-message", scrollIntoView);*/
		}
	}, []);
	return <div ref={ ref } />;
});

function Chat (props) {
	const { classes, className, layout, communication: { messaging }, activeConversation, auth, device: { window_size }, apiCallRequest, theme, setMessagingCache, setActiveConversation, sendMessage, fetchMessages, updateMessage, fetchContacts, fetchInbox, createConversation, ...rest } = props;


	let textInputRef = React.createRef();
	let messagesWrapperRef = React.createRef();
	let conversationBottomRef = useRef();
	let location = useLocation();
	let history = useHistory();






	const { Sockets, Api: ApiService } = useNetworkServices();
	const { unread_count, unread_ids, conversations, fetching_inbox, contacts: cacheContacts, drafts, active_conversation, active_conversation_messages, contactactable_contacts_ids } = messaging;

	const [query, setQuery] = useState({ desc: "created_on" });
	const [contactsQuery, setContactsQuery] = useState({ desc: "created_on" });
	const [loadingContacts, setLoadingContacts] = useState(true);
	const [draft, setDraft] = useState({});
	const [individualConversationsRecipients, setIndividualConversationsRecipients] = useState([]);
	const [activeConversationRecipients, setActiveConversationRecipients] = useState([]);
	const [error, setError] = useState(false);
	const [contacts, setContacts] = useState([]);
	const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
	const [attachmentDialOpen, setAttachmentDialOpen] = useState(false);
	const [contextMenu, setContextMenu] = useState({ mouseX: null, mouseY: null, });
	const [loadingActiveChatMessages, setLoadingActiveChatMessages] = useState(false);
	const [locationHasWith, setLocationHasWith] = useState(false);
	const [firstLoad, setFirstLoad] = useState(true);
	const [searchKeyword, setSearchKeyword] = useState(false);




	const attachmentActions = [
		{ icon: <ImageOutlinedIcon />, name: 'image', label: 'Image', color: theme.palette.error.main },
		{ icon: <AudiotrackOutlinedIcon />, name: 'audio', label: 'Audio', color: theme.palette.accent.main },
		{ icon: <MovieOutlinedIcon />, name: 'video', label: 'Video', color: theme.palette.warning.main },
		{ icon: <AttachFileIcon />, name: 'file', label: 'File', color: theme.palette.info.main },
	];



	const scrollToBottomOfConversation = useCallback(() => {
		if (conversationBottomRef.current) {
			conversationBottomRef.current.scrollIntoView();
		}
	}, [conversationBottomRef]);




	const handleContextOpen = (type, entry) => event => {
		event.preventDefault();
		setContextMenu({
			type: type,
			entry: entry,
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		});
	};

	const handleContextClose = () => {
		setContextMenu({ mouseX: null, mouseY: null, });
	};

	const handleArchiveConversation = (conversation) => {
		setMessagingCache("conversations", currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));

				newChats = newChats.filter(chat => {
					if (conversation) {
						if (JSON.isJSON(conversation)) {
							return chat._id !== conversation._id;
						}
						return chat._id !== conversation;
					}
					return true;
				});

				return newChats;
			} catch (err) {
				return currentChats;
			}
		});
		Sockets.emit("archive-conversation", { conversation: conversation, user: auth.user });

	};

	const handleDeleteConversation = (conversation) => {
		setMessagingCache("conversations", currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));

				newChats = newChats.filter(chat => {
					if (conversation) {
						if (JSON.isJSON(conversation)) {
							return chat._id !== conversation._id;
						}
						return chat._id !== conversation;
					}
					return true;
				});

				return newChats;
			} catch (err) {
				return currentChats;
			}
		});

		Sockets.emit("delete-conversation-for-user", { conversation: conversation, user: auth.user });

	};



	const handleNewChat = (recipients) => {
		if (recipients) {
			let recipients_ids = [];
			recipients = Array.isArray(recipients) ? recipients : [recipients];

			recipients.map(recipient => {
				if (JSON.isJSON(recipient) && "_id" in recipient) {
					recipients_ids.push(recipient._id);
				}
				else if (!String.isEmpty(recipient)) {
					recipients_ids.push(recipient);
				}
			});

			createConversation({ recipients: recipients }).then(new_conversation => {
				setDraft({
					is_reply: false,
					sender: auth.user,
					reply_for: null,
					type: "text",
					content: "",
					conversation: new_conversation._id,
				});
			}).catch(err => {});


			setContactsDrawerOpen(false);

		}
	}

	const handleRefresh = () => {
		fetchInbox();
	}

	const handlePresenceChanged = ({ user, presence }) => {
		setContacts(currentContacts => {
			try {
				let newContacts = JSON.parse(JSON.stringify(currentContacts));
				let user_id = user;
				if (JSON.isJSON(user)) {
					user_id = user._id;
				}
				newContacts.forEach(function (contact) {
					if (user_id === contact._id) {
						contact.presence = presence;
					}
				});
				return newContacts;
			} catch (err) {
				return currentContacts;
			}

		});
		setMessagingCache("conversations", currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));
				let user_id = user;
				if (JSON.isJSON(user)) {
					user_id = user._id;
				}
				newChats.forEach(function (chat) {
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
			} catch (err) {
				return currentChats;
			}


		});
	}






	const handleOnChangeDraftType = (type) => {
		setDraft(currentDraft => {
			try {
				let newDraft = JSON.parse(JSON.stringify(currentDraft));
				newDraft.type = type;
				return newDraft;
			} catch (err) {
				return currentDraft;
			}
		});
	}

	const handleOnConversationMessages = ({ conversation, messages }) => {
		setLoadingActiveChatMessages(false);
		setMessagingCache("active_conversation_messages", messages);
	}

	const handleOnConversationCreated = (conversation) => {

	}



	const getConversationMessages = (conversation, query = { desc: "created_on", p: "1", page: 1, pagination: 10 }) => {
		if (conversation) {
			let conversation_id = conversation._id ? conversation._id : conversation;
			setLoadingActiveChatMessages(true);
			setMessagingCache("active_conversation_messages", []);
			setError(false);
			apiCallRequest(definations.messages.name, {
				uri: definations.messages.endpoint,
				type: "records",
				params: { conversation: conversation_id, ...query },
				data: {},
				cache: false,
			}).then(data => {
				//
				setError(false);
			}).catch(e => {
				let errorMsg = e;
				if (JSON.isJSON(e)) {
					if ("msg" in e) {
						errorMsg = e.msg;
					}
					else {
						errorMsg = JSON.stringify(e);
					}
				}

				setError(errorMsg);
			});
			//Sockets.emit("get-conversation-messages", {conversation: conversation._id, user: auth.user});

		}
		else {
			setLoadingActiveChatMessages(false);
		}
	}

	const handleOnSendMessage = (messageToSend, conversation) => {
		if (conversation) {
			let conversation_id = conversation._id ? conversation._id : conversation;
			let newMessage = { ...draft, sender: auth.user._id, conversation: conversation_id, created_on: new Date() };
			if (messageToSend) {
				if (JSON.isJSON(messageToSend)) {
					newMessage = JSON.merge(messageToSend, newMessage);
				}
				else if (String.isString(messageToSend)) {
					newMessage.content = messageToSend.trim();
				}
			}

			if (!String.isEmpty(newMessage.content) || (["audio", "file", "video", "image"].includes(newMessage.type) && (Array.isArray(newMessage.attachments) ? (newMessage.attachments.length > 0) : false))) {

				sendMessage(newMessage);

				if (textInputRef.current) {
					textInputRef.current.value = "";
					textInputRef.current.focus();
				}


				scrollToBottomOfConversation();

				setDraft({
					is_reply: false,
					sender: auth.user,
					reply_for: null,
					type: "text",
					content: "",
					conversation: conversation_id,
				});

			}
		}
	}

	const handleMessageInputKeyDown = (conversation) => (event) => {
		if (event.key === 'Enter' && conversation) {
			event.preventDefault();
			let conversation_id = conversation._id ? conversation._id : conversation;
			let newMessageValue = event.target.value;
			if (String.isString(newMessageValue)) {
				newMessageValue = newMessageValue.trim();
			}
			else {
				newMessageValue = "";
			}
			if (!String.isEmpty(newMessageValue) || (["audio", "file", "video", "image"].includes(draft.type) && (Array.isArray(draft.attachments) ? (draft.attachments.length > 0) : false))) {
				Sockets.emit("stopped-typing-message", { conversation: conversation_id, user: auth.user });
				handleOnSendMessage(newMessageValue, conversation);
			}

		}
	}

	const handleSocketActionError = (error) => {
		setError("Something went wrong!. " + error);
	}

	const handleOnMessageDeletedForUser = ({ message, user }) => {
		updateMessage(message);
	}

	const handleOnMessageDeletedForAll = ({ message, user }) => {
		updateMessage(message);
	}

	const handleOnMessageStateChangedBySocketAction = ({ message, user }) => {
		updateMessage(message);
	}



	useEffect(() => {
		scrollToBottomOfConversation();
	}, []);

	useEffect(() => {
		if (active_conversation && firstLoad) {
			fetchMessages(active_conversation);
			setFirstLoad(false);
		}


	}, [active_conversation, firstLoad]);





	useEffect(() => {
		if (location && !locationHasWith) {
			let params = new URLSearchParams(location.search);
			const withRecipient = params.get('with');
			if (!String.isEmpty(withRecipient)) {
				if (withRecipient.indexOf("@") !== -1) {
					setContactsQuery({ email_address: withRecipient.trim() });
				}
				else {
					setContactsQuery({ _id: withRecipient.trim() });
				}
				setLocationHasWith(true);

			}
		}
	}, [location, locationHasWith]);

	useEffect(() => {

	}, [contactsQuery]);

	useEffect(() => {
		if (Array.isArray(conversations)) {
			let newIndividualConversationsRecipients = [];
			conversations.map(chat => {
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
							else {
								newIndividualConversationsRecipients.push(chat.recipients[0]);
							}
						}
					}
				}
			});
			setIndividualConversationsRecipients(newIndividualConversationsRecipients);
		}
	}, [conversations]);


	useDidMount(() => {
		fetchInbox();
	});



	useDidMount(() => {
		Sockets.on("presence-changed", handlePresenceChanged);
		Sockets.on("user-changed-presence", handlePresenceChanged);
		//Sockets.on("message-typing-started", handleOnUserStartedTypingMessage);
		//Sockets.on("message-typing-stopped", handleOnUserStoppedTypingMessage);
		//Sockets.on("conversation-messages", handleOnConversationMessages);
		/*Sockets.on("new-message", handleOnNewMessage);
		Sockets.on("message-sent", handleOnMessageSent);*/
		Sockets.on("messages-deleted-for-user", handleOnMessageDeletedForUser);
		Sockets.on("messages-deleted-for-all", handleOnMessageDeletedForAll);
		Sockets.on("message-marked-as-received", handleOnMessageStateChangedBySocketAction);
		Sockets.on("message-received", handleOnMessageStateChangedBySocketAction);
		Sockets.on("message-marked-as-read", handleOnMessageStateChangedBySocketAction);
		Sockets.on("message-read", handleOnMessageStateChangedBySocketAction);
		Sockets.on("delete-conversation-for-user-error", handleSocketActionError);
		Sockets.on("delete-message-for-user-error", handleSocketActionError);
		Sockets.on("delete-message-for-all-error", handleSocketActionError);






	});

	useWillUnmount(() => {
		Sockets.off("presence-changed", handlePresenceChanged);
		Sockets.off("user-changed-presence", handlePresenceChanged);
		//Sockets.off("conversation-messages", handleOnConversationMessages);
		/*Sockets.off("new-message", handleOnNewMessage);
		Sockets.off("message-sent", handleOnMessageSent);*/
		Sockets.off("messages-deleted-for-user", handleOnMessageDeletedForUser);
		Sockets.off("messages-deleted-for-all", handleOnMessageDeletedForAll);
		Sockets.off("delete-conversation-for-user-error", handleSocketActionError);
		Sockets.off("message-marked-as-received", handleOnMessageStateChangedBySocketAction);
		Sockets.off("message-received", handleOnMessageStateChangedBySocketAction);
		Sockets.off("message-marked-as-read", handleOnMessageStateChangedBySocketAction);
		Sockets.off("message-read", handleOnMessageStateChangedBySocketAction);
		Sockets.off("delete-message-for-user-error", handleSocketActionError);
		Sockets.off("delete-message-for-all-error", handleSocketActionError);
		Sockets.off("create-conversation-error", handleSocketActionError);
	})

	return (
		<Paper className={ classNames({ "p-0 m-0 relative overflow-x-hidden overflow-y-visible ": true, [className]: !!className }) } >
			<AppBar position="relative" color="transparent" className={ "" }>
				<Toolbar>
					{ active_conversation && <IconButton
						onClick={ () => {
							if (history && locationHasWith) {
								history.push(history.location.pathname);
							}
							setActiveConversation(false);

						} }
						className={ "mr-2" }
						edge="start"
						color="inherit"
						aria-label="back-to-conversations"
					>
						<ArrowBackIcon />
					</IconButton> }
					{ active_conversation && (active_conversation.type == "individual" ? ((auth.user._id === active_conversation.owner._id || auth.user._id === active_conversation.owner) && (Array.isArray(active_conversation.participants) && active_conversation.participants.length > 0 && active_conversation.participants[0].avatar) ? (<Avatar className={ "mr-6 w-6 h-6" } src={ ApiService.getAttachmentFileUrl(active_conversation.participants[0].avatar) } />) : (active_conversation.started_by && active_conversation.started_by.avatar ? (<Avatar className={ "mr-6 w-6 h-6" } src={ ApiService.getAttachmentFileUrl(active_conversation.started_by.avatar) } />) : (<Avatar className={ "mr-2 w-6 h-6 bg-transparent accent-text" }><PersonIcon /></Avatar>))) : (active_conversation.group_avatar ? (<Avatar className={ "mr-6" } src={ ApiService.getAttachmentFileUrl(active_conversation.group_avatar) } />) : (<Avatar className={ "mr-6 w-6 h-6 bg-transparent accent-text" }> { active_conversation.type === "group" ? <PeopleIcon /> : <PersonIcon /> }</Avatar>))) }
					{ active_conversation && <Typography variant="h6" className={ "capitalize flex-grow" }>
						{ active_conversation.type == "individual" ? (((auth.user._id === active_conversation.owner._id || auth.user._id === active_conversation.owner) && Array.isArray(active_conversation.participants) && active_conversation.participants.length > 0) ? (active_conversation.participants[0].first_name + " " + active_conversation.participants[0].last_name) : (active_conversation.started_by ? (active_conversation.started_by.first_name + " " + active_conversation.started_by.last_name) : "")) : (active_conversation.type == "group" ? active_conversation.group_name : "Realfield") }
					</Typography> }

					{ !active_conversation && <Typography variant="h6" className={ "capitalize flex-grow" }>
						Conversations
					</Typography> }


					{ (!active_conversation && !contactsDrawerOpen) && <IconButton
						onClick={ () => setContactsDrawerOpen(true) }
						className={ "mr-2" }
						edge="end"
						color="inherit"
						aria-label="Contacts"
					>
						<ContactsIcon />
					</IconButton> }
				</Toolbar>
			</AppBar>
			<SwipeableDrawer
				className={ classNames({ "w-40": true/*, "hidden": !contactsDrawerOpen*/ }) }
				variant={ window_size.width >= 768 ? "persistent" : "temporary" }
				anchor="right"
				open={ contactsDrawerOpen }
				onClose={ () => setContactsDrawerOpen(false) }
				onOpen={ () => setContactsDrawerOpen(true) }
				classes={ {
					paper: window_size.width >= 768 ? classes?.drawerPaper : classes?.temporaryDrawerPaper,
				} }
			>
				<div className={ "w-full flex flex-row items-center h-16 secondary" }>
					<IconButton className={ "mx-2" } color="inherit">
						<ContactsIcon />
					</IconButton>
					<Typography variant="h6" className={ "capitalize flex-grow" }>
						Contacts
					</Typography>
					{/*<TextInput
								variant={"outlined"}
								defaultValue={active_conversation._id === draft.conversation? draft.content : undefined}
								onChange={(new_value)=>{
									if (!String.isEmpty(new_value)) {
										setSearchKeyword(new_value);
									}
									else {
										setSearchKeyword(false);
									}
								}}
								placeholder="Search..."
								label="Search"
							/>*/}

					<IconButton className={ "mx-2" } color="inherit" onClick={ () => setContactsDrawerOpen(false) }>
						{ theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
					</IconButton>
				</div>
				<Divider />

				<ScrollBars className={ "overflow-x-hidden overflow-y-scroll h-screen" }>


					{ definations && <Listings
						show_actions={ false }
						show_links={ false }
						showViewOptions={ false }
						showAddBtn={ false }
						cache_data={ false }
						showPagination
						showSorter
						defination={ definations.users }
						service={ ApiService.getContextRequests(definations.users.endpoint) }
						query={ contactsQuery }
						view={ "listview" }
						onClickEntry={ (contact) => handleNewChat(contact) }
						onLoadData={ (loadedData, loadedQuery) => {
							if (locationHasWith && Array.isArray(loadedData)) {
								loadedData.map(entry => {
									if (entry._id === loadedQuery._id || entry.email_address === loadedQuery.email_address) {
										handleNewChat(entry);
									}
								})
							}

						} }
					/> }


				</ScrollBars>
			</SwipeableDrawer>
			{ !active_conversation && <GridItem md={ 12 } className={ "flex flex-col relative min-h-full p-0" }>
				<Paper elevation={ 0 } square className={ classes?.paper }>
					<ScrollBars
						className={ "overflow-x-hidden overflow-y-scroll  pb-16" }
						onYReachStart={ (event) => {
							//
						} }
					>
						{ (fetching_inbox && (!Array.isArray(conversations) || (Array.isArray(conversations) && conversations.length === 0))) && <GridContainer>
							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 80 } className="mb-1" />
									<Skeleton variant="text" className="w-3/6" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 110 } className="mb-1" />
									<Skeleton variant="text" className="w-8/12" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 80 } className="mb-1" />
									<Skeleton variant="text" className="w-4/12" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 90 } className="mb-1" />
									<Skeleton variant="text" className="w-3/6" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 70 } className="mb-1" />
									<Skeleton variant="text" className="w-10/12" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 80 } className="mb-1" />
									<Skeleton variant="text" className="w-9/12" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 120 } className="mb-1" />
									<Skeleton variant="text" className="w-4/5" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 100 } className="mb-1" />
									<Skeleton variant="text" className="w-3/6" />
								</div>
							</GridItem>

							<GridItem md={ 12 } className={ "flex flex-row items-center relative p-0 px-4 my-4" }>
								<Skeleton variant="circle" width={ 40 } height={ 40 } />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" width={ 80 } className="mb-1" />
									<Skeleton variant="text" className="w-11/12" />
								</div>
							</GridItem>
						</GridContainer> }

						{ (!fetching_inbox, (!Array.isArray(conversations) || (Array.isArray(conversations) && conversations.length === 0)) && <GridContainer>
							<GridItem md={ 12 } className={ "flex flex-col items-center relative p-0 px-4 my-4" }>
								<Typography variant="subtitle1" color="textSecondary" className="mx-0 my-12 h-20 w-20 md:w-40  md:h-40 rounded-full text-4xl md:text-6xl flex flex-row items-center justify-center" style={ { color: theme.palette.text.disabled, background: theme.palette.background.default } }>
									<ForumOutlinedIcon fontSize="inherit" />
								</Typography>
								<Typography variant="body2" color="textSecondary" className="mx-0" style={ { color: theme.palette.text.disabled } }>
									You don't have any active conversations yet
								</Typography>
							</GridItem>
						</GridContainer>) }

						{ Array.isArray(conversations) && <List className={ classes?.list }>
							{ conversations.map((chat, index) => {

								if (index === 0 || (index > 0 && conversations[index - 1]._id !== conversations[index]._id)) {
									let primaryText = "";
									let chatUser = false;
									let avatar = false;
									let last_message_content = false;
									let last_message_deleted = false;
									let last_message_sender_name = false;
									if (chat.state && chat.state.total > 0 && chat.state.last_message) {
										last_message_content = chat.state.last_message.content;
										if (chat.state.last_message.sender === auth.user._id || chat.state.last_message.sender._id === auth.user._id) {
											last_message_sender_name = "You";
										}
										else if (chat.owner === chat.state.last_message.sender) {
											last_message_sender_name = chat.started_by.first_name;
										}
										else {
											if (Array.isArray(chat.participants)) {
												chat.participants.map(participant => {
													if (participant._id === chat.state.last_message.sender) {
														last_message_sender_name = participant.first_name;
													}
												});
											}
										}
										if ((chat.state.last_message.state === "deleted-for-sender" && (chat.state.last_message.sender._id === auth.user._id || chat.state.last_message.sender === auth.user._id)) || chat.state.last_message.state === "deleted-for-all") {
											last_message_deleted = true;
										}
									}
									if (chat.type == "individual") {
										let chat_owner_id = chat.owner;
										if (JSON.isJSON(chat.owner)) {
											chat_owner_id = chat.owner._id;
										}
										if (auth.user._id === chat_owner_id) {
											if (Array.isArray(chat.participants)) {
												if (chat.participants.length > 0) {
													chatUser = chat.participants[0];
													primaryText = chat.participants[0].first_name + " " + chat.participants[0].last_name
													avatar = chat.participants[0].avatar;
												}
											}

										}
										else {
											if (chat.started_by){
												chatUser = chat.started_by;
												primaryText = chat.started_by?.first_name + " " + chat.started_by?.last_name;
												avatar = chat.started_by?.avatar;
											}
											
											
										}
									}
									else if (chat.type == "group") {
										primaryText = chat.group_name;
										avatar = chat.group_avatar;
									}

									return (
										<ListItem
											className={ "px-8 content-between" }
											onClick={ (event) => {
												//setMessagingCache("active_conversation_messages", []);	
												//setMessagingCache("active_conversation", chat);	
												setActiveConversation(chat);
											} }
											onContextMenu={ handleContextOpen("conversation", chat) }
											key={ "chat-" + index }
											style={ { background: (contextMenu.type === "conversation" ? (contextMenu.entry._id === chat._id ? theme.palette.background.default : "transparent") : "transparent") } }
											button
										>
											{ chatUser && <ListItemAvatar>
												<Badge
													variant="dot"
													badgeContent=" "
													anchorOrigin={ {
														vertical: 'bottom',
														horizontal: 'right',
													} }
													classes={ {
														dot: chatUser.presence === "online" ? "bg-green-600" : (chatUser.presence == "away" ? "bg-orange-500" : "bg-gray-500")
													} }
												>
													{ chatUser.avatar && <Avatar className={ classes?.contactAvatar } src={ ApiService.getAttachmentFileUrl(chatUser.avatar) } /> }
													{ !chatUser.avatar && <Avatar className={ classes?.contactAvatar }>
														<PersonIcon />
													</Avatar> }
												</Badge>
											</ListItemAvatar> }
											{ !chatUser && <ListItemAvatar>
												{ avatar && <Avatar src={ ApiService.getAttachmentFileUrl(avatar) } /> }
												{ !avatar && <Avatar className={ classes?.iconAvatar }>
													{ chat.type === "group" ? <PeopleIcon /> : <PersonIcon /> }
												</Avatar> }
											</ListItemAvatar> }
											<ListItemText
												className="flex flex-col justify-center"
												primary={ (
													<Typography variant="body1" color="textPrimary" className={ "capitalize font-bold" }>
														{ primaryText }
													</Typography>
												) }
												secondary={ (
													<div className="w-full flex flex-row">
														{ Array.isArray(chat.typing) && <Typography variant="body2" color="primary" className="mx-0">
															{ chat.typing.length > 1 ? (chat.typing.length + " people are typing...") : (chat.typing.length === 1 ? (chat.typing[0].first_name + " is typing...") : "") }
														</Typography> }
														{ (!Array.isArray(chat.typing) || chat.typing.length === 0) && <div className="w-full flex flex-row items-center">
															<Typography variant="body2" color="textPrimary" className="font-bold mr-2">
																{ last_message_sender_name ? last_message_sender_name : "" }
															</Typography>
															{ !last_message_deleted && <Typography variant="body2" color="textSecondary" className="flex-initial truncate mr-2 font-normal" style={ last_message_content ? {} : { color: theme.palette.disabled } }>
																{ last_message_content ? last_message_content : "No messages yet" }
															</Typography> }
															{ last_message_deleted && <div className={ "flex flex-row items-center flex-initial" } style={ { color: theme.palette.divider } }>
																<Typography variant="body1" color="inherit" className={ "flex-grow" }>
																	Message deleted
																</Typography>
																<BlockIcon className={ "mx-1 text-xs" } fontSize="small" />
															</div> }

															{ (!last_message_deleted && chat.state && chat.state.last_message) && <div className={ "flex flex-row items-center " } style={ { color: theme.palette.text.disabled } }>
																{ (chat.state.last_message.state === "pending" && (chat.state.last_message.sender ? (chat.state.last_message.sender === auth.user._id || chat.state.last_message.sender._id === auth.user._id) : false)) && <ScheduleIcon className={ "mx-1 text-xs" } fontSize="small" /> }
																{ (chat.state.last_message.state === "sent" && chat.state.last_message.sender === auth.user._id) && <DoneIcon className={ "mx-1 text-xs" } fontSize="small" /> }
																{ ((chat.state.last_message.state === "partially-received" || chat.state.last_message.state === "received") && (chat.state.last_message.sender ? (chat.state.last_message.sender === auth.user._id || chat.state.last_message.sender._id === auth.user._id) : false)) && <DoneAllIcon className={ "mx-1 text-xs" } fontSize="small" /> }
																{ ((chat.state.last_message.state === "partially-read" || chat.state.last_message.state === "read") && (chat.state.last_message.sender ? (chat.state.last_message.sender === auth.user._id || chat.state.last_message.sender._id === auth.user._id) : false)) && <DoneAllIcon className={ "mx-1 text-xs" } color={ "secondary" } fontSize="small" /> }
															</div> }
														</div> }
														{ (!Array.isArray(chat.typing) || chat.typing.length === 0) && <Typography variant="body2" color="secondary" className="mx-2">
															{/*<DoneAllIcon fontSize="inherit" />*/ }
														</Typography> }
													</div>
												) }
											/>
											{ (chat.state && chat.state.incoming_unread > 0) && <ListItemSecondaryAction>
												<Avatar className={ "bg-transparent primary-text h-4 w-4 text-xs" }>
													{ chat.state.incoming_unread }
												</Avatar>
											</ListItemSecondaryAction> }
										</ListItem>
									);
								}

							}) }

						</List> }
					</ScrollBars>
				</Paper>
				<AppBar
					position="relative"
					color="secondary"
					className={ "bottom-0 top-auto" }
					sx={ {
						backgroundColor: theme => theme.palette.secondary
					} }
				>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="Refresh"
							onClick={ handleRefresh }
						>
							<RefreshIcon />
						</IconButton>

						<Fab
							color="primary"
							aria-label="add"
							className={ classes?.fabButton }
							onClick={ () => setContactsDrawerOpen(!contactsDrawerOpen) }
						>
							{ !contactsDrawerOpen && <ChatBubbleOutlineIcon /> }
							{ contactsDrawerOpen && <CloseIcon /> }
						</Fab>

						<div className={ classes?.grow } />

						{/*<IconButton edge="end" color="inherit">
									<MoreIcon />
								</IconButton>*/}

						{/*<IconButton 
									color="inherit" 
									aria-label="Search"
									edge="end"
									
								>
									<SearchIcon />
								</IconButton>*/}
					</Toolbar>
				</AppBar>
			</GridItem> }

			{ active_conversation && <Paper square elevation={ 0 } className={ "relative flex-grow h-screen overflow-hidden" }>
				<GridItem md={ 12 } className="h-full p-0 flex flex-col relative">
					{ !["audio", "file", "video", "image"].includes(draft.type) && <ScrollBars
						className={ "flex-grow " + classes?.chatScrollWrapper }
						className={ "overflow-x-hidden overflow-y-scroll h-4/5  pb-8" }
						style={ { flex: 10, backgroundColor: theme.palette.background.default } }
						scrollToBottomOnChildChange={ false }
						onYReachStart={ (element) => {
							if (element) {
								if (active_conversation.state) {
									if (!active_conversation.state.loading_messages && active_conversation.state.pages > 0 && active_conversation.state.page > 0 && active_conversation.state.page < active_conversation.state.pages) {
										let pagination = active_conversation.state.pagination > 0 ? active_conversation.state.pagination : 20;
										let nextPage = active_conversation.state.page + 1;
										let nextQuery = JSON.isJSON(active_conversation.state.query) ? active_conversation.state.query : {};
										fetchMessages(active_conversation, pagination, nextPage, nextQuery);
									}
								}
							}
						} }
						onYReachEnd={ (element) => {
							if (element) {
								if (active_conversation.state) {
									if (!active_conversation.state.loading_messages && active_conversation.state.pages > 0 && active_conversation.state.page > 1) {
										let pagination = active_conversation.state.pagination > 0 ? active_conversation.state.pagination : 20;
										let nextPage = active_conversation.state.page - 1;
										let nextQuery = JSON.isJSON(active_conversation.state.query) ? active_conversation.state.query : {};
										fetchMessages(active_conversation, pagination, nextPage, nextQuery);
									}
								}
								//
							}

						} }
						ref={ messagesWrapperRef }
					>
						<GridContainer className="px-4 relative">
							{ active_conversation.state && active_conversation.state.loading_messages && <div
								style={ {
									position: "absolute",
									left: "50%",
									WebkitTransform: "translateX(-50%)",
									MsTransform: "translateX(-50%)",
									transform: "translateX(-50%)",
									padding: theme.spacing(),
									background: theme.palette.surface,
									width: theme.spacing(3),
									height: theme.spacing(3),
									borderRadius: theme.spacing(1.5)
								} }
							>

							</div> }
							{ active_conversation_messages.map((activeChatMessage, cursor) => {
								let message_deleted = false;
								let show_message = true;
								if (active_conversation_messages[cursor]._id) {
									if (cursor > 0) {
										if (active_conversation_messages[cursor]._id === active_conversation_messages[(cursor - 1)]._id || (activeChatMessage.conversation._id !== active_conversation._id && activeChatMessage.conversation !== active_conversation._id)) {
											show_message = false;
										}
									}
									else {
										show_message = (activeChatMessage.conversation._id === active_conversation._id || activeChatMessage.conversation === active_conversation._id);
									}
								}
								else {
									show_message = (activeChatMessage.conversation._id === active_conversation._id || activeChatMessage.conversation === active_conversation._id);
								}

								/*if (cursor === (active_conversation_messages.length - 1)) {
									
								}*/

								if (activeChatMessage && show_message) {
									if ((activeChatMessage.state === "deleted-for-sender" && (activeChatMessage.sender === auth.user._id || activeChatMessage.sender._id === auth.user._id)) || activeChatMessage.state === "deleted-for-all") {
										message_deleted = true;
									}
									return (
										<GridItem
											xs={ 12 }
											className={ "flex p-0 py-1 " + (activeChatMessage.sender._id === auth.user._id || activeChatMessage.sender === auth.user._id ? "flex-row-reverse" : "flex-row") }
											id={ "message-" + activeChatMessage._id }
											key={ "conversation-" + active_conversation._id + "-message-" + cursor }
										>
											{/* activeChatMessage.sender.avatar && <Avatar className={classes?.contactAvatar} src={ApiService.getAttachmentFileUrl(activeChatMessage.sender.avatar)} />}
											{!activeChatMessage.sender.avatar && <Avatar className={classes?.contactAvatar}>
												<PersonIcon />
											</Avatar> */}

											<ViewPortSensor
												className={ "p-2 mx-4  flex flex-col px-4 " + (activeChatMessage.sender._id === auth.user._id || activeChatMessage.sender === auth.user._id ? ("bg-green-200 " + classes?.chatBubbleLocal) : ("bg-white " + classes?.chatBubbleExternal)) }
												onViewportVisibilityChange={ (inViewport) => {
													if (inViewport) {
														if (activeChatMessage.sender._id !== auth.user._id && activeChatMessage.sender !== auth.user._id) {
															if (activeChatMessage.state === "sent") {
																Sockets.emit("mark-message-as-received", { message: activeChatMessage, user: auth.user });
															}
															else if ((activeChatMessage.state === "received" || activeChatMessage.state === "partially-received")) {
																Sockets.emit("mark-message-as-read", { message: activeChatMessage, user: auth.user });
															}
														}
													}

												} }
											>
												{ !message_deleted && <div className={ active_conversation.type !== "individual" ? "flex flex-row w-full items-center" : "flex flex-row-reverse w-full items-center" }>
													{ (active_conversation.type !== "individual" && JSON.isJSON(activeChatMessage.sender)) && <Typography variant="body1" className={ "flex-grow text-gray-500 font-bold" }>
														{ activeChatMessage.sender.first_name + " " + activeChatMessage.sender.last_name }
													</Typography> }
													<IconButton aria-label="Toggle Menu" onClick={ handleContextOpen("message", activeChatMessage) } className={ "" } size="small">
														<ExpandMoreIcon fontSize="inherit" />
													</IconButton>
												</div> }
												{ (!message_deleted && ["audio", "file", "video", "image"].includes(activeChatMessage.type) && Array.isArray(activeChatMessage.attachments)) && <div className={ "flex flex-col items-center cursor-pointer mb-2" }>
													{ activeChatMessage.attachments.map((attachment, cursor) => (
														<div className={ "p-2 w-11/12 border border-gray-400 rounded" } key={ "attachment-" + cursor }>
															{ activeChatMessage.type === "image" && <LazyImage
																className={ "w-full h-auto" }
																src={ ApiService.getAttachmentFileUrl(attachment) }
																alt={ attachment.name }
																onClick={ e => {
																	e.preventDefault();
																	let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank");
																	win.focus();
																} }
															/> }
															{ activeChatMessage.type === "audio" && <div
																className={ "w-full h-auto flex flex-row items-center" }
																onClick={ e => {
																	e.preventDefault();
																	let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank");
																	win.focus();
																} }
															>
																<AudiotrackOutlinedIcon className={ "text-2xl" } />
																<Typography variant="body1" color="textPrimary" className={ "flex-grow truncate" }>
																	{ attachment.name }
																</Typography>
															</div> }
															{ activeChatMessage.type === "video" && <div
																className={ "w-full h-auto flex flex-row items-center" }
																onClick={ e => {
																	e.preventDefault();
																	let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank");
																	win.focus();
																} }
															>
																<MovieOutlinedIcon className={ "text-2xl" } />
																<Typography variant="body1" color="textPrimary" className={ "flex-grow truncate" } >
																	{ attachment.name }
																</Typography>
															</div> }
															{ activeChatMessage.type === "file" && <div
																className={ "w-full h-auto flex flex-row items-center" }
																onClick={ e => {
																	e.preventDefault();
																	let win = window.open(ApiService.getAttachmentFileUrl(attachment), "_blank");
																	win.focus();
																} }
															>
																<AttachFileIcon className={ "text-2xl" } />
																<Typography variant="body1" color="textPrimary" className={ "flex-grow truncate" } >
																	{ attachment.name }
																</Typography>
															</div> }

														</div>
													)) }
												</div> }
												{ !message_deleted && <Typography variant="body1" color="textPrimary" className={ "flex-grow" } paragraph>
													{ activeChatMessage.content }
												</Typography> }

												{ message_deleted && <div className={ "flex flex-row items-center w-full" } style={ { color: theme.palette.divider } }>
													<Typography variant="body1" color="inherit" className={ "flex-grow" }>
														Message deleted
													</Typography>
													<BlockIcon className={ "mx-2" } fontSize="small" />
												</div> }

												{ !message_deleted && <div className={ "flex flex-row items-center text-sm w-full" } style={ { color: theme.palette.text.disabled } }>
													{ activeChatMessage.created_on && <Typography className={ "text-xs flex-grow" }>
														{ activeChatMessage.created_on instanceof Date ? activeChatMessage.created_on.toLocaleString() : new Date(activeChatMessage.created_on).toLocaleString() }
													</Typography> }
													{ (activeChatMessage.state === "pending" && (activeChatMessage.sender._id === auth.user._id || activeChatMessage.sender === auth.user._id)) && <ScheduleIcon className={ "mx-2 text-xs" } fontSize="small" /> }
													{ (activeChatMessage.state === "sent" && (activeChatMessage.sender._id === auth.user._id || activeChatMessage.sender === auth.user._id)) && <DoneIcon className={ "mx-2 text-xs" } fontSize="small" /> }
													{ ((activeChatMessage.state === "partially-received" || activeChatMessage.state === "received") && (activeChatMessage.sender._id === auth.user._id || activeChatMessage.sender === auth.user._id)) && <DoneAllIcon className={ "mx-2 text-xs" } fontSize="small" /> }
													{ ((activeChatMessage.state === "partially-read" || activeChatMessage.state === "read") && (activeChatMessage.sender._id === auth.user._id || activeChatMessage.sender === auth.user._id)) && <DoneAllIcon className={ "mx-2 text-xs" } color={ "secondary" } fontSize="small" /> }
												</div> }
											</ViewPortSensor>
										</GridItem>
									);
								}

							}) }

							{ (Array.isArray(active_conversation.typing) ? (active_conversation.typing.length > 0) : false) && <GridItem xs={ 12 } className={ "flex p-0 py-1 flex-row" } >
								<div className={ classes?.avatar }> </div>
								<div className={ "p-2 mx-4  flex flex-col px-4  rounded-full" }>
									<div className={ classes?.typing_loader }></div>
								</div>
							</GridItem> }
							<div ref={ conversationBottomRef } />
						</GridContainer>
					</ScrollBars> }



					{ (auth.user.isAdmin || (contactactable_contacts_ids.includes(active_conversation.owner) || contactactable_contacts_ids.includes(active_conversation.owner._id) || contactactable_contacts_ids.includes(active_conversation.owner) || contactactable_contacts_ids.includes(active_conversation.recipients[0])) || active_conversation.type !== "individual") && <GridContainer
						className={ ["audio", "file", "video", "image"].includes(draft.type) ? "flex-grow flex flex-col" : classes?.chatInputsWrapper }
						style={ { backgroundColor: theme.palette.background.paper, top: ["audio", "file", "video", "image"].includes(draft.type) ? 0 : "auto" } }
					>
						{ draft.reply_for && <GridItem xs={ 12 } className={ "flex flex-row items-center bg-green-200" }>
							<div className={ "p-2 mx-4" }>
								<Typography variant="body1" color="textPrimary" className={ "font-bold" }>
									{ draft.reply_for.sender.first_name + " " + draft.reply_for.sender.last_name }
								</Typography>
								<Typography variant="body1" color="textPrimary" className={ "" } >
									{ draft.reply_for.content }
								</Typography>
							</div>
						</GridItem> }

						{ ["audio", "file", "video", "image"].includes(draft.type) && <GridItem xs={ 12 } className={ "flex flex-grow flex-row items-center bg-grey-200" }>
							<FileInput
								variant="outlined"
								value={ (["audio", "file", "video", "image"].includes(draft.type) && (Array.isArray(draft.attachments) ? (draft.attachments > 0) : false)) ? draft.attachments[0] : undefined }
								onChange={ (newValue) => {
									setDraft(currentDraft => {
										try {
											let newDraft = JSON.parse(JSON.stringify(currentDraft));
											if (newValue) {
												newDraft.attachments = [newValue];
											}
											else {
												delete newDraft.attachments;
											}
											return newDraft;
										} catch (err) {
											return currentDraft;
										}
									})
								} }
								filesLimit={ 1 }
								acceptedFiles={ draft.type === "file" ? ["image/*", "video/*", "audio/*", "application/*"] : [(draft.type + "/*")] }
							/>
						</GridItem> }

						{ attachmentDialOpen && <GridItem xs={ 12 } className={ "flex flex-row items-center justify-evenly bg-grey-200" }>
							{ attachmentActions.map((action) => (
								<Fab
									key={ action.name }
									color={ action.color }
									aria-label={ "Attach " + action.label }
									onClick={ () => {
										setAttachmentDialOpen(false);
										handleOnChangeDraftType(action.name);
									} }
									style={ { background: action.color, color: theme.palette.background.paper } }
									className={ "mx-2" }
								>
									{ action.icon }
								</Fab>
							)) }
						</GridItem> }

						<GridItem xs={ 12 } className={ "flex flex-row items-center" }>

							<IconButton
								onClick={ (event) => {
									setAttachmentDialOpen(!attachmentDialOpen)
								} }
								aria-label={ attachmentDialOpen ? ((["audio", "file", "video", "image"].includes(draft.type) && (Array.isArray(draft.attachments) ? (draft.attachments > 0) : false)) ? "Remove Attachments" : "Dismiss File Attachment") : "Close File Attachment" }
								className={ "mx-2" }
							>
								{ !attachmentDialOpen ? <AttachFileIcon color="inherit" /> : ((["audio", "file", "video", "image"].includes(draft.type) && (Array.isArray(draft.attachments) ? (draft.attachments > 0) : false)) ? <DeleteOutlinedIcon color="inherit" /> : <CloseIcon color="inherit" />) }
							</IconButton>
							<div className={ "flex-grow rounded-full mx-8" }>
								<TextInput
									variant={ ["audio", "file", "video", "image"].includes(draft.type) ? "standard" : "outlined" }
									multiline
									rows={ 2 }
									onBlur={ (new_value, event) => {
										if (active_conversation._id && !String.isEmpty(new_value)) {
											setDraft(currentDraft => {
												try {
													let newDraft = {
														content: new_value,
														conversation: active_conversation._id,
													}
													if (JSON.isJSON(currentDraft)) {
														newDraft = JSON.parse(JSON.stringify(currentDraft));
														newDraft.content = new_value;
														newDraft.conversation = active_conversation._id;
													}
													return newDraft;

												} catch (err) {
													return currentDraft;
												}
											});

										}
										if (active_conversation._id) {
											Sockets.emit("stopped-typing-message", { conversation: active_conversation._id, user: auth.user });
										}
									} }
									onFocus={ () => {
										if (active_conversation._id) {
											Sockets.emit("started-typing-message", { conversation: active_conversation._id, user: auth.user });
										}
									} }
									defaultValue={ active_conversation._id === draft.conversation ? draft.content : undefined }
									onChange={ (new_value) => {

									} }
									placeholder="Type your message here..."
									inputRef={ textInputRef }
									inputProps={ {
										onKeyDown: handleMessageInputKeyDown(active_conversation),
									} }
								/>
							</div>
							{/*<IconButton onClick={(event)=>handleOnSendMessage()} aria-label="send" className={"primary-text"} >
															<SendIcon color="inherit" />
														</IconButton>*/}
						</GridItem>
					</GridContainer> }

				</GridItem>
			</Paper> }


			<Menu
				keepMounted
				open={ contextMenu.mouseY !== null }
				onClose={ handleContextClose }
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu.mouseY !== null && contextMenu.mouseX !== null
						? { top: contextMenu.mouseY, left: contextMenu.mouseX }
						: undefined
				}
			>
				{ contextMenu.type === "conversation" && <MenuItem onClick={ (event) => {
					//setMessagingCache("active_conversation", contextMenu.entry);
					setActiveConversation(contextMenu.entry);
					handleContextClose(event);
				} }>Open Conversation</MenuItem> }
				{ contextMenu.type === "conversation" && <MenuItem
					onClick={ (event) => {
						handleArchiveConversation(contextMenu.entry);
						handleContextClose(event);
					} }
				>
					Archive Conversation
				</MenuItem> }
				{ contextMenu.type === "conversation" && <MenuItem
					onClick={ (event) => {
						handleDeleteConversation(contextMenu.entry);
						handleContextClose(event);
					} }
				>
					Delete Conversation
				</MenuItem> }

				{ (contextMenu.type === "message" && (contextMenu.entry.sender._id !== auth.user._id && contextMenu.entry.sender !== auth.user._id)) && <MenuItem
					onClick={ (event) => {
						handleContextClose(event);
						setDraft({
							is_reply: true,
							sender: auth.user,
							reply_for: contextMenu.entry,
							content: "",
							conversation: active_conversation._id,
						});
						if (textInputRef.current) {
							textInputRef.current.value = "";
							textInputRef.current.focus();
						}


					} }
				>
					Reply Message
				</MenuItem> }
				{ (contextMenu.type === "message" && (contextMenu.entry.sender._id === auth.user._id || contextMenu.entry.sender === auth.user._id)) && <MenuItem
					onClick={ (event) => {
						handleContextClose(event);
						updateMessage({ ...contextMenu.entry, state: "deleted-for-sender", deletions: (Array.isArray(contextMenu.entry.deletions) ? contextMenu.entry.deletions.concat([auth.user._id]) : [auth.user._id]) });
						Sockets.emit("delete-message-for-user", { message: contextMenu.entry, user: auth.user });
					} }
				>
					Delete For Me
				</MenuItem> }

				{ (contextMenu.type === "message" && (contextMenu.entry.sender._id === auth.user._id || contextMenu.entry.sender === auth.user._id)) && <MenuItem
					onClick={ (event) => {
						handleContextClose(event);

						updateMessage({ ...contextMenu.entry, state: "deleted-for-all", deletions: active_conversation.recipients.concat([active_conversation.owner]) });
						Sockets.emit("delete-message-for-all", { message: contextMenu.entry, user: auth.user });
					} }
				>
					Delete For All
				</MenuItem> }
			</Menu>

			{ error && <Snackbar open={ Boolean(error) } autoHideDuration={ 10000 } onClose={ () => setError(false) }>
				<Alert onClose={ () => setError(false) } severity="error">
					{ error }
				</Alert>
			</Snackbar> }

		</Paper>
	);
}



const mapStateToProps = state => ({
	auth: state.auth,
	communication: state.communication,
	device: state.device,
});

Chat.defaultProps = {
	layout: "full",
	firstView: "conversations",
	activeConversation: undefined,
};

export default compose(

	connect(mapStateToProps, { apiCallRequest, setMessagingCache, setActiveConversation, sendMessage, fetchMessages, updateMessage, fetchContacts, fetchInbox, createConversation }),
	withTheme,
)((Chat));
