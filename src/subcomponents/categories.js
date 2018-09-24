import React, { Component } from 'react';
import { writeMultipleRanges } from '../helpers/spreadsheet'
import { Modal, Checkbox } from 'antd';


class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            style: false,
            checked: {},
            sendValues: []
        };
        this.prepareCategoriesForRender = this.prepareCategoriesForRender.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onOk = this.onOk.bind(this)
    }

    onOk() {
        const { sendValues } = this.state;
        const { start, end } = this.props.range
        const idArr = sendValues.map(obj => {
            return Object.keys(obj)[0]
        })
        let titleString = sendValues.map((obj, index) => {
             return obj[idArr[index]]
        }).join('/')
        this.setState({ categoryTitle: titleString })
        let idTitleObjectsString = sendValues.reduce((previousValue, currentValue) => {
            return previousValue + '/' + JSON.stringify(currentValue)
        }, '')
        if(titleString===''){
            writeMultipleRanges(`Sheet2!X${start}:Y${end}`, ['empty', 'empty'], end - start + 1, 'COLUMNS')
            this.setState({categoryTitle:''})
        }else{
            writeMultipleRanges(`Sheet2!X${start}:Y${end}`, [titleString, idTitleObjectsString.substring(1)], end - start + 1, 'COLUMNS')
        }   
        this.setState({ style: true })
        this.showModal()
    }

    onChange(id, title) {
        if (this.state.checked[id]) {
            this.setState(prevState => ({
                checked: {
                    ...prevState.checked,
                    [id]: false
                }
            }))
            let newSendValues = [...this.state.sendValues]
            const idArr = newSendValues.map((obj) => Object.keys(obj)[0])
            let position = idArr.indexOf(id)
            if (position > -1) {
                newSendValues.splice(position, 1)
                this.setState({
                    sendValues: newSendValues
                })
            }
        } else {
            this.setState(prevState => ({
                checked: {
                    ...prevState.checked,
                    [id]: true
                }
            }), () => {
                if (this.state.checked[id]) {
                    this.setState(prevState => ({
                        sendValues: [...prevState.sendValues, ({ [id]: title })]
                    }))
                }
            })
        }
    }
    prepareCategoriesForRender(categories, margin) {
        margin = margin + 50
        var renderedCategories = categories.children.map((category) => {
            var children = '';
            if (category.children && category.children.length > 0) {
                children = this.prepareCategoriesForRender(category, margin)
            }
            return (<div style={{ lineHeight:0 }}>
                <form key={category.id}>
                    <div style={{ marginLeft: margin }}>
                        <Checkbox
                            onChange={this.onChange.bind(this, category.id, category.title)}
                            checked={this.state.checked[category.id]}
                        >
                            {category.title}
                        </Checkbox>
                    </div>
                </form>
                {children}
            </div>)
        })
        return renderedCategories
    }
    showModal() {
        if (this.props.objString !== 'empty' && this.state.sendValues.length === 0 && this.props.objString !== '') {
            const objArr = this.props.objString.split('/').map((objString) => JSON.parse(objString))
            let newChecked = {}
            for (var i = 0; i < objArr.length; i++) {
                const key = Object.keys(objArr[i])[0]
                newChecked[key] = true
            }
            this.setState({ checked: newChecked, sendValues: objArr })
        }

        this.setState({ showModal: !this.state.showModal })
    }
    render() {
        var value = this.props.value
        if (value === 'empty') {
            value = ''
        }
        var style = { backgroundColor: 'white' }
        if (this.state.style) {
            style = { backgroundColor: "#FFFFE0" }
        }
        var categories = this.props.categories;
        var renderedCategories = this.prepareCategoriesForRender(categories, -50)
        return (
            <td style={style}>
                {this.state.categoryTitle ? this.state.categoryTitle : value}
                <Modal
                    title={'Select Category'}
                    visible={this.state.showModal}
                    onCancel={this.showModal}
                    onOk={this.onOk}
                    width={1000}
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