import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import MUIRichTextEditor from 'mui-rte';
import { Editor, EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js'
import withRoot from "utils/withRoot";



class WysiwygEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    return (
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}



/*function WysiwygEditor(props) {
	const { className, controls, value, defaultValue, ...rest } = props;
	let converted_value = value? value : defaultValue ;
	//check if HTML
	const isHTMLvalue = String.isString(converted_value) && /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(converted_value);
	if (isHTMLvalue) {
		const contentHTML = convertFromHTML(converted_value);
		const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
		converted_value = JSON.stringify(convertToRaw(state));
	}
	return <MUIRichTextEditor controls = {["title", "bold", "italic", "underline", "strikethrough", "highlight", "undo", "redo", "link", "media", "numberList", "bulletList", "quote", "code", "clear", "save"]} className={(className? className : "")+" p-4 "} value={converted_value} {...rest} />;
}
*/

WysiwygEditor.defaultProps = {
	
};

export default withRoot(WysiwygEditor);
