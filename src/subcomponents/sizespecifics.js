import React, { Component } from 'react';

class SizeSpecifics extends Component {
    render() {
        var data
        if (this.props.stateImages[this.props.index]) {
            data = this.props.stateImages[this.props.index]
        } else {
            data = this.props.data
        }
        return (
            <td >
                {data}
            </td>
        )
    }
}
export default SizeSpecifics;