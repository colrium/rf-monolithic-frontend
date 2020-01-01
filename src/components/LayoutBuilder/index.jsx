import React, { Component } from 'react';


class LayoutBuilder extends Component {
    render() {
        const { minHeight, style, editorId } = this.props;

        return (
            <div style={{ flex: 1, display: 'flex', minHeight: minHeight }}>
                <div id={editorId} style={{ ...style, flex: 1 }} />
            </div>
        )
    }
    
}

LayoutBuilder.defaultProps = {
    minHeight: 500,
    editorId: "editor",
    displayMode: "email",
    style: {},
    options: {},
};

export default LayoutBuilder;