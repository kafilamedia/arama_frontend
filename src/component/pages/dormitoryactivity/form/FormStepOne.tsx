
import React from 'react'
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import WebResponse from '../../../../models/commons/WebResponse';
import WebRequest from '../../../../models/commons/WebRequest';
import Category from '../../../../models/Category';
import MasterDataService from '../../../../services/MasterDataService';
import FormGroup from '../../../form/FormGroup';
import SimpleError from '../../../alert/SimpleError';
import Spinner from '../../../loader/Spinner';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
class State {
    categories: Category[] = [];
    loading: boolean = false;
}
class FormStepOne extends BaseComponent {
    state: State = new State();
    masterDataService: MasterDataService;
    constructor(props) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }
    categoriesLoaded = (response: WebResponse) => {
        this.setState({ categories: response.items, categoriesLoaded: true }, () => {
            if (response.items && response.items?.length > 0) {
                if (!this.props.category) {
                    this.setCategory(response.items[0]);
                }
            }
        });
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    setCategory = (c: Category) => {
        this.props.setSelectedCategory(c);  
    }
    loadCategories = () => {
        const req: WebRequest = {
            filter: { limit: 0 },
            modelName: 'category'
        }
        this.commonAjax(
            this.masterDataService.list,
            this.categoriesLoaded,
            this.showCommonErrorAlert,
            req
        )
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadCategories();
    }
    onSubmit = () => {
        this.props.onSubmit();
    }
    render() {
        const categories = this.state.categories;
        const category = this.props.category;
        if (this.state.loading) {
            return <Spinner />
        }
        if (categories.length == 0) {
            return <SimpleError>Categories not found</SimpleError>
        }
        return (
            <form onSubmit={(e) => { e.preventDefault(); this.onSubmit() }}>
                <FormGroup label="Category">
                    <select className="form-control" onChange={(e)=>e.preventDefault()} value={category ? category.id??"" : ""} >
                        {categories.map((c) => {
                            return <option key={"select-cat-" + c.id}
                                onClick={(e) => { this.setCategory(c) }}
                                value={c.id}>{c.name}</option>
                        })}
                    </select>

                </FormGroup>
                <hr/>
                <AnchorWithIcon className="btn btn-secondary float-left" iconClassName="fas fa-arrow-left" onClick={this.props.onBack} >Back</AnchorWithIcon>
                
                <AnchorWithIcon className="btn btn-info float-right" iconClassName="fas fa-arrow-right" onClick={this.onSubmit}>Next</AnchorWithIcon>
            </form >


        )
    }
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(FormStepOne)
)