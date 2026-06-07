import React, { useEffect } from 'react';

export default function Head({ title, children }) {
    useEffect(() => {
        if (title) {
            document.title = title;
        } else if (children) {
            // Find <title> tag inside children if title prop is not provided
            const titleTag = React.Children.toArray(children).find(
                child => child && child.type === 'title'
            );
            if (titleTag && titleTag.props.children) {
                document.title = titleTag.props.children;
            }
        }
    }, [title, children]);

    return null;
}
