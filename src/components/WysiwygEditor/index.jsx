import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { stateToHTML } from "draft-js-export-html";
import Popover from '@material-ui/core/Popover';
import {
	FormatBold as BoldIcon,
	FormatItalic as ItalicIcon,
	FormatUnderlined as UnderlinedIcon,
	FormatStrikethrough as StrikethroughIcon,
	FormatSize as SizeIcon,
	VerticalAlignTop as SuperscriptIcon,
	VerticalAlignBottom as SubscriptIcon,
	FormatListBulleted as UnorderedListIcon,
	FormatListNumbered as OrderedListIcon,
	FormatIndentIncrease as IndentIcon,
	FormatIndentDecrease as OutdentIcon,
	FormatAlignLeft as LeftAlignIcon,
	FormatAlignRight as RightAlignIcon,
	FormatAlignCenter as CenterAlignIcon,
	FormatAlignJustify as JustifyAlignIcon,
	InsertLink as InsertLinkIcon,
	LinkOff as RemoveLinkIcon,
	InsertPhoto as InsertPhotoIcon,
	Delete as EraseIcon,
	Undo as UndoIcon,
	Redo as RedoIcon,
	ExpandMore,
	ExpandLess,
} from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Button from 'components/Button';
import Typography from 'components/Typography';
import withRoot from "utils/withRoot";

class IconsOnlyComponent extends Component {
	render() {
		const { config } = this.props;
		//console.log("IconsOnlyComponent this.props", this.props);
		return (
			<div className="inline-block">
				{ Array.isArray(config.options) && config.options.map((option, index)=>(
					option in config && <IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900" key={option+"-"+index}> { String.isString(config[option].icon)? <img src={config[option].icon} /> : config[option].icon } </IconButton>
				)) }			
			</div>
		);
	}
}

class IconAndPopoverComponent extends Component {
	state = {
		open:false,
		popOverAnchorEl: null,
	};

	constructor(props){
		super(props);
		const { config } = props;
		this.state.id = String.isString(config.title)? config.title.variablelize() : String.uid(8);
		this.handleOnPopoverOpen = this.handleOnPopoverOpen.bind(this);
		this.handleOnPopoverClose = this.handleOnPopoverClose.bind(this);
		//console.log("IconPopoverComponent this.props", props);
	}

	handleOnPopoverOpen(event){
		this.setState({ open: true, popOverAnchorEl: event.currentTarget });
	} 
	handleOnPopoverClose(){
		this.setState({ open: false, popOverAnchorEl: null });
	} 
	render() {
		const { config } = this.props;
		
		return (
			<div className="inline-block">
				<IconButton aria-controls={this.state.id} aria-haspopup="true" className="text-gray-700 hover:text-gray-900 focus:text-gray-900" onClick={this.handleOnPopoverOpen}> 
					{ String.isString(config.icon)? <img src={config.icon} /> : config.icon } 
				</IconButton>

				<Menu
					id={this.state.id}
					open={this.state.open}
					anchorEl={this.state.popOverAnchorEl}
					onClose={this.handleOnPopoverClose}
				>
					{ Array.isArray(config.options) && config.options.map((option, index)=>(
						<MenuItem key={"option-"+index}> 
							<Typography variant="h5" className="p-2" key={"option-"+index}>{option}</Typography>
						</MenuItem>
					)) }
					
				</Menu>
			</div>
		);
	}
}

class BlockTypeComponent extends Component {
	state = {
		open:false,
		popOverAnchorEl: null,
	};

	constructor(props){
		super(props);
		const { config } = props;
		this.state.id = "block-type-options";
		this.handleOnPopoverOpen = this.handleOnPopoverOpen.bind(this);
		this.handleOnPopoverClose = this.handleOnPopoverClose.bind(this);
		//console.log("BlockTypeComponent this.props", props);
	}

	handleOnPopoverOpen(event){
		this.setState({ open: true, popOverAnchorEl: event.currentTarget });
	} 
	handleOnPopoverClose(){
		this.setState({ open: false, popOverAnchorEl: null });
	} 
	render() {
		const { config, currentState } = this.props;
		const blockTypes = {"normal": "Normal", "h1":"Heading 1", "h2":"Heading 2", "h3":"Heading 3", "h4":"Heading 4", "h5":"Heading 5", "h6":"Heading 6", "blockquote":"Blockquote", "code":"Code"};
		const blockTypeVariants = {"normal": "body1", "h1":"h1", "h2":"h2", "h3":"h3", "h4":"h4", "h5":"h5", "h6":"h6", "blockquote":"caption", "code":"body2"};
		const blockType = currentState.blockType? currentState.blockType.toLowerCase() : "normal";
		return (
			<div className="inline-block">
				<Button aria-controls={this.state.id} aria-haspopup="true" className="text-gray-700 hover:text-gray-900 focus:text-gray-900" onClick={this.handleOnPopoverOpen} simple>
					{blockTypes[blockType]} 
					{this.state.open? <ExpandLess className="ml-2"/> : <ExpandMore className="ml-2"/>}
				</Button>

				<Menu
					id={this.state.id}
					open={this.state.open}
					anchorEl={this.state.popOverAnchorEl}
					onClose={this.handleOnPopoverClose}
				>
					{ Array.isArray(config.options) && config.options.map((option, index)=>(
						<MenuItem key={"option-"+index}>
							<Typography variant={blockTypeVariants[option.toLowerCase()]}>
								{blockTypes[option.toLowerCase()]}
							</Typography>
						</MenuItem>
					)) }
					
				</Menu>
			</div>
		);
	}
}

class FontFamilyComponent extends Component {
	state = {
		open:false,
		popOverAnchorEl: null,
	};

	constructor(props){
		super(props);
		const { config } = props;
		this.state.id = "font-family-option";
		this.handleOnPopoverOpen = this.handleOnPopoverOpen.bind(this);
		this.handleOnPopoverClose = this.handleOnPopoverClose.bind(this);
		//console.log("FontFamilyComponent this.props", props);
	}

	handleOnPopoverOpen(event){
		this.setState({ open: true, popOverAnchorEl: event.currentTarget });
	} 
	handleOnPopoverClose(){
		this.setState({ open: false, popOverAnchorEl: null });
	} 
	render() {
		const { config, currentState } = this.props;
		const fontFamilies = {"arial": "Arial", "georgia":"Georgia", "impact":"Impact", "tahoma":"Tahoma", "times new roman":"Times New Roman", "verdana":"Verdana"};
		const fontFamily = currentState.fontFamily? currentState.fontFamily.toLowerCase() : "arial";
		return (
			<div className="inline-block">
				<Button aria-controls={this.state.id} aria-haspopup="true" className="text-gray-700 hover:text-gray-900 focus:text-gray-900" onClick={this.handleOnPopoverOpen} simple>
					{fontFamilies[fontFamily]}
					{this.state.open? <ExpandLess className="ml-2"/> : <ExpandMore className="ml-2"/>}
				</Button>

				<Menu
					id={this.state.id}
					open={this.state.open}
					anchorEl={this.state.popOverAnchorEl}
					onClose={this.handleOnPopoverClose}
				>
					{ Array.isArray(config.options) && config.options.map((option, index)=>(
						<MenuItem key={"option-"+index}>
							<Typography variant={"body2"}>
							  { option }
							</Typography>
						</MenuItem>
					)) }
					
				</Menu>
			</div>
		);
	}
}

class FontSizeComponent extends Component {
	state = {
		open:false,
		popOverAnchorEl: null,
	};

	constructor(props){
		super(props);
		const { config } = props;
		this.state.id = "font-size-option";
		this.handleOnPopoverOpen = this.handleOnPopoverOpen.bind(this);
		this.handleOnPopoverClose = this.handleOnPopoverClose.bind(this);
		//console.log("FontSizeComponent this.props", props);
	}

	handleOnPopoverOpen(event){
		this.setState({ open: true, popOverAnchorEl: event.currentTarget });
	} 
	handleOnPopoverClose(){
		this.setState({ open: false, popOverAnchorEl: null });
	} 
	render() {
		const { config, currentState } = this.props;
		const fontSize = currentState.fontSize? currentState.fontSize : 12;
		return (
			<div className="inline-block">
				<Button aria-controls={this.state.id} aria-haspopup="true" className="text-gray-700 hover:text-gray-900 focus:text-gray-900" onClick={this.handleOnPopoverOpen} simple>
					{fontSize}
					{this.state.open? <ExpandLess className="ml-2"/> : <ExpandMore className="ml-2"/>}
				</Button>

				<Menu
					id={this.state.id}
					open={this.state.open}
					anchorEl={this.state.popOverAnchorEl}
					onClose={this.handleOnPopoverClose}
				>
					{ Array.isArray(config.options) && config.options.map((option, index)=>(
						<MenuItem key={"option-"+index}>
							<Typography variant={"body2"}>
							  { option }
							</Typography>
						</MenuItem>
					)) }
					
				</Menu>
			</div>
		);
	}
}

class LinkAddComponent extends Component {
	state = {
		open:false,
		popOverAnchorEl: null,
	};

	constructor(props){
		super(props);
		const { config } = props;
		this.state.id = "link-option";
		this.handleOnPopoverOpen = this.handleOnPopoverOpen.bind(this);
		this.handleOnPopoverClose = this.handleOnPopoverClose.bind(this);
		//console.log("LinkAddComponent this.props", props);
	}

	handleOnPopoverOpen(event){
		this.setState({ open: true, popOverAnchorEl: event.currentTarget });
	} 
	handleOnPopoverClose(){
		this.setState({ open: false, popOverAnchorEl: null });
	} 
	render() {
		const { config } = this.props;
		return (
			<div className="inline-block">
				{ Array.isArray(config.options) && config.options.map((option, index)=>(
					option in config && <IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900" key={option+"-"+index}> { String.isString(config[option].icon)? <img src={config[option].icon} /> : config[option].icon } </IconButton>
				)) }
			</div>
		);
	}
}


class InsertLinkIconComponent extends Component {
	render() {
		return (<IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900"> <InsertLinkIcon /> </IconButton>);
	}
}
class RemoveLinkIconComponent extends Component {
	render() {
		return (<IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900"> <RemoveLinkIcon /> </IconButton>);
	}
}
class InsertPhotoIconComponent extends Component {
	render() {
		return (<IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900"> <InsertPhotoIcon /> </IconButton>);
	}
}
class EraseIconComponent extends Component {
	render() {
		return (<IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900"> <EraseIcon /> </IconButton>);
	}
}
class UndoIconComponent extends Component {
	render() {
		return (<IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900"> <UndoIcon /> </IconButton>);
	}
}
class RedoIconComponent extends Component {
	render() {
		return (<IconButton className="text-gray-700 hover:text-gray-900 focus:text-gray-900"> <RedoIcon /> </IconButton>);
	}
}

class WysiwygEditor extends React.Component {
  constructor(props) {
	super(props);
	this.state = {...props, editorState: EditorState.createEmpty()};
	this.onEditorStateChange = this.onEditorStateChange.bind(this);
	this.onContentStateChange = this.onContentStateChange.bind(this);
	const { className, controls, value, defaultValue, ...rest } = props;
	let converted_value = value? value : defaultValue ;
	//check if HTML
	const isHTMLvalue = String.isString(converted_value) && /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(converted_value);
	if (String.isString(converted_value)) {
		const contentHTML = convertFromHTML(converted_value);
		const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks);
		this.state.contentState = contentState;
		this.state.editorState = EditorState.createWithContent(contentState);		
	}

  }

  onEditorStateChange(editorState){
	this.setState({ editorState: editorState });
  }

  onContentStateChange(contentState){
  	const {onChange, type} = this.props;  	
    this.setState({contentState: contentState});
    if (Function.isFunction(onChange)) {
    	if (type === "html") {
    		let htmlContent = stateToHTML(this.state.editorState.getCurrentContent());
    		onChange(htmlContent);
    	}
    }
  };


  render() {
  	const { editorState, className, variant, label } = this.state;
  	let toolbarClassName = variant === "outlined" ? "inline-block border-gray-400 border-b" : "";
  	let wrapperClassName = variant === "outlined" ? "border-gray-400 border rounded" : "rounded-t py-4";
  	let containerClassName = ((variant === "outlined" ? " border-2 border-gray-400 rounded p-0" : "rounded-t py-4")+className? (" "+className) : "");
  	let editorClassName = "px-2 md:py-4 ";
	return (
		<GridContainer className={containerClassName}>
			{ label && <GridItem xs={12} className="p-0 px-2"> <Typography variant="body1">{label}</Typography></GridItem> }
			<GridItem xs={12} className="p-0">
				<Editor
					toolbarClassName={toolbarClassName}
					wrapperClassName={wrapperClassName}
					editorClassName={editorClassName}
					defaultEditorState={editorState}
					onEditorStateChange={this.onEditorStateChange}
					onContentStateChange={this.onContentStateChange}
					toolbar={{
						blockType: {
							component: BlockTypeComponent,
							title: "Type",
							className: 'demo-option-custom-wide', 
							dropdownClassName: 'demo-dropdown-custom' 
						},
						fontSize: {
							component: FontSizeComponent,
							title: "Font Size",
						},				
						fontFamily: { 
							component: FontFamilyComponent,
							title: "Font family",
						},
						inline: {
							component: IconsOnlyComponent,
							className: 'inline-block',
							bold: { icon: <BoldIcon />, className: 'demo-option-custom' },
							italic: { icon: <ItalicIcon />, className: 'demo-option-custom' },
							underline: { icon: <UnderlinedIcon />, className: 'demo-option-custom' },
							strikethrough: { icon: <StrikethroughIcon />, className: 'demo-option-custom' },
							monospace: { className: 'demo-option-custom' },
							superscript: { icon: <SuperscriptIcon />, className: 'demo-option-custom' },
							subscript: { icon: <SubscriptIcon />, className: 'demo-option-custom' },
						},
						list: {
							component: IconsOnlyComponent,
							className: 'inline-block',
							unordered: { icon: <UnorderedListIcon />, className: 'demo-option-custom' },
							ordered: { icon: <OrderedListIcon />, className: 'demo-option-custom' },
							indent: { icon: <IndentIcon />, className: 'demo-option-custom' },
							outdent: { icon: <OutdentIcon />, className: 'demo-option-custom' },
						},
						textAlign: {
							component: IconsOnlyComponent,
							className: 'inline-block',
							left: { icon: <LeftAlignIcon />, className: 'demo-option-custom' },
							center: { icon: <CenterAlignIcon />, className: 'demo-option-custom' },
							right: { icon: <RightAlignIcon />, className: 'demo-option-custom' },
							justify: { icon: <JustifyAlignIcon />, className: 'demo-option-custom' },
						},
						
						colorPicker: { 
							component: IconsOnlyComponent,					
							className: 'demo-option-custom', 
							popupClassName: 'demo-popup-custom' 
						},
						link: {
							component: LinkAddComponent,
							popupClassName: 'demo-popup-custom',
							link: { icon: <InsertLinkIcon />},
							unlink: { icon: <RemoveLinkIcon />},
						},
						emoji: {
							component: IconsOnlyComponent, 
							className: 'demo-option-custom', 
							popupClassName: 'demo-popup-custom' 
						},
						embedded: { 
							component: IconsOnlyComponent,
							className: 'demo-option-custom', 
							popupClassName: 'demo-popup-custom' 
						},
						image: { component: InsertPhotoIconComponent, className: 'demo-option-custom', popupClassName: 'demo-popup-custom' },
						remove: { component: EraseIconComponent, className: 'demo-option-custom' },
						history: {
							component: IconsOnlyComponent,
							undo: { icon: <UndoIcon />, className: 'demo-option-custom' },
							redo: { icon: <RedoIcon />, className: 'demo-option-custom' },
						},
					}}
					
				/>
			</GridItem>
		</GridContainer>
	);
  }
}


WysiwygEditor.defaultProps = {
	variant: "filled",
	value: "<div><h6>Enter value here...</h6></div>",
	type: "html",
};

export default withRoot(WysiwygEditor);
