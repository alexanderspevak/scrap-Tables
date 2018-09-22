import React, { Component } from 'react';
import {  writeMultipleRanges } from '../helpers/spreadsheet'
import axios from 'axios';

class UrlCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            style:'white'
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onSubmit(event) {
        var { start, end } = this.props.range
        if (this.state.value.includes('http://www.basket-obchod.cz/')) {
            writeMultipleRanges(`Sheet2!G${start}:G${end}`, [this.state.value], end - start + 1,'COLUMNS')
            this.setState({ show: false,style:'gray' })
            axios.get(`http://basketobchod-basketobchod.a3c1.starter-us-west-1.openshiftapps.com/test/params?ref=${this.state.value}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        const arrayOfEmpty = Array(9 - res.data.length).fill('empty')
                        const fillArray = [...res.data, ...arrayOfEmpty]
                        this.props.setRenderedUrls(fillArray,'images');
                        writeMultipleRanges(`Sheet2!$O${start}:W${end}`, fillArray, end - start + 1,'COLUMNS')
                    } else {
                        alert('invalid response from server')
                    }
                })
        } else {
            alert('invalid input')
        }
        event.preventDefault();
    }
    handleChange(event) {
        this.setState({ value: event.target.value })
        event.preventDefault();
    }
    render() {
        const checker=this.props.data==='–'
        var style={backgroundColor:this.state.style}
        return (
        <td style={style}>
            {<div style={{ width: 250, height: 76, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
               {checker?'–':<a href={this.props.data} target="_blank">{this.props.data}</a>}
            </div>}
                <form onSubmit={this.onSubmit}>
                    <label>
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit product link" />
                </form>
        </td>)
    }
}
export default UrlCell;