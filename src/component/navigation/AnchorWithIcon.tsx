
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
interface IProps {
  show?: boolean, attributes?: any, iconClassName?: string, to?: string, className?: string,
  style?: any, onClick?(e: any): any, children?: any
}
const AnchorWithIcon = (props: IProps) => {
  if (props.show == false) return null;
  const btnClassName = props.className ?? "btn btn-outline-secondary";
  if (props.to) {
    return <Link {...props.attributes} to={props.to} style={props.style} onClick={props.onClick} className={btnClassName} >
      {
        props.iconClassName &&
        <span style={{ marginRight: props.children ? '5px' : '0px' }}>
          <i className={props.iconClassName} />
        </span>
      }
      {props.children}
    </Link>
  }
  return (
    <a {...props.attributes} tyle={props.style} onClick={props.onClick} className={btnClassName} >
      {
        props.iconClassName &&
        <span style={{ marginRight: props.children ? '5px' : '0px' }}>
          <i className={props.iconClassName} />
        </span>
      }
      {props.children}
    </a>
  )
}
export default AnchorWithIcon;
