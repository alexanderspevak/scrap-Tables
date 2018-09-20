import React, { Component } from 'react';

import { Redirect } from 'react-router-dom'

class  HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        }
        this.onClick=this.onClick.bind(this);
    }
    onClick(){
        this.setState({redirect:true})
    }
    render() {
        return (
            <div>
                <h1>Welcome!</h1>
                <button onClick={this.onClick}>
                    start working
                </button>
                {this.state.redirect&&<Redirect to='/colors/1'/>}
            </div>
        )
    }
}

export default HomePage