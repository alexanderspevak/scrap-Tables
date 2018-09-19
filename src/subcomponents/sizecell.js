
import React, { Component } from 'react';
import { writeMultipleRanges } from '../helpers/spreadsheet'
import Popup from "reactjs-popup";

class ClickCellSize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLevelTitle: 'empty',
            secondLevelTitle: 'empty',
            thirdLevelTitle: 'empty',
            showButtons: 1,
            inputValue: '',
            cellValue: this.props.data,
            value: ''
        };
        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onClick(operation, thirdLevelTitle) {
        if (operation === '+') {
            this.setState({ showButtons: this.state.showButtons + 1 }, () => {
            })
        }
        if (operation === '-') {
            this.setState({ showButtons: this.state.showButtons - 1 })
            if (this.state.thirdLevelTitle !== 'empty') {
                this.setState({ thirdLevelTitle: 'empty' })
            } else {
                this.setState({ secondLevelTitle: 'empty' })
            }
        }
        if (operation === 'submit') {
            this.setState({ thirdLevelTitle }, () => {
                this.onSubmit()
            })
        }
    }
    onSubmit() {
        var { firstLevelTitle, secondLevelTitle, thirdLevelTitle } = this.state;
        writeMultipleRanges(`Sheet2!H${this.props.range}:J${this.props.range}`, [firstLevelTitle, secondLevelTitle, thirdLevelTitle], 1, 'COLUMNS')
        
        const arrayOfEmpty = Array(6).fill('empty')
        const fillArray = [firstLevelTitle,secondLevelTitle,thirdLevelTitle, ...arrayOfEmpty]
        this.props.setImages(fillArray,'sizes');
    }
    handleChange(key, event) {
        this.setState({ [key]: event.target.value })
    }
    render() {
        const firstLevelTitles = this.props.data.map((level, index) => {
            return (
            <form key={'firstLevel'+index}>
                <div>
                    <label>
                        <input type="radio"
                            value={level.title}
                            checked={this.state.firstLevelTitle === level.title}
                            onChange={this.handleChange.bind(this, 'firstLevelTitle')}
                        />
                        {level.title}
                    </label>
                </div>
            </form>
            )
        })
        const secondLevel = this.props.data.filter((level) => {
            return level.title === this.state.firstLevelTitle
        })
        var secondLevelTitles = (<div>empty</div>)
        if (secondLevel.length > 0) {
            secondLevelTitles = secondLevel[0].values.map((level, index) => {
                return (
                    <form key={'secondLevel'+index}>
                        <div>
                            <label>
                                <input type="radio"
                                    value={level.title}
                                    checked={this.state.secondLevelTitle === level.title}
                                    onChange={this.handleChange.bind(this, 'secondLevelTitle')}
                                />
                                {level.title}
                            </label>
                        </div>
                    </form>)
            })
        }
        if (this.state.secondLevelTitle !== 'empty') {
            var thirdLevel = secondLevel[0].values.filter((level) => {
                return level.title === this.state.secondLevelTitle
            })[0].value.cs
            var thirdLevelRender = '';
            for (var p in thirdLevel) {
                if (thirdLevel.hasOwnProperty(p)) {
                    thirdLevelRender += p + ' : ' + thirdLevel[p] + ', '
                }
            }
        } else {
            thirdLevelRender = 'empty';
        }
        return (
            <td onClick={this.onClick}>
                <Popup trigger={<button> Sizes</button>} position="right center">
                    {
                        <div>
                            {(this.state.showButtons === 1) && firstLevelTitles}
                            {(this.state.showButtons === 2) && secondLevelTitles}
                            {(this.state.showButtons === 3) && thirdLevelRender}
                            {(this.state.showButtons > 1) && (
                                <button onClick={this.onClick.bind(this, '-', )}>
                                    {'<<<'}previous
                                </button>)}
                            {(this.state.showButtons < 3) && (
                                <button onClick={this.onClick.bind(this, '+')}>
                                    next >>>
                                </button>)}
                            {(this.state.showButtons === 3) && (
                                <button onClick={this.onClick.bind(this, 'submit', thirdLevelRender)}>
                                    submit
                                </button>)}
                        </div>
                    }
                </Popup>
            </td>
        )
    }
}
export default ClickCellSize;
