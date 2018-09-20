import React, { Component } from 'react';
import App from './App.js';
import HomePage from './homepage'
import { client, sizeQuery } from './apollo/client&queries'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sizes: [],
        }
    }
    componentDidMount() {
        client
            .query({
                query: sizeQuery
            })
            .then(result => {

                var sizes = result.data.attributes.filter((attribute) => {
                    return attribute.tags.filter((tag) => {
                        return tag === 'size'
                    })[0] === 'size'
                });
                this.setState({ sizes })
            });
    }
    render() {
        return (
            <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route 
                            path="/:colorsSizes/:userId"
                            render={(props) => <App {...props} sizes={this.state.sizes} />}
                        />
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default Main