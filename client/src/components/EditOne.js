import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Form from './Form';
import { updateSoldier } from '../actions';
const FormWithRouter = withRouter(Form);
class EditOne extends React.Component {
    render () {     
        console.log(this.props.selectedSoldier);
        return (
            <div>
                <FormWithRouter doSoldier={this.props.updateSoldier} superiors={this.props.superiors} soldier={this.props.selectedSoldier} flag="edit"/>
                {/* <TestShowList soldier={null}/> */}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateSoldier: (soldier, history) => dispatch(updateSoldier(soldier, history))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(EditOne);