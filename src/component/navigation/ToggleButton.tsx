import React, { Component } from 'react'
import AnchorButton from './AnchorButton';
interface Props {
  onClick(val: boolean): void,
  active: boolean,
  yesLabel?: string,
  noLabel?: string
}
const ToggleButton = (props: Props) => {
  const { active, onClick } = props;
  return (
    <div className="btn-group">
      <AnchorButton
        className={`btn  btn-sm ${(active ? 'btn-dark' : 'btn-outline-dark')}`}
        onClick={(e) => onClick(true)}
      >
        {props.yesLabel ?? 'Yes'}
      </AnchorButton>
      <AnchorButton
        className={`btn  btn-sm ${(active == false ? 'btn-dark' : 'btn-outline-dark')}`}
        onClick={(e) => onClick(false)}
      >
        {props.noLabel ?? 'No'}
      </AnchorButton>
    </div>
  );
}
export default ToggleButton;