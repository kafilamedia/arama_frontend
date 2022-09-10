
import React, { Component } from 'react';
interface Props {
    orientation?: string,
    show?: boolean,
    children: any,
    label?: any,
    className?: string,
}
const FormGroup = (props: Props) => {
    if (false == props.show) return null;
    const orientation = props.orientation == 'vertical' ? 'vertical' : 'horizontal';
    return (
        <div className={`form-group ${props.className} ${(orientation == 'vertical' ? '' : 'row')}`}>
            <label className={(orientation == 'vertical' ? '' : 'col-sm-3')}>
                <strong>{props.label ?? ''}</strong>
            </label>
            <div className={(orientation == 'vertical' ? '' : 'col-sm-9')}>
                {props.children}
            </div>
        </div>
    )
};

export default FormGroup;
