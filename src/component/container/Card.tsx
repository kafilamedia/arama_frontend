
import React, { Component } from 'react';
const Card = (props: { attributes?: any, className?: string, title?: string, children?: any, footerContent?: any }) => {
  return (
    <div {...props.attributes} className={"card " + props.className}>
      {
        props.title &&
        <div className="card-header">
          {props.title}
        </div>
      }
      <div className="card-body">
        {props.children}
      </div>
      {
        props.footerContent != undefined &&
        <div className="card-footer">
          {props.footerContent}
        </div>
      }
    </div>
  )
};

export default Card;
