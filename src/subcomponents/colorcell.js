import React, { Component } from 'react';
import {writeMultipleRanges } from '../helpers/spreadsheet'


class ClickCellColor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            inputValue: '',
            cellValue: this.props.data,
            style:'white'
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onSubmit(event) {
        var re=/(red|green|blue|pink|yellow|black|white|gray|red|purple|orange|brown)/
        var testString=this.state.inputValue.toLowerCase().split(',').reduce((accumulator,currentValue)=>{
            return accumulator&&re.test(currentValue)
        },true)
        if(testString){
            this.setState({cellValue:this.state.inputValue, style:'gray'})
            var { start, end } = this.props.range
                writeMultipleRanges(`Sheet2!F${start}:F${end}`, [this.state.inputValue], end - start + 1,'COLUMNS')
        }else{
            alert('valid colors are red,green,blue,pink,yellow,white,gray,red,purple separated by coma');
        }
        event.preventDefault();
    }
    handleChange(event) {
        this.setState({ inputValue  : event.target.value })
        event.preventDefault();
    }
    render() {
        var value=this.state.cellValue;
        if(value='empty'){
            value='—'
        }
        var style={backgroundColor:this.state.style}
        return (
            
        <td style={style}>
            {this.state.cellValue}
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
export default ClickCellColor;