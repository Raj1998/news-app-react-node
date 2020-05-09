import React from 'react';
import commentBox from 'commentbox.io';
import { commentbox_project_id } from '../Data'

export default class Comments extends React.Component {

    componentDidMount() {

        this.removeCommentBox = commentBox(commentbox_project_id, { defaultBoxId: this.props.cid });
    }

    componentWillUnmount() {

        this.removeCommentBox();
    }

    render() {

        return (
            <div className="commentbox" />
        );
    }
}