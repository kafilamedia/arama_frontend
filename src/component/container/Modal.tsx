
import React, { Component } from 'react';
import AnchorButton from '../navigation/AnchorButton';
class IState {
    show:boolean = true
}
interface IProps {
    toggleable?:boolean, show?:boolean, title?:string, style?:any, footerContent?:any,showFooter?:boolean
}
export default class Modal extends Component<IProps, IState> {
    state:IState = new IState();
    constructor(props: any) {
        super(props);
    }
    hideModal = () => {
        this.setState({show:false});
    }
    showModal = () => {
        this.setState({show:true});
    }
    componentDidMount() {
        if (this.props.show == false) { this.setState({show:false}); }
    }
    render() {
    //    if (this.props.show == false) { return null; }
        const title = this.props.title?? "Title"; 
        if (this.props.toggleable == true && this.state.show == false) {
            return (
                <AnchorButton style={{marginBottom:'10px'}} onClick={this.showModal} iconClassName="fas fa-angle-down" >Show {title}</AnchorButton>
            )
        }
        const props = (({ style, show, footerContent, toggleable, ...props }) => props)(this.props) // remove b and c
        return (
            <div {...props} className="modal-content " style={{...this.props.style, marginBottom:'10px'}}>
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    {this.props.toggleable?
                    <button type="button" className="btn btn-sm" onClick={this.hideModal} aria-label="Close">
                        <span aria-hidden="true">
                            <i className='fas fa-times'/>
                        </span>
                    </button>
                    :
                    null}
                </div>
                <div className="modal-body">
                    {this.props.children}
                </div>
                {this.props.footerContent || this.props.showFooter == true?
                <div className="modal-footer">
                    {this.props.footerContent}
                </div>
                :null}
            </div>
        )
    }

}