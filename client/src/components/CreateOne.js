import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSuperiors, createSoldier } from '../actions';
import Form from './Form';
const FormWithRouter = withRouter(Form);
class CreateOne extends React.Component {
    // componentDidMount () {
    //     this.props.getSuperiors();
    // }
    render () {
        return (
            <div>
                <h1>create soldier</h1>
                <FormWithRouter doSoldier={this.props.createSoldier} superiors={this.props.superiors} flag="create"/>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        getSuperiors: () => dispatch(getSuperiors()),
        createSoldier: (soldier, history) => dispatch(createSoldier(soldier, history))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateOne);