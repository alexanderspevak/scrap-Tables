import React, { Component } from 'react';
import {write } from '../helpers/spreadsheet'


class FinishedButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className:'unClickedButton'
        };
        this.onSubmit=this.onSubmit.bind(this)
    }
    onSubmit(){
        let row=this.props.row
        write(`Sheet2!AA${row}:AA${row}`,'finished')
        this.setState({className:'clickedButton'})
      }

    render() {
        return (
            <td>
                <button onClick={this.onSubmit} className={this.state.className}>finished</button>
            </td>
        )
    }
}
export default FinishedButton;