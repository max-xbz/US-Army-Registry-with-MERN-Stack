import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from 'react-redux';
import { getSoldiers, getNextPageData } from '../actions';
class TestScroll extends React.Component {
    constructor (props) {
        super(props);
        this.myRef = React.createRef();
    }
    componentWillMount () {
        this.props.getSoldiers();
    }
    render() {
        // console.log(this.props);
        const items = () => {
            return this.props.data.map((item)=>{
                return (
                    <tr style={{height:"105px"}} key={item._id}>
                        <td>
                            {item.name}
                        </td>
                        <td>
                            {item.rank}
                        </td>
                    </tr>
                    );
            });
        }
        return (
            <div>
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
                    <tbody>
                        <InfiniteScroll
                            dataLength={this.props.data.length} //This is important field to render the next data
                            next={this.props.nextPageData}
                            hasMore={!this.props.isBottom}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                <b>Yay! You have seen it all</b>
                                </p>
                            }
                            >
                            {items()}
                        </InfiniteScroll>
                    </tbody>
                </table>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        getSoldiers: () => dispatch(getSoldiers()),
        nextPage: () => dispatch(getNextPageData())
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(TestScroll);