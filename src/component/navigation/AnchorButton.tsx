
import React, { Component } from 'react';
interface IProps {
  show?: boolean;
  className?: string;
  style?: any;
  onClick?: any;
  iconClassName?: string;
  attributes?: any;
  children?: any;
}
const AnchorButton = (props: IProps) => {
  if (props.show == false) return null;
  const btnClassName = props.className ?? "btn btn-outline-secondary";
  return (
    <a style={props.style} {...props.attributes} onClick={props.onClick} className={btnClassName} >
      {
        props.iconClassName &&
        <span style={props.children ? { marginRight: '5px' } : {}}>
          <i className={props.iconClassName} />
        </span>
      }
      {props.children}
    </a>
  )
}
export default AnchorButton;
