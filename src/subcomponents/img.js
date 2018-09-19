import React, { Component } from 'react';

class Img extends Component {
    render() {
        var data
        if (this.props.stateImages[this.props.index]) {
            data = this.props.stateImages[this.props.index]
        } else {
            data = this.props.data
        }
        return (
            <td >
                <img src={data} alt={data} style={{ width: "100px" }} />
            </td>
        )
    }
}
export default Img;