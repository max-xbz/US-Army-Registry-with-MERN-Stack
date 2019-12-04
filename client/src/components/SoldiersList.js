import React from 'react';
import { getImageUrl } from '../utils.js';
import Moment from 'moment';
class SoldiersList extends React.Component {
    constructor (props) {
        super(props);
        this.myRef = React.createRef();
    }
    
    componentDidMount() {
        this.props.loadMore();
        // Detect when scrolled to bottom.
        this.myRef.current.addEventListener("scroll", () => {
            if (
                this.myRef.current.scrollTop + this.myRef.current.clientHeight >=
                this.myRef.current.scrollHeight
                && this.props.isBottom === false
            ) {
               this.props.loadMore();
            }
        });
    }
    handleDelete = (id) => {
        this.props.deleteOne(id);
        if(!this.props.isOnSubPage) {
            this.props.loadMore(this.props.soldiers.length , 1);
        }
    }
    handleSortByOrder = (sortBy) => {
        let order = 1;
        if(this.props.order === 1) {
            order = -1;
        }
        this.props.sortByField(sortBy, order);
    }
    handleSub = (children, id) => {
        if(children.length !== 0) {
            this.props.getSub(id);
        }
    }
    handleSuperior = (child) => {
        if(child.superior) {
            this.props.getSuperior(child.superior._id);
        }
    }
    render () {
        const { history } = this.props;
        // const { isFetching, error } = this.props;
        const soldierList = () => {
            return this.props.soldiers.map((item,index) => {
                let image = getImageUrl(item.image);
                return (
                    <tr key={index}>
                        <td><img style={{width:"50px", height:"50px"}} src={image} /></td>
                        <td>{item.name}</td>
                        <td>{item.sex}</td>
                        <td>{item.rank}</td>
                        <td>{item.startDate && Moment(item.startDate).format('L')}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td onClick={()=>this.handleSuperior(item)}>{item.superior && item.superior.name}</td>
                        <td onClick={()=>this.handleSub(item.children, item._id)}>{item.children.length !== 0 && item.children.length}</td>
                        <td>
                            <button type="button" className="btn btn-default" onClick={()=>{ history.push(`/edit/${item._id}`)} }>
                                <span className="glyphicon glyphicon-pencil"></span> Edit 
                            </button>
                        </td>
                        <td>
                            <button type="button" className="btn btn-default" onClick={()=>this.handleDelete(item._id)}>
                                <span className="glyphicon glyphicon-remove"></span> Delete
                            </button>
                        </td>
                    </tr>
                );
            })
        }
        return (
            <div className="soldiers-list">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Avator</th>
                            <th scope="col" onClick={()=>this.handleSortByOrder("name")}>Name</th>
                            <th scope="col" >Sex</th>
                            <th scope="col" >Rank</th>
                            <th scope="col" onClick={()=>this.handleSortByOrder("startDate")}>Start Date</th>
                            <th scope="col" >Phone</th>
                            <th scope="col" >Email</th>
                            <th scope="col" >Superior</th>
                            <th scope="col" ># of D.S.</th>
                            <th scope="col" >Edit</th>
                            <th scope="col" >Delete</th>
                        </tr>
                    </thead>
                    <tbody ref={this.myRef} style={{ display: "block", height: "450px", overflow: "auto" }}>
                        {soldierList()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default SoldiersList;