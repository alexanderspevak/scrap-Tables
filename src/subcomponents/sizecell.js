import React, { Component } from 'react';
import { writeMultipleRanges } from '../helpers/spreadsheet'
import { Modal, Button } from 'antd';
import { Consumer } from '../context/context';

class ClickCellSize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLevelSubmit: 'empty',
            secondLevelSubmit: 'empty',
            thirdLevelSubmit: 'empty',
            showButtons: 1,
            inputValue: '',
            cellValue: this.props.data,
            value: '',
            showModal: false,
            visitedCell: false
        };
        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showModal = this.showModal.bind(this)
    }
    showModal(style) {
        this.setState({ showModal: !this.state.showModal })
    }
    onClick(operation) {
        if (operation === '+') {
            this.setState({ showButtons: this.state.showButtons + 1 }, () => {
            })
        }
        if (operation === '-') {
            this.setState({ showButtons: this.state.showButtons - 1 })
            if (this.state.thirdLevelSubmit !== 'empty') {
                this.setState({ thirdLevelSubmit: 'empty' })
            } else {
                this.setState({ secondLevelSubmit: 'empty' })
            }
        }
    }
    onSubmit() {
        var { firstLevelSubmit, secondLevelSubmit, thirdLevelSubmit } = this.state;
        writeMultipleRanges(`Sheet2!H${this.props.range}:J${this.props.range}`, [firstLevelSubmit, secondLevelSubmit, thirdLevelSubmit], 1, 'COLUMNS')
        const arrayOfEmpty = Array(6).fill('empty')
        const fillArray = [firstLevelSubmit, secondLevelSubmit, thirdLevelSubmit, ...arrayOfEmpty]
        this.props.setRenderedSizes(fillArray, 'sizes');
        this.setState({ showModal: false, visitedCell: true })

    }
    handleChange(params, event) {
        this.setState({ [params.key]: event.target.value })
        if (params.value) {
            var thirdLevelSubmit = JSON.stringify(params.value.value.cs)
            thirdLevelSubmit = thirdLevelSubmit.replace(/\"/g, "")
            thirdLevelSubmit = thirdLevelSubmit.replace("{", "")
            thirdLevelSubmit = thirdLevelSubmit.replace("}", "")
            this.setState({ thirdLevelSubmit: thirdLevelSubmit }, () => {
                params.actions(params.key,this.props.range.start)
                this.onSubmit()
            })
        }
    }
    render() {
        const firstLevelSorted = this.props.data.map((level) => level.title).sort()
        const firstLevelTitles = firstLevelSorted.map((level, index) => {
            return (
                <form key={'firstLevel' + index}>
                    <div>
                        <label>
                            <input type="radio"
                                value={level}
                                checked={this.state.firstLevelSubmit === level}
                                onChange={this.handleChange.bind(this, { key: 'firstLevelSubmit' })}
                            />
                            {level}
                        </label>
                    </div>
                </form>
            )
        })
        const secondLevel = this.props.data.filter((level) => {
            return level.title === this.state.firstLevelSubmit
        })
        var secondLevelTitles = (<div>empty</div>)
        if (secondLevel.length > 0) {
            secondLevelTitles = secondLevel[0].values.map((level, index) => {
                let thirdLevelShowed = JSON.stringify(level.value.cs).replace(/\"/g, "")
                thirdLevelShowed = thirdLevelShowed.replace('{', "")
                thirdLevelShowed = thirdLevelShowed.replace('}', "")
                return (
                    <Consumer>
                        {({ actions, state }) => {
                            if (state.sizeCellRow === this.props.range.start) {
                                var style = { backgroundColor: '#FFFFE0' }
                            } else {
                                var style = { backgroundColor: 'white' }
                            }
                            return (
                                <div>
                                    <form key={'secondLevel' + index}>
                                        <div>
                                            <label>
                                                <input type="radio"
                                                    value={level.title}
                                                    checked={this.state.secondLevelSubmit === level.title}
                                                    onChange={this.handleChange.bind(this, { key: 'secondLevelSubmit', value: level,actions:actions.setStyle,key:'sizeCellRow' })}
                                                />
                                                <span style={{ fontWeight: "bold" }}>{level.title}:</span>{thirdLevelShowed}
                                            </label>
                                        </div>
                                    </form>
                                </div>
                            )
                        }
                        }
                    </Consumer>
                )
            })
        }
        var style = (this.state.visitedCell ? { backgroundColor: "#FFFFE0" } : { backgroundColor: 'white' })
        var productName = this.props.productName
        if (this.state.firstLevelSubmit !== 'empty') {
            productName = (
                <div>
                    <h3>{this.props.productName}</h3>
                    <h5>{this.state.firstLevelSubmit}</h5>
                </div>)
        }
        return (
            <td style={style}>
                <Modal
                    title={productName}
                    visible={this.state.showModal}
                    onCancel={this.showModal}
                    footer={[
                        (this.state.showButtons > 1) &&
                        <Button key="previous" type="primary" onClick={this.onClick.bind(this, '-')}>
                            {'<<<'}previous
                        </Button>,
                        (this.state.showButtons < 2) &&
                        <Button key="next" type="primary" onClick={this.onClick.bind(this, '+')}>
                            next >>>
                        </Button>,

                    ]}
                >
                    {
                        <div>
                            {(this.state.showButtons === 1) && firstLevelTitles}
                            {(this.state.showButtons === 2) && secondLevelTitles}
                        </div>
                    }
                </Modal>
                <button onClick={this.showModal.bind(this)}> Select Sizes</button>
            </td>
        )
    }
}
export default ClickCellSize;
