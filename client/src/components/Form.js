import React from 'react';
import Moment from 'moment';
import classNames from 'classnames';
import { getImageUrl } from '../utils.js';
import axios from 'axios';
class Form extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            _id: '', 
            name: { value: '', isValid: true, message: ''},
            rank: { value: 'General', isValid: true, message: ''},
            sex: { value: '', isValid: true, message: ''},
            startDate: { value: '', isValid: true, message: ''},
            phone: { value: '', isValid: true, message: ''},
            email: { value: '', isValid: true, message: ''},
            superior: { value: "", isValid: true, message: ''},
            image: "",
            superiors:[],
            dataFetched: false
        };
    }
    componentDidMount() {

        let id = this.props.match.params.id;
        if (id) {
            axios.get(`http://localhost:8888/api/soldiers/${id}`)
            .then((result) => {
                let soldier = result.data;
                axios.get(`http://localhost:8888/api/soldiers/superiors/${id}`)
                .then((docs) => {
                    let superiors = [];
                    docs.data.map((item) => {
                        superiors.push({_id: item._id, name: item.name});
                    });
    
                    if(soldier.startDate) {
                        soldier.startDate = Moment(soldier.startDate).format('YYYY-MM-DD')
                    } else {
                        soldier.startDate = '';
                    }

                    this.setState({
                        ...this.state,
                        _id: soldier._id,
                        name: {...this.state.name, value: soldier.name},
                        rank: {...this.state.rank, value: soldier.rank},
                        sex: {...this.state.sex, value: soldier.sex},
                        startDate: {...this.state.startDate, value: soldier.startDate},
                        phone: {...this.state.phone, value: soldier.phone},
                        email: {...this.state.email, value: soldier.email},
                        superior: {...this.state.superior, value: (soldier.superior ?  soldier.superior._id : "")},
                        image: soldier.image,
                        superiors: superiors,
                        dataFetched: true
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            axios.get('http://localhost:8888/api/soldiers/superiors')
            .then((docs) => {
                let superiors = [];
                docs.data.map((item) => {
                    superiors.push({_id: item._id, name: item.name});
                });
                this.setState({
                    ...this.state,
                    superiors: superiors  
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        }

    }

    onSubmit = (e) => {
        e.preventDefault();
        //validate form again or not 
        if(this.state.name.isValid && this.state.phone.isValid) {
            this.props.doSoldier(this.state, this.props.history);
        }
    }
    onChange = (e) => {
        this.setState({ 
            ...this.state, 
            [e.target.name]: { 
                ...this.state[e.target.name], 
                value: e.target.value
            }
        }, this.validation(e));
    }
    onChangeHandler= (e) =>{
        this.setState({...this.state, image: e.target.files[0]});
        var f = e.target.files[0]; // FileList object
        var reader = new FileReader();
              // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                document.getElementById("imgDisplay").src = e.target.result;
                document.getElementById("imgDisplay").title = escape(theFile.name);
            }

        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

    }
    validation = (e) => {
        let name = e.target.name;
        return ()=>{
            if(name === 'name') {
                this.validateName();
            } else if(name === 'sex') {
                this.validateSex();
            } else if(name === 'phone') {
                this.validatePhone();
            }
        }
    }
    validateName = () => {
        const { name } = this.state;
        let message = name.value === ''? "Require name": "";
        let isValid = name.value === ''? false: true;
        this.setState({...this.state, name: {...this.state.name, isValid: isValid, message: message}});
    }
    validateSex = () => {
        const { sex } = this.state;
        let isValid = sex.value === ''? false: true;
        let message = isValid? '': "Require sex";
        this.setState({...this.state, sex: {...this.state.sex, isValid: isValid, message: message}});
    }
    validatePhone = () => {
        const { phone } = this.state;
        var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        let isValid = true;
        let message = '';
        let m = phoneRegex.exec(phone.value);
        if(phone.value !== '' && m === null) {
            isValid = false;
            message = 'Wrong phone format';
        }
        this.setState({...this.state, phone: {...this.state.phone, isValid: isValid, message: message}});
        
    }
    render () {
        const { history } = this.props;
        const { match } = this.props;
        const { name, rank, sex, startDate, phone, email, superior, image, superiors, dataFetched } = this.state;
        let superiorId = superior.value;
        const nameGroupClass = classNames('form-control', 
            { 'is-invalid': !name.isValid }
        );
        const startDateGroupClass = classNames('form-control', 
            { 'is-invalid': !startDate.isValid }
        );
        const phoneGroupClass = classNames('form-control',
            { 'is-invalid': !phone.isValid }
        );
        const emailGroupClass = classNames('form-control', 
            { 'is-invalid': !email.isValid }
        );

        const superiorsList = superiors.map((item)=>{
            return (
                <option key={item._id} value={item._id} >
                    {item.name}
                </option>
            );
        });
        let avatar;
        
        if(dataFetched || !match.params.id ) {
            let imageSrc = getImageUrl(image);
            avatar =<div>
                        <span>
                            <img id="imgDisplay" src={imageSrc} className="thumb" />
                        </span>
                        </div>
        } else {
            avatar = <div></div>
        }
        return (
            <div className="container">
                <form className="needs-validation" noValidate onSubmit={this.onSubmit}>
                    <div className="form-group col-md-6">
                        <label className="control-label">Name: </label>
                        <input type="text" className={nameGroupClass} placeholder="FirstName LastName" name="name" value={name.value} onChange={this.onChange}/>
                        <div className="invalid-feedback">
                            {name.message}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="control-label">Rank: </label>
                        <select className="form-control" name="rank" value={rank.value} onChange={this.onChange}>
                            <option>General</option>
                            <option>Colonel</option>
                            <option>Major</option>
                            <option>Captain</option>
                            <option>Lieutenant</option>
                            <option>Warrant Officer</option>
                            <option>Sergeant</option>
                            <option>Corporal</option>
                            <option>Specialist</option>
                            <option>Private</option>
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="control-label">Sex: </label>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="sex" value="F" checked={sex.value === 'F'}  onChange={this.onChange}/>
                            <label className="form-check-label">Female</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="sex" value="M" checked={sex.value === 'M'} onChange={this.onChange}/>
                            <label className="form-check-label">Male</label>
                        </div>
                        <div className="invalid-feedback">
                            {sex.message}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="control-label">Date: </label>
                        <input className="form-control" type="date" value={startDate.value} name="startDate" onChange={this.onChange}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="control-label">Office Phone: </label>
                        <input type="text" className={phoneGroupClass} placeholder="111-111-1111" name="phone" value={phone.value} onChange={this.onChange}/>
                        <div className="invalid-feedback">
                            {phone.message}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="control-label">Email: </label>
                        <input type="text" className={emailGroupClass} name="email" value={email.value} onChange={this.onChange}/>
                        <div className="invalid-feedback">
                            {email.message}
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="control-label">Superior: </label>
                        <select className="form-control" name="superior" value={superiorId} onChange={this.onChange}>
                            <option value="" >Choose your superior</option>
                            {superiorsList}
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="control-label">Choose Avatar: </label>
                        <input type="file" name="myFile"  onChange={this.onChangeHandler}/>
                    </div>
                    {avatar}
                    <div className="form-row col-md-6">
                        <div className="col">
                            {this.props.flag === 'create' && <button type="submit" className="btn btn-primary">Create</button>}
                            {this.props.flag === 'edit' && <button type="submit" className="btn btn-primary">Save</button>}
                        </div>
                        <div className="col">
                            <button type="button" className="btn btn-primary" onClick={() => { history.push("/")}}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
export default Form;