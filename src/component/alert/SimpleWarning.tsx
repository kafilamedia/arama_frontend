
import React, { Component, CSSProperties } from 'react';
const SimpleWarning = (props: { children?: any, show?: boolean, style?: CSSProperties, className?: string }) => {

    if (props.show == false) return null;
    return (
        <div style={props.style} className={"alert alert-warning " + (props.className ?? "")}>
            {props.children ?? "Error Occured"}
        </div>
    )
}

export default SimpleWarning;
