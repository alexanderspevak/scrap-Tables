import React, { Component } from 'react';
import App from './App.js';
import HomePage from './homepage'
import { client, sizeQuery, client2, attributesQuery } from './apollo/client&queries'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from './context/context';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sizes: [],
            categories: [],
            styles: {
                colorCellRow: 0,
                productNameRow:0,
                urlCellRow:0,
                categoriesCellRow:0,
                sizeCellRow:0
            }
        }
        this.arrangeCategories = this.arrangeCategories.bind(this);
    }
    arrangeCategories(parentId, arr, obj) {
        var filteredArray = []
        if (!parentId) {
            filteredArray = arr.filter((item) => {
                return !item.parentCategory;
            })
        } else {
            filteredArray = arr.filter((item) => {
                if (item.parentCategory) {
                    return item.parentCategory.id === parentId;
                }
                return false;

            })
        }
        if (filteredArray.length > 0) {
            obj.children = filteredArray.map((item) => {
                return { id: item.id, parentCategory: item.parentCategory, title: item.title }
            })
            var justArray = obj.children.map((child) => {
                this.arrangeCategories(child.id, arr, child)
                return false;
            })
        }
        return obj
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
            })
            .catch(err => { console.log(' error', err) });
        client2
            .query({
                query: attributesQuery
            })
            .then(result => {

                const categories = result.data.categories;
                this.setState({ categories: this.arrangeCategories(null, categories, {}) })
            })
            .catch(err => { console.log(' error', err) })
    }
    render() {
        return (
            <Provider value={{
                state: this.state.styles,
                actions: {
                    setStyle: (key,rowRef )=> {
                        this.setState(prevState => ({
                            styles: {
                                ...prevState.styles,
                                [key]: rowRef
                            }
                        }))
                    }
                }
            }}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route
                            path="/:colorsSizes/:userId"
                            render={(props) => <App {...props} sizes={this.state.sizes} categories={this.state.categories} />}
                        />
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}
export default Main