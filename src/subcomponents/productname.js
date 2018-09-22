import React, { Component } from 'react';
import {write } from '../helpers/spreadsheet';

class ProductName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            data:this.props.data,
            style:'white'
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onSubmit(e){
        e.preventDefault();
        let row=this.props.row
        write(`Sheet2!C${row}:C${row}`,this.state.value)
        this.setState({data:this.state.value,style:'gray'})
        
      }
      handleChange(event) {
        this.setState({ value: event.target.value })
    }
    render() {
        var style={backgroundColor:this.state.style}
        return (
            <td style={style}>
                {this.state.data}
                <form onSubmit={this.onSubmit}>
                    <label>
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </td>
        )
    }
}
export default ProductName;