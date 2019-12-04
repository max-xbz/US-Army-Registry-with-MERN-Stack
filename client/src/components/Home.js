import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import Search from './Search';
import SoldiersList from './SoldiersList';
import { loadMore, deleteOne, performSearch, sortByField, reSet, getSub, getSuperior } from '../actions';

const SoldiersListWithRouter = withRouter(SoldiersList);
class Home extends React.Component {
    onClick = () => {
       this.props.history.push("/create");
    }
    render() {
        return (
            <div className="home">
                <Header/>
                <Search term={this.props.term} performSearch={this.props.performSearch}/>
                <button type="button" className="btn btn-outline-secondary btn-lg" onClick={this.onClick}>
                    <span className="glyphicon glyphicon-user"></span> Add User
                </button>
                <button type="button" className="btn btn-outline-secondary btn-lg" onClick={this.props.reSet}>Reset</button>
                <SoldiersListWithRouter soldiers={this.props.data} 
                                        loadMore={this.props.loadMore} 
                                        isFetching={this.props.isFetching} 
                                        err={this.props.error}
                                        isOnSubPage={this.props.isOnSubPage}
                                        isBottom={this.props.isBottom} 
                                        deleteOne={this.props.deleteOne} 
                                        order={this.props.order} 
                                        sortByField={this.props.sortByField} 
                                        getSub={this.props.getSub} 
                                        getSuperior={this.props.getSuperior}
                                        />   
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        loadMore: (skip=null, limit=null) => dispatch(loadMore(skip, limit)),
        getSub: (children, id) => dispatch(getSub(children, id)),
        getSuperior: (id) => dispatch(getSuperior(id)),
        deleteOne: (id) => dispatch(deleteOne(id)),
        performSearch: (term) => dispatch(performSearch(term)),
        sortByField: (sortBy, order) => dispatch(sortByField(sortBy, order)),
        reSet: () => dispatch(reSet())
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);