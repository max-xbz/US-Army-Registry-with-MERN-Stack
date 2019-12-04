import React from 'react';
class Search extends React.Component {
    constructor (props) {
        super(props);
        this.input = React.createRef();
    }
    onChange = (e) => {
        let term = this.input.current.value;
        this.props.performSearch(term);
    }
    render () {
        const { term } = this.props;
        return (
            <div className="search">
                <form>
                    <div className="form-row">
                        <label className="col-md-1 col-form-label">Search: </label>
                        <div className="col-md-2">
                            <input type="text" className="form-control" value={term} ref={this.input} onChange={this.onChange}/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Search;