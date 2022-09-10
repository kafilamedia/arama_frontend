
import React, { CSSProperties } from 'react';
const SimpleError = (props: { show?: boolean, style?: CSSProperties, children?: any }) => {
  if (props.show == false) return null;
  return (
    <div style={props.style} className="alert alert-danger">
      {props.children ?? "Error Occured"}
    </div>
  );
}
export default SimpleError;