/** @format */

import React, {memo, useState, useEffect, useCallback, useRef} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "@material-ui/core/Badge";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import ContactsIcon from '@material-ui/icons/Contacts';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SendIcon from '@material-ui/icons/Send';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Backdrop from '@material-ui/core/Backdrop';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import ForumIcon from '@material-ui/icons/Forum';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import MovieOutlinedIcon from '@material-ui/icons/MovieOutlined';
import AudiotrackOutlinedIcon from '@material-ui/icons/AudiotrackOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import BlockIcon from '@material-ui/icons/Block';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Fab from '@material-ui/core/Fab';
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ScrollBars from "components/ScrollBars";
import LazyImage from "components/LazyImage";
import ViewPortSensor from "components/ViewPortSensor";
import Listings from "views/widgets/Listings";
import {
	FileInput,
	TextInput,
} from "components/FormInputs";

import { useGlobals } from "contexts/Globals";
import { app } from "assets/jss/app-theme.jsx";
import { useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import compose from "recompose/compose";
import { apiCallRequest, setMessagingCache, clearMessagingCache } from "state/actions";

import { attachments as AttachmentsService } from "services";

import styles from "./styles";

const contactsDrawerWidth = 240;

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Chat(props) {
	const { classes, className, layout, communication:{ messaging }, activeConversation, auth, device: {window_size}, apiCallRequest, theme, setMessagingCache, clearMessagingCache, ...rest } = props;
	let textInputRef = React.createRef();
	let messagesWrapperRef = React.createRef();
	let location = useLocation();
	let history = useHistory();

	
	

	const { definations, services, sockets } = useGlobals();
	const { unread_count, unread_ids, conversations, contacts: cacheContacts, drafts, active_conversation, active_conversation_messages } = messaging;

	const [chats, setChats] = useState(Array.isArray(conversations)? conversations : []);
	const [activeChat, setActiveChat] = useState(active_conversation);
	const [activeChatMessages, setActiveChatMessages] = useState(active_conversation_messages);
	const [query, setQuery] = useState({desc: "created_on"});
	const [contactsQuery, setContactsQuery] = useState({desc: "created_on"});
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [loadingContacts, setLoadingContacts] = useState(true);
	const [draft, setDraft] = useState({});
	const [individualConversationsRecipients, setIndividualConversationsRecipients] = useState([]);
	const [error, setError] = useState(false);
	const [contacts, setContacts] = useState([]);
	const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
	const [attachmentDialOpen, setAttachmentDialOpen] = useState(false);
	const [contextMenu, setContextMenu] = useState({ mouseX: null, mouseY: null,});
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
	

	const gotoLastMessage = () => {
	   let element = document.getElementById("chatLastChild");
	   if (element) {

			//element.scrollIntoView({behavior: "smooth"});
	   }
	   
	}


	const loadConversations = () => {
		if (definations) {
			setLoadingConversations(true);
			apiCallRequest( definations.conversations.name,
					{
						uri: "/inbox",
						type: "records",
						params: {...query, p: "1"},
						data: {},
						cache: false,
					}
			).then(data => {
				if (Array.isArray(data)) {
					setMessagingCache("conversations", data);
				}
				
				setError(false);
				setLoadingConversations(false);					
			}).catch(e => {
				console.log("conversations e", e);
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
						cache: false,
					}
			).then(data => {
				if (Array.isArray(data)) {
					setMessagingCache("contacts", data);
					setContacts(data);
				}
				setError(false);
				setLoadingContacts(false);					
			}).catch(e => {
				console.log("contacts e", e);
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
				setLoadingContacts(false);
			});
		}
	}

	

	const handleContextOpen = (type, entry) => event => {
		event.preventDefault();
		setContextMenu({
		  type : type, 
		  entry: entry,
		  mouseX: event.clientX - 2,
		  mouseY: event.clientY - 4,
		});
	};

	const handleContextClose = () => {
		setContextMenu({ mouseX: null, mouseY: null,});
	};

	const handleArchiveConversation = (conversation) => {
		setMessagingCache("conversations", currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));

				newChats = newChats.filter(chat =>{
					if (conversation) {
						if (JSON.isJSON(conversation)) {
							return chat._id !== conversation._id;
						}
						return chat._id !== conversation;
					}
					return true;	 
				});

				return newChats;
			} catch(err) {
				console.error(err);
				return currentChats;
			}
		});
		sockets.default.emit("archive-conversation", {conversation: conversation, user: auth.user});

	};

	const handleDeleteConversation = (conversation) => {
		setMessagingCache("conversations", currentChats => {
			try {
				let newChats = JSON.parse(JSON.stringify(currentChats));

				newChats = newChats.filter(chat =>{
					if (conversation) {
						if (JSON.isJSON(conversation)) {
							return chat._id !== conversation._id;
						}
						return chat._id !== conversation;
					}
					return true;	 
				});

				return newChats;
			} catch(err) {
				console.error(err);
				return currentChats;
			}
		});

		sockets.default.emit("delete-conversation-for-user", {conversation: conversation, user: auth.user});	

	};



	const handleNewChat = (recipients) => {
		if (recipients) {
			let recipients_ids = [];
			recipients = Array.isArray(recipients)? recipients : [recipients];

			recipients.map(recipient => {
				if (JSON.isJSON(recipient) && "_id" in recipient) {
					recipients_ids.push(recipient._id);
				}
				else if (!String.isEmpty(recipient)) {
					recipients_ids.push(recipient);
				}
			});


			setContactsDrawerOpen(false);
			let existsAtIndex = -1;
			conversations.map((chat, index) => {
				if (existsAtIndex === -1 && chat.type === "individual") {
					let owner_id = chat.owner;
					let recipient_id = chat.recipients[0];
					if (JSON.isJSON(chat.owner) && "_id" in chat.owner) {
						owner_id = chat.owner._id;
					}
					owner_id = owner_id;
					if (JSON.isJSON(chat.recipients[0]) && "_id" in chat.recipients[0]) {
						recipient_id = chat.recipients[0]._id;
					}
					else {
						recipient_id = chat.recipients[0];
					}
					if ((owner_id == auth.user._id && recipients_ids.includes(recipient_id)) || (recipient_id === auth.user._id && recipients_ids.includes(owner_id))) {
						existsAtIndex = index;
					}
				}
			});


			if (existsAtIndex !== -1) {
				let updatedChats = conversations;
				let existingChat = JSON.parse(JSON.stringify(updatedChats[existsAtIndex]));
				updatedChats.remove(existsAtIndex);
				updatedChats.unshift(existingChat);
				getConversationMessages(existingChat);
				setMessagingCache("conversations", updatedChats);
				setMessagingCache("active_conversation_messages", []);	
				setMessagingCache("active_conversation", existingChat);	


				setDraft({
						is_reply: false,
						sender: auth.user,
						reply_for: null,
						type: "text",
						content: "",
						conversation: existingChat._id,
					});
					
				
				
			}
			else {
				let newChat = {
					recipients: recipients_ids,
					participants: recipients,
					state: {
						"total": 0,
						"unread": 0,
						"read": 0,
						"last_message" : {

						}
					},
					owner: auth.user._id,
					started_by: auth.user,
					type: Array.isArray(recipients)? (recipients.length > 1? "group" : "individual") : "individual",
				};

				setMessagingCache("active_conversation_messages", []);

				if (sockets.default) {
					sockets.default.emit("create-conversation", newChat);
				}
				
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
		setMessagingCache("conversations", currentChats => {
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
		setMessagingCache("conversations", currentChats => {
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
							if (!exists && chat_typing_user._id === user_id) {
								exists = true;
							}
							
						});
						if (!exists  && user_id !== auth.user._id) {
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

		setMessagingCache("active_conversation", currentActiveChat => {
			if (currentActiveChat) {
				try {
					let newCurrentActiveChat = JSON.parse(JSON.stringify(currentActiveChat));
					let user_id = user; 
					if (JSON.isJSON(user)) {
						user_id = user._id;
					}
					if (Array.isArray(newCurrentActiveChat.typing)) {
						let typing_users_arr = Array.isArray(newCurrentActiveChat.typing)? newCurrentActiveChat.typing : [];
						let exists = false;
						typing_users_arr.map(chat_typing_user => {
							if (!exists && chat_typing_user._id === user_id) {
								exists = true;
							}
							
						});
						if (!exists && user_id !== auth.user._id) {
							newCurrentActiveChat.typing = typing_users_arr.concat([user]);
						}
					}
					else if (user_id !== auth.user._id) {
						newCurrentActiveChat.typing = [user];
					}
					
					return newCurrentActiveChat;
				} catch(err) {
					console.error(err);
					return currentActiveChat;
				}
			}
			else{
				return false;
			}
			
		});
	}
	

	const handleOnUserStoppedTypingMessage = ({conversation, user}) => {
		setMessagingCache("conversations", currentChats => {
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
						chat.typing = typing_users_arr.filter(chat_typing_user => {
							return chat_typing_user._id !== user_id
						});
						if (!Array.isArray(chat.typing)) {
							chat.typing = []
						}
					}
				});
				return newChats;
			} catch(err) {
				console.error(err);
				return currentChats;
			}
				
			
		});
		setMessagingCache("active_conversation", currentActiveChat => {
			if (currentActiveChat) {
				let user_id = user; 
				if (JSON.isJSON(user)) {
					user_id = user._id;
				}
				let chat_id = conversation;
				if (JSON.isJSON(conversation)) {
					chat_id = conversation._id;
				}
				if (chat_id === currentActiveChat._id) {
					try {
						let newCurrentActiveChat = JSON.parse(JSON.stringify(currentActiveChat));

						let typing_users_arr = Array.isArray(newCurrentActiveChat.typing)? newCurrentActiveChat.typing : [];
						newCurrentActiveChat.typing = typing_users_arr.filter(chat_typing_user => {
							return chat_typing_user._id !== user_id
						});
						if (!Array.isArray(newCurrentActiveChat.typing)) {
							newCurrentActiveChat.typing = []
						}
						
						return newCurrentActiveChat;
					} catch(err) {
						console.error(err);
						return currentActiveChat;
					}
						
				}
				else {
					return currentActiveChat;
				}

					
			}
			else{
				return false;
			}
			
		});
	}

	

	
	




	/*const handleOnNewMessage = ({conversation, message, user}) => {	
		console.log("handleOnNewMessage", message)	
		setActiveChatMessages(currentChatMessages => {
						try {
							let newChatMessages = JSON.parse(JSON.stringify(currentChatMessages));

							newChatMessages.push(message);
							return newChatMessages;
						} catch(err) {
							console.error(err);
							return currentChatMessages;
						}
		});
		setMessagingCache("active_conversation", currentActiveChat => {
			if (currentActiveChat) {
				let conversation_id = conversation;
				if (JSON.isJSON(conversation)) {
					conversation_id = conversation._id;
				}
				if (conversation_id === currentActiveChat._id) {
					
				}
			}
			return currentActiveChat;
		});	
				
	}

	const handleOnMessageSent = ({conversation, message, user}) => {	
		console.log("handleOnMessageSent", message)	
		setMessagingCache("active_conversation", currentActiveChat => {
			if (currentActiveChat) {
				let conversation_id = conversation;
				if (JSON.isJSON(conversation)) {
					conversation_id = conversation._id;
				}
				let message_id = message;
				if (JSON.isJSON(message)) {
					message_id = message._id;
				}
				if (conversation_id === currentActiveChat._id) {
					setActiveChatMessages(currentChatMessages => {
						try {
							let newChatMessages = JSON.parse(JSON.stringify(currentChatMessages));

							newChatMessages.push(message);
							return newChatMessages;
						} catch(err) {
							console.error(err);
							return currentChatMessages;
						}
					});
					
					
				}
			}
			return currentActiveChat;
		});
		
	}*/

	const handleOnChangeDraftType= (type) => {
		setDraft(currentDraft => {
			try {
				let newDraft = JSON.parse(JSON.stringify(currentDraft));
				newDraft.type = type;					
				return newDraft;
			} catch(err) {
				console.error(err);
				return currentDraft;
			}
		});
	}

	const handleOnConversationMessages = ({conversation, messages}) => {
		setLoadingActiveChatMessages(false);
		setMessagingCache("active_conversation_messages", messages);
	}

	const handleOnConversationCreated = (conversation) => {
		
	}

	

	const getConversationMessages = (conversation) => {
		if (conversation) {
			setLoadingActiveChatMessages(true);
			setMessagingCache("active_conversation_messages", []);	
			if (sockets.default) {
				sockets.default.emit("get-conversation-messages", {conversation: conversation._id, user: auth.user});
			}
		}
		else {
			setLoadingActiveChatMessages(false);
		}				
	}

	const handleOnSendMessage = (messageToSend) => {
		if (active_conversation) {
			let newMessage = { ...draft, sender: auth.user, created_on: new Date()};
			if (messageToSend) {			
				if (JSON.isJSON(messageToSend)) {
					newMessage = JSON.merge(messageToSend, newMessage);
				}
				else if (String.isString(messageToSend)) {
					newMessage.content = messageToSend.trim();				
				}
			}

			if (!String.isEmpty(newMessage.content) || (["audio", "file", "video", "image"].includes(newMessage.type) && (Array.isArray(newMessage.attachments)? (newMessage.attachments.length > 0) : false))) {
					sockets.default.emit("send-message", {message: newMessage, conversation: active_conversation, user: auth.user});
										if (textInputRef.current) {
											textInputRef.current.value = "";
											textInputRef.current.focus();
										}
										
										setDraft({
											is_reply: false,
											sender: auth.user,
											reply_for: null,
											type: "text",
											content: "",
											conversation: active_conversation._id,
										});
				
			}
		}
			
			
				
	}

	const handleMessageInputKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			let newMessageValue = event.target.value;
			if (String.isString(newMessageValue)) {
				newMessageValue = newMessageValue.trim();
			}
			else {
				newMessageValue = "";
			}
			if (!String.isEmpty(newMessageValue)) {
				sockets.default.emit("stopped-typing-message", {conversation: active_conversation._id, user: auth.user});
				handleOnSendMessage(newMessageValue);
			}
				
		}
	}

	const handleSocketActionError = (error) => {
		setError(error);
	}

	const handleOnMessageDeletedForUser = ({ message, user }) => {
		setMessagingCache("active_conversation_messages", currentActiveChatMessages =>{
			try {
				let newActiveChatMessages = JSON.parse(JSON.stringify(currentActiveChatMessages));
				if (Array.isArray(newActiveChatMessages)) {
					newActiveChatMessages.forEach(activeChatMessage => {
						if (activeChatMessage._id === message._id) {
							activeChatMessage.state = message.state;
						}
					});
				}
									
				return newActiveChatMessages;
			} catch(err) {
				console.error(err);
				return currentActiveChatMessages;
			}
		});
	}

	const handleOnMessageDeletedForAll = ({ message, user }) => {
		setMessagingCache("active_conversation_messages", currentActiveChatMessages =>{
			try {
				let newActiveChatMessages = JSON.parse(JSON.stringify(currentActiveChatMessages));
				if (Array.isArray(newActiveChatMessages)) {
					newActiveChatMessages.forEach(activeChatMessage => {
						if (activeChatMessage._id === message._id) {
							activeChatMessage.state = message.state;
						}
					});
				}
									
				return newActiveChatMessages;
			} catch(err) {
				console.error(err);
				return currentActiveChatMessages;
			}
		});
	}

	const handleOnMessageStateChangedBySocketAction = ({ message, user }) => {
		setMessagingCache("active_conversation_messages", currentActiveChatMessages =>{
			try {
				let newActiveChatMessages = JSON.parse(JSON.stringify(currentActiveChatMessages));
				if (Array.isArray(newActiveChatMessages)) {
					newActiveChatMessages.forEach(activeChatMessage => {
						if (activeChatMessage._id === message._id) {
							activeChatMessage.state = message.state;
						}
					});
				}				
				return newActiveChatMessages;
			} catch(err) {
				console.error(err);
				return currentActiveChatMessages;
			}
		});
	}
	


	useEffect(() => {
		setChats(conversations);
	}, [conversations]);

	useEffect(() => {
		if (active_conversation && firstLoad) {
			getConversationMessages(active_conversation);
			setFirstLoad(false);			
		}

			
	}, [active_conversation, firstLoad]);

	/*useEffect(() => {

		return () => {
			if (!activeChat) {
				setMessagingCache("active_conversation", false);	
				
			}
			else {
				try {
					let newActiveChat = JSON.parse(JSON.stringify(activeChat));
					newActiveChat.typing = [];
					setMessagingCache("active_conversation", newActiveChat);
				} catch(err) {
					console.error(err);
				}
				
			}
		}
		
	}, [activeChat]);*/


	useEffect(()=>{
		if (location && !locationHasWith) {
			let params = new URLSearchParams(location.search);
			const withRecipient = params.get('with');
			console.log("location withRecipient", withRecipient);	
			if (!String.isEmpty(withRecipient)) {
				if (withRecipient.indexOf("@") !== -1) {
					setContactsQuery({email_address: withRecipient.trim()});
				}
				else {
					setContactsQuery({_id: withRecipient.trim()});
				}				
				setLocationHasWith(true);
				
			}
		}
	}, [location, locationHasWith]);

	useEffect(() => {			
		console.log("contactsQuery", contactsQuery);
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
							else{
								newIndividualConversationsRecipients.push(chat.recipients[0]);
							}
						}
					}
				}
			});
			setIndividualConversationsRecipients(newIndividualConversationsRecipients);
		}			
	}, [conversations]);

	useEffect(() => {
		//loadContacts();
		loadConversations();
	}, [definations, query]);



	useEffect(() => {
		if (sockets.default) {
			sockets.default.on("presence-changed", handlePresenceChanged);
			sockets.default.on("user-changed-presence", handlePresenceChanged);
			sockets.default.on("message-typing-started", handleOnUserStartedTypingMessage);
			sockets.default.on("message-typing-stopped", handleOnUserStoppedTypingMessage);
			sockets.default.on("conversation-messages", handleOnConversationMessages);
			/*sockets.default.on("new-message", handleOnNewMessage);
			sockets.default.on("message-sent", handleOnMessageSent);*/
			sockets.default.on("messages-deleted-for-user", handleOnMessageDeletedForUser);
			sockets.default.on("messages-deleted-for-all", handleOnMessageDeletedForAll);
			sockets.default.on("message-marked-as-received", handleOnMessageStateChangedBySocketAction);
			sockets.default.on("message-received", handleOnMessageStateChangedBySocketAction);
			sockets.default.on("message-marked-as-read", handleOnMessageStateChangedBySocketAction);
			sockets.default.on("message-read", handleOnMessageStateChangedBySocketAction);
			sockets.default.on("delete-conversation-for-user-error", handleSocketActionError);
			sockets.default.on("delete-message-for-user-error", handleSocketActionError);
			sockets.default.on("delete-message-for-all-error", handleSocketActionError);
			
			
			
			

			return ()=>{
				sockets.default.off("presence-changed", handlePresenceChanged);
				sockets.default.off("user-changed-presence", handlePresenceChanged);
				sockets.default.off("message-typing-started", handleOnUserStartedTypingMessage);
				sockets.default.off("message-typing-stopped", handleOnUserStoppedTypingMessage);
				sockets.default.off("conversation-messages", handleOnConversationMessages);
				/*sockets.default.off("new-message", handleOnNewMessage);
				sockets.default.off("message-sent", handleOnMessageSent);*/
				sockets.default.off("messages-deleted-for-user", handleOnMessageDeletedForUser);
				sockets.default.off("messages-deleted-for-all", handleOnMessageDeletedForAll);
				sockets.default.off("delete-conversation-for-user-error", handleSocketActionError);
				sockets.default.off("message-marked-as-received", handleOnMessageStateChangedBySocketAction);
				sockets.default.off("message-received", handleOnMessageStateChangedBySocketAction);
				sockets.default.off("message-marked-as-read", handleOnMessageStateChangedBySocketAction);
				sockets.default.off("message-read", handleOnMessageStateChangedBySocketAction);
				sockets.default.off("delete-message-for-user-error", handleSocketActionError);
				sockets.default.off("delete-message-for-all-error", handleSocketActionError);
				sockets.default.off("create-conversation-error", handleSocketActionError);
			}
		}
	}, [sockets]);


	
	return (
		<Paper className={classNames({"p-0 m-0 relative": true, [classes.root] : true, [className]: true})} >
			<AppBar position="absolute" color="transparent" className={classes.mainAppBar}>
				<Toolbar>
					{active_conversation && <IconButton 
						onClick={()=>{
							if (history && locationHasWith) {
								history.push(history.location.pathname);
							}
							setMessagingCache("active_conversation_messages", []);
							setMessagingCache("active_conversation", false);
							
						}}
						className={"mr-2"}
						edge="start" 
						color="inherit" 
						aria-label="back-to-conversations"
					>
						<ArrowBackIcon />
					</IconButton>}
					{active_conversation && (active_conversation.type == "individual"? ((auth.user._id === active_conversation.owner._id || auth.user._id === active_conversation.owner) && active_conversation.participants[0].avatar? (<Avatar className={"mr-6 w-6 h-6"} src={AttachmentsService.getAttachmentFileUrl(active_conversation.participants[0].avatar)} />) : (active_conversation.started_by.avatar? (<Avatar className={"mr-6 w-6 h-6"} src={AttachmentsService.getAttachmentFileUrl(active_conversation.started_by.avatar)} />) : (<Avatar className={"mr-2 w-6 h-6 bg-transparent accent-text"}><PersonIcon /></Avatar>))) : (active_conversation.group_avatar? (<Avatar className={"mr-6"} src={AttachmentsService.getAttachmentFileUrl(active_conversation.group_avatar)} />) : (<Avatar className={"mr-6 w-6 h-6 bg-transparent accent-text"}> {active_conversation.type === "group"? <PeopleIcon /> : <PersonIcon />}</Avatar>)))}
					{active_conversation && <Typography variant="h6" className={"capitalize flex-grow"}>
						{active_conversation.type == "individual"? ((auth.user._id === active_conversation.owner._id || auth.user._id === active_conversation.owner)? (active_conversation.participants[0].first_name +" "+active_conversation.participants[0].last_name) : (active_conversation.started_by.first_name +" "+active_conversation.started_by.last_name)) : (active_conversation.type == "group"? active_conversation.group_name : "Realfield")}
					</Typography>}

					{!active_conversation && <Typography variant="h6" className={"capitalize flex-grow"}>
						Conversations
					</Typography>}


					{(!active_conversation && !contactsDrawerOpen) && <IconButton 
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
				variant={window_size.width >= 768? "persistent" : "temporary" }
				anchor="right"
				open={contactsDrawerOpen}
				onClose={()=>setContactsDrawerOpen(false)}
				onOpen={()=>setContactsDrawerOpen(true)}
				classes={{
					paper: window_size.width >= 768? classes.drawerPaper : classes.temporaryDrawerPaper,
				}}
			>
				<div className={"w-full flex flex-row items-center h-16 secondary"}>
					<IconButton className={"mx-2"} color="inherit">
						<ContactsIcon />
					</IconButton>
					<Typography variant="h6" className={"capitalize flex-grow"}>
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

					<IconButton className={"mx-2"} color="inherit" onClick={()=>setContactsDrawerOpen(false)}>
						{theme.direction === 'ltr' ?  <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
				<Divider />

				<ScrollBars className={classes.bodyWrapper}>
					

							{definations && <Listings
								show_actions={false}
								show_links={false}
								showViewOptions={false}
								showAddBtn={false}
								cache_data={false}
								showPagination
								showSorter
								defination={definations.users}
								service={services.users}
								query={contactsQuery}
								view={"listview"}
								onClickEntry={(contact) => handleNewChat(contact)}
								onLoadData={(loadedData, loadedQuery) => {
									if (locationHasWith && Array.isArray(loadedData)) {
										loadedData.map(entry => {
											if (entry._id === loadedQuery._id || entry.email_address === loadedQuery.email_address) {
												handleNewChat(entry);
												console.log("onLoadData", loadedData, loadedQuery);
											}
										})
									}
									
								}}
							/>}


				</ScrollBars>
			</SwipeableDrawer>
			{!active_conversation && <GridItem md={12} className={"flex flex-col relative min-h-full p-0"}>					
						<Paper square className={classes.paper}>
							<ScrollBars className={classes.bodyWrapper}>
							{(loadingConversations && (!Array.isArray(conversations) || (Array.isArray(conversations) && conversations.length === 0))) && <GridContainer>
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

							{(!loadingConversations && (!Array.isArray(conversations) || (Array.isArray(conversations) && chats.length === 0))) && <GridContainer>
								<GridItem md={12} className={"flex flex-col items-center relative p-0 px-4 my-4"}>
									<Typography variant="subtitle1" color="textSecondary" className="mx-0 my-12 h-20 w-20 md:w-40  md:h-40 rounded-full text-4xl md:text-6xl flex flex-row items-center justify-center" style={{color: theme.palette.text.disabled, background: theme.palette.background.default}}>
										<ForumOutlinedIcon fontSize="inherit"/>
									</Typography>
									<Typography variant="body2" color="textSecondary" className="mx-0" style={{color: theme.palette.text.disabled}}>
										You don't have any active conversations yet
									</Typography>
								</GridItem>
							</GridContainer>}

							{(Array.isArray(conversations) && !loadingConversations) && <List className={classes.list}>
							{conversations.map((chat, index)=> {

								if (index === 0 || (index > 0 && conversations[index-1]._id !== conversations[index]._id )) {
									let primaryText = "";
									let chatUser = false;
									let avatar = false;
									let last_message_content = false;
									let last_message_deleted = false;
									let last_message_sender_name = false;
									if (chat.state.total > 0 && chat.state.last_message) {
										last_message_content = chat.state.last_message.content;
										if (chat.state.last_message.sender === auth.user._id) {
											last_message_sender_name = "You";
										}
										else if (chat.owner === chat.state.last_message.sender) {
											last_message_sender_name = chat.started_by.first_name;
										}
										else{
											if (Array.isArray(chat.participants)) {
												chat.participants.map(participant => {
													if (participant._id === chat.state.last_message.sender) {
														last_message_sender_name = participant.first_name;
													}
												});
											}											
										}
										if ((chat.state.last_message.state === "deleted-for-sender" && chat.state.last_message.sender._id === auth.user._id) || chat.state.last_message.state === "deleted-for-all") {
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
													primaryText = chat.participants[0].first_name +" "+chat.participants[0].last_name
													avatar = chat.participants[0].avatar;
												}
											}
													
										}
										else{

											chatUser = chat.started_by;
											primaryText = chat.started_by.first_name +" "+chat.started_by.last_name;
											avatar = chat.started_by.avatar;
										}
									} 
									else if (chat.type == "group") {
										primaryText = chat.group_name;
										avatar = chat.group_avatar;
									}

									return (
										<ListItem 
											className={"px-8 content-between"} 
											onClick={(event)=> {
												setMessagingCache("active_conversation_messages", []);	
												setMessagingCache("active_conversation", chat);	
												getConversationMessages(chat);			
											}}										
											onContextMenu={handleContextOpen("conversation", chat)}
											key={"chat-"+index}
											style={{background: (contextMenu.type==="conversation"? (contextMenu.entry._id===chat._id? theme.palette.background.default : "transparent") : "transparent")}}
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
													<Typography variant="body1" color="textPrimary" className={"capitalize font-bold"}>
														{primaryText}
													</Typography>
												)} 
												secondary={(
													<div className="w-full flex flex-row">
														{Array.isArray(chat.typing) && <Typography variant="body2" color="primary" className="mx-0">
															{chat.typing.length > 1? (chat.typing.length+" people are typing...") : (chat.typing.length === 1? (chat.typing[0].first_name+" is typing...") : "")}
														</Typography>}
														{(!Array.isArray(chat.typing) || chat.typing.length ===0) && <div className="flex flex-row items-center flex-grow">
															<Typography variant="body2" color="textPrimary" className="font-bold mr-2">
																{last_message_sender_name? last_message_sender_name: ""}
															</Typography>
															<Typography variant="body2" color="textSecondary" className="flex-grow truncate mr-2 font-normal">
																{last_message_content? last_message_content : "No messages yet"}
															</Typography>
															{last_message_deleted && <div className={"flex flex-row items-center w-full"} style={{color: theme.palette.divider}}>
																<Typography variant="body1" color="inherit" className={"flex-grow"}>
																	Message deleted
																</Typography>
																<BlockIcon className={"mx-2 text-xs"} fontSize="small"/>
															</div>}

															{!last_message_deleted && <div className={"flex flex-row items-center w-full"} style={{color: theme.palette.text.disabled}}>
																{(chat.state.last_message.state === "sent" && chat.state.last_message.sender === auth.user._id) && <DoneIcon className={"mx-1 text-xs"} fontSize="small"/>}
																{((chat.state.last_message.state === "partially-received" || chat.state.last_message.state === "received") && chat.state.last_message.sender === auth.user._id) && <DoneAllIcon className={"mx-1 text-xs"} fontSize="small"/>}
																{((chat.state.last_message.state === "partially-read" || chat.state.last_message.state === "read") && chat.state.last_message.sender === auth.user._id) && <DoneAllIcon className={"mx-1 text-xs"} color={"secondary"} fontSize="small"/>}
															</div>}
														</div>}
														{(!Array.isArray(chat.typing) || chat.typing.length ===0) && <Typography variant="body2" color="secondary" className="mx-2">
															{/*<DoneAllIcon fontSize="inherit" />*/}
														</Typography>}
													</div>
												)}
											/>
											{chat.state.incoming_unread > 0 && <ListItemSecondaryAction>
												<Avatar className={"bg-transparent primary-text h-4 w-4 text-xs"}>
													{chat.state.incoming_unread}
												</Avatar>
											</ListItemSecondaryAction>}
										</ListItem>
									);
								}
									
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

								{/*<IconButton 
									color="inherit" 
									aria-label="Search"
									edge="end"
									
								>
									<SearchIcon />
								</IconButton>*/}
							</Toolbar>
						</AppBar>
			</GridItem>}

			{active_conversation && <Paper square elevation={0} className={classes.chatPaperWrapper}>
				<GridItem md={12} className="h-full p-0 flex flex-col relative">
					{!["audio", "file", "video", "image"].includes(draft.type) && <ScrollBars 
						className={"flex-grow "+classes.chatScrollWrapper} 
						style={{flex: 10, backgroundColor: theme.palette.background.default}}
						scrollToBottomOnChildChange={false}
						ref={messagesWrapperRef}
					>
						<GridContainer className="px-4">
							{active_conversation_messages.map((activeChatMessage, cursor) =>{
								let message_deleted = false;
								let show_message = true;
								if (cursor > 0) {
									if (active_conversation_messages[cursor]._id === active_conversation_messages[(cursor - 1)]._id || activeChatMessage.conversation._id !== active_conversation._id) {
										show_message = false;
									}
								}
								if (activeChatMessage && show_message) {
									if ((activeChatMessage.state === "deleted-for-sender" && activeChatMessage.sender._id === auth.user._id) || activeChatMessage.state === "deleted-for-all") {
										message_deleted = true;
									}
									return (
										<GridItem 
											xs={12} 
											className={"flex p-0 py-1 "+(activeChatMessage.sender._id === auth.user._id? "flex-row-reverse" : "flex-row")}
											id={"message-"+activeChatMessage._id}
											key={"conversation-"+active_conversation._id+"-message-"+cursor}
										>
											{/* activeChatMessage.sender.avatar && <Avatar className={classes.contactAvatar} src={AttachmentsService.getAttachmentFileUrl(activeChatMessage.sender.avatar)} />}
											{!activeChatMessage.sender.avatar && <Avatar className={classes.contactAvatar}>
												<PersonIcon />
											</Avatar> */}

											<ViewPortSensor  
												className={"p-2 mx-4  flex flex-col px-4 "+(activeChatMessage.sender._id === auth.user._id? ("bg-green-200 "+classes.chatBubbleLocal) : ("bg-white "+classes.chatBubbleExternal))}
												onViewportVisibilityChange={(inViewport) => {
													if (inViewport && sockets.default) {
														if (activeChatMessage.state === "sent" && activeChatMessage.sender._id !== auth.user._id) {
															sockets.default.emit("mark-message-as-received", {message: activeChatMessage, user: auth.user});
														}
														else if ((activeChatMessage.state === "received" || activeChatMessage.state === "partially-received") && activeChatMessage.sender._id !== auth.user._id) {
															sockets.default.emit("mark-message-as-read", {message: activeChatMessage, user: auth.user});
														}
													}
													
												}}
											>
												{(!message_deleted && JSON.isJSON(activeChatMessage.sender)) && <div className={"flex flex-row w-full items-center mb-1"}>
													<Typography variant="body1" className={"flex-grow text-gray-500 font-bold"}>
														{activeChatMessage.sender.first_name+" "+activeChatMessage.sender.last_name}
													</Typography>
													<IconButton aria-label="Toggle Menu" onClick={handleContextOpen("message", activeChatMessage)} className={""} size="small">
														<ExpandMoreIcon fontSize="inherit" />
													</IconButton>
												</div>}
												{(!message_deleted && ["audio", "file", "video", "image"].includes(activeChatMessage.type) && Array.isArray(activeChatMessage.attachments)) && <div className={"flex flex-col items-center mb-2"}>
													{activeChatMessage.attachments.map(attachment => (
														<div className={"p-2 w-11/12 border border-gray-400 rounded"}>
															{activeChatMessage.type === "image" && <LazyImage className={"w-full h-auto"} src={AttachmentsService.getAttachmentFileUrl(attachment)} alt={attachment.name}/>}
															{activeChatMessage.type === "audio" && <div className={"w-full h-auto flex flex-row items-center"} >
																<AudiotrackOutlinedIcon className={"text-2xl"}/>
																<Typography variant="body1" color="textPrimary" className={"flex-grow truncate"}>
																	{attachment.name}
																</Typography>
															</div>}
															{activeChatMessage.type === "video" && <div className={"w-full h-auto flex flex-row items-center"} >
																<MovieOutlinedIcon className={"text-2xl"}/>
																<Typography variant="body1" color="textPrimary" className={"flex-grow truncate"} >
																	{attachment.name}
																</Typography>
															</div>}
															{activeChatMessage.type === "file" && <div className={"w-full h-auto flex flex-row items-center"} >
																<AttachFileIcon className={"text-2xl"}/>
																<Typography variant="body1" color="textPrimary" className={"flex-grow truncate"} >
																	{attachment.name}
																</Typography>
															</div>}

														</div>
													))}
												</div>}
												{!message_deleted && <Typography variant="body1" color="textPrimary" className={"flex-grow"} paragraph>
														{activeChatMessage.content}
												</Typography>}

												{message_deleted && <div className={"flex flex-row items-center w-full"} style={{color: theme.palette.divider}}>
													<Typography variant="body1" color="inherit" className={"flex-grow"}>
														Message deleted
													</Typography>
													<BlockIcon className={"mx-2"} fontSize="small"/>
												</div>}

												{!message_deleted && <div className={"flex flex-row items-center w-full"} style={{color: theme.palette.text.disabled}}>
													{activeChatMessage.created_on && <Typography variant="body2" className={"text-xs flex-grow"}>
														{activeChatMessage.created_on instanceof Date? activeChatMessage.created_on.toLocaleString() : new Date(activeChatMessage.created_on).toLocaleString()}
													</Typography>}
													{(activeChatMessage.state === "sent" && activeChatMessage.sender._id === auth.user._id) && <DoneIcon className={"mx-2"} fontSize="small"/>}
													{((activeChatMessage.state === "partially-received" || activeChatMessage.state === "received") && activeChatMessage.sender._id === auth.user._id) && <DoneAllIcon className={"mx-2"} fontSize="small"/>}
													{((activeChatMessage.state === "partially-read" || activeChatMessage.state === "read") && activeChatMessage.sender._id === auth.user._id) && <DoneAllIcon className={"mx-2"} color={"secondary"} fontSize="small"/>}
												</div>}
											</ViewPortSensor>
										</GridItem>
									);
								}
									
							})}

							{(Array.isArray(active_conversation.typing)? (active_conversation.typing.length > 0) : false) && <GridItem xs={12} className={"flex p-0 py-1 flex-row"} >
									<div  className={classes.avatar}> </div>
									<div  className={"p-2 mx-4  flex flex-col px-4  rounded-full"}>
										<div  className={classes.typing_loader}></div>
									</div>
							</GridItem>}
							<div  className="w-full h-1" id="chatLastChild"> </div>
						</GridContainer>
					</ScrollBars>}

					

					<GridContainer 
						className={["audio", "file", "video", "image"].includes(draft.type)? "flex-grow flex flex-col" : classes.chatInputsWrapper} 
						style={{ backgroundColor: theme.palette.background.paper, top: ["audio", "file", "video", "image"].includes(draft.type)? 0 : "auto"}}
					>
						{draft.reply_for && <GridItem xs={12} className={"flex flex-row items-center bg-green-200"}>
							<div className={"p-2 mx-4"}>
										<Typography variant="body1" color="textPrimary" className={"font-bold"}>
											{draft.reply_for.sender.first_name+" "+draft.reply_for.sender.last_name}
										</Typography>
										<Typography variant="body1" color="textPrimary" className={""} >
											{draft.reply_for.content}
										</Typography>
									</div>
						</GridItem>}

						{["audio", "file", "video", "image"].includes(draft.type) && <GridItem xs={12} className={"flex flex-grow flex-row items-center bg-grey-200"}>
							<FileInput
								variant="outlined"
								value={(["audio", "file", "video", "image"].includes(draft.type) && (Array.isArray(draft.attachments)? (draft.attachments > 0) : false))? draft.attachments[0] : undefined}
								onChange={(newValue)=>{
									setDraft(currentDraft => {
										try {
											let newDraft = JSON.parse(JSON.stringify(currentDraft));
											if (newValue) {
												newDraft.attachments = [newValue];
											}	
											else{
												delete newDraft.attachments;
											}				
											return newDraft;
										} catch(err) {
											console.error(err);
											return currentDraft;
										}
									})
									console.log("FileInput newValue ", newValue);
								}}
								filesLimit={1}
								acceptedFiles={draft.type === "file"? ["image/*", "video/*", "audio/*", "application/*"] : [(draft.type+"/*")]}
							/>							
						</GridItem>}

						{attachmentDialOpen && <GridItem xs={12} className={"flex flex-row items-center justify-evenly bg-grey-200"}>
							{attachmentActions.map((action) => (
									<Fab
										key={action.name}
										color={action.color}
										aria-label={"Attach "+action.label}										
										onClick={()=>{
											setAttachmentDialOpen(false);
											handleOnChangeDraftType(action.name);
										}}
										style={{background: action.color, color: theme.palette.background.paper}}
										className={"mx-2"}
									>
										{action.icon}
									</Fab>
							))}							
						</GridItem>}

						<GridItem xs={12} className={"flex flex-row items-center"}>
							
							<IconButton 
								onClick={(event)=>{
									setAttachmentDialOpen(!attachmentDialOpen)
								}} 
								aria-label={attachmentDialOpen? ((["audio", "file", "video", "image"].includes(draft.type) && (Array.isArray(draft.attachments)? (draft.attachments > 0) : false))? "Remove Attachments" : "Dismiss File Attachment") : "Close File Attachment"} 
								className={"mx-2"} 
							>
								{!attachmentDialOpen? <AttachFileIcon color="inherit" /> : ((["audio", "file", "video", "image"].includes(draft.type) && (Array.isArray(draft.attachments)? (draft.attachments > 0) : false))? <DeleteOutlinedIcon color="inherit" /> : <CloseIcon  color="inherit" />)}
							</IconButton>
							<div className={"flex-grow rounded-full mx-8"}>
							<TextInput
								variant={["audio", "file", "video", "image"].includes(draft.type)? "standard" : "outlined"}
								multiline
								rows={2}
								onBlur={(new_value, event)=>{
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
												
											} catch(err) {
												console.error(err);
												return currentDraft;
											}
										});
										
									}
									if (active_conversation._id && sockets.default) {
										sockets.default.emit("stopped-typing-message", {conversation: active_conversation._id, user: auth.user});
										
									}
								}}
								onFocus={()=>{
									if (active_conversation._id && sockets.default) {
										sockets.default.emit("started-typing-message", {conversation: active_conversation._id, user: auth.user});										
									}
								}}
								defaultValue={active_conversation._id === draft.conversation? draft.content : undefined}
								onChange={(new_value)=>{
									
								}}
								placeholder="Type your message here..."
								inputRef={textInputRef}
								inputProps={{
									onKeyDown: handleMessageInputKeyDown,
								}}
							/>
							</div>
							{/*<IconButton onClick={(event)=>handleOnSendMessage()} aria-label="send" className={"primary-text"} >
															<SendIcon color="inherit" />
														</IconButton>*/}
						</GridItem>
					</GridContainer>

				</GridItem>
			</Paper>}


				<Menu
					keepMounted
					open={contextMenu.mouseY !== null}
					onClose={handleContextClose}
					anchorReference="anchorPosition"
					anchorPosition={
					  contextMenu.mouseY !== null && contextMenu.mouseX !== null
						? { top: contextMenu.mouseY, left: contextMenu.mouseX }
						: undefined
					}
				  >
					{contextMenu.type === "conversation" && <MenuItem onClick={(event)=>{
						setMessagingCache("active_conversation", contextMenu.entry);
						handleContextClose(event);
					}}>Open Conversation</MenuItem>}
					{contextMenu.type === "conversation" && <MenuItem 
						onClick={(event)=>{
							handleArchiveConversation(contextMenu.entry);
							handleContextClose(event);
						}}
					>
						Archive Conversation
					</MenuItem>}
					{contextMenu.type === "conversation" && <MenuItem 
						onClick={(event)=>{
							handleDeleteConversation(contextMenu.entry);
							handleContextClose(event);
						}}
					>
						Delete Conversation
					</MenuItem>}

					{(contextMenu.type === "message" && contextMenu.entry.sender._id !== auth.user._id) && <MenuItem 
						onClick={(event)=>{
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
								
							
						}}
					>
						Reply Message
					</MenuItem>}
					{(contextMenu.type === "message" && contextMenu.entry.sender._id === auth.user._id) && <MenuItem 
						onClick={(event)=>{
							handleContextClose(event);
							if (sockets.default) {
								sockets.default.emit("delete-message-for-user", {message: contextMenu.entry, user: auth.user});
							}
						}}
					>
						Delete For Me
					</MenuItem>}

					{(contextMenu.type === "message" && contextMenu.entry.sender._id === auth.user._id) && <MenuItem 
						onClick={(event)=>{
							handleContextClose(event);
							if (sockets.default) {
								sockets.default.emit("delete-message-for-all", {message: contextMenu.entry, user: auth.user});
							}
						}}
					>
						Delete For All
					</MenuItem>}
				</Menu>

		{error && <Snackbar open={Boolean(error)} autoHideDuration={10000} onClose={() => setError(false)}>
	        <Alert onClose={() => setError(false)} severity="error">
				{error}
	        </Alert>
		</Snackbar>}

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
	withStyles(styles),
	connect(mapStateToProps, {apiCallRequest, setMessagingCache, clearMessagingCache}),
	withTheme,
)((Chat));
