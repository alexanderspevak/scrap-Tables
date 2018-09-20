import React, { Component } from 'react';

class Img extends Component {
    render() {
        var data
        if (this.props.stateImages[this.props.index]) {
            data = this.props.stateImages[this.props.index];
        } else {
            data = this.props.data;
        }
        var checker=true
        if(data==='–'||data==='empty'){
            checker=false
        }
        return (
            <td >
                {checker?<img src={data} alt={data} style={{ width: "100px" }}/>:'–'}
            </td>
        )
    }
}
export default Img;