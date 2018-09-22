import React, { Component } from 'react';
import { writeMultipleRanges } from '../helpers/spreadsheet'
import { Modal } from 'antd';


class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            style: false,

        };
        this.prepareCategoriesForRender = this.prepareCategoriesForRender.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(categoryId, categoryTitle) {
        this.setState({ categoryId, categoryTitle }, () => {
            var { start, end } = this.props.range
            writeMultipleRanges(`Sheet2!X${start}:Y${end}`, [this.state.categoryTitle, this.state.categoryId], end - start + 1, 'COLUMNS')
        })
        this.setState({style:true})
        this.showModal()
    }
    prepareCategoriesForRender(categories, margin) {
        margin = margin + 30
        var renderedCategories = categories.children.map((category) => {
            var children = '';
            if (category.children && category.children.length > 0) {
                children = this.prepareCategoriesForRender(category, margin)
            }
            return (<div style={{ fontSize: 30 }}>
                <form key={category.id}>
                    <div style={{ size: "0.8em", marginLeft: margin }}>
                        <label>
                            <input type="radio"
                                value={category.id}
                                checked={this.state.categoryId === category.id}
                                onChange={this.handleChange.bind(this, category.id, category.title)}
                            />
                            {category.title}
                        </label>
                    </div>
                </form>
                {children}
            </div>)
        })
        return renderedCategories
    }
    showModal() {
        this.setState({ showModal: !this.state.showModal })
    }
    render() {
        var value = this.props.value
        if (value === 'empty') {
            value = ''
        }
        var style = { backgroundColor: 'white' }
        if (this.state.style) {
            style = { backgroundColor: 'gray'}
        }
        var categories = this.props.categories;
        var renderedCategories = this.prepareCategoriesForRender(categories, -30)
        return (
            <td style={style}>
                {this.state.categoryTitle ? this.state.categoryTitle : value}
                <Modal
                    title={'Select Category'}
                    visible={this.state.showModal}
                    onCancel={this.showModal}
                >
                    {
                        <div>
                            {renderedCategories}
                        </div>
                    }
                </Modal>
                <div>
                    <button onClick={this.showModal}>Show category list</button>
                </div>
            </td>)

    }
}
export default Categories;