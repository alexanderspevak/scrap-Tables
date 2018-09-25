import React, { Component } from 'react';
import { write } from '../helpers/spreadsheet';
import { Consumer } from '../context/context';

class ProductName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            data: this.props.data,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onSubmit(key,callback,e) {
        callback(key,this.props.row)
        e.preventDefault();
        let row = this.props.row
        write(`Sheet2!C${row}:C${row}`, this.state.value)
        this.setState({ data: this.state.value, style: '#FFFFE0' })

    }
    handleChange(event) {
        this.setState({ value: event.target.value })
    }
    render() {
        return (
            <Consumer>
                {({ state, actions }) => {
                    if (state.productNameRow === this.props.row) {
                        var style = { backgroundColor: '#FFFFE0' }
                    } else {
                        var style = { backgroundColor: 'white' }
                    }
                    return (
                        <td style={style}>
                            {this.state.data}
                            <form onSubmit={this.onSubmit.bind(this,'productNameRow',actions.setStyle)}>
                                <label>
                                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                                </label>
                                <input type="submit" value="Submit" />
                            </form>
                        </td>
                    )
                }}

            </Consumer>
        )
    }
}
export default ProductName;