
import React, { Component } from 'react';
import { writeMultipleRanges } from '../helpers/spreadsheet'
import Popup from "reactjs-popup";

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
         
        };
        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);   
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
        if (operation === 'submit') {
                this.onSubmit()
        }
    }
    onSubmit() {
        var { firstLevelSubmit, secondLevelSubmit, thirdLevelSubmit } = this.state;
        writeMultipleRanges(`Sheet2!H${this.props.range}:J${this.props.range}`, [firstLevelSubmit, secondLevelSubmit, thirdLevelSubmit], 1, 'COLUMNS')
        const arrayOfEmpty = Array(6).fill('empty')
        const fillArray = [firstLevelSubmit, secondLevelSubmit, thirdLevelSubmit, ...arrayOfEmpty]
        this.props.setRenderedImages(fillArray, 'sizes');
    }
    handleChange(params, event) {
        this.setState({ [params.key]: event.target.value })
        if(params.value){
            var thirdLevelSubmit=JSON.stringify(params.value.value.cs)
            thirdLevelSubmit=thirdLevelSubmit.replace(/\"/g, "")
            thirdLevelSubmit=thirdLevelSubmit.replace("{", "")
            thirdLevelSubmit=thirdLevelSubmit.replace("}", "")
            this.setState({thirdLevelSubmit:thirdLevelSubmit})
        }
    }
    render() {
        const firstLevelSorted=this.props.data.map((level)=>level.title).sort()
        const firstLevelTitles = firstLevelSorted.map((level, index) => {
            return (
                <form key={'firstLevel' + index}>
                    <div>
                        <label>
                            <input type="radio"
                                value={level}
                                checked={this.state.firstLevelSubmit === level}
                                onChange={this.handleChange.bind(this, {key:'firstLevelSubmit'})}
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
                let thirdLevelShowed=JSON.stringify(level.value.cs).replace(/\"/g, "")
                thirdLevelShowed=thirdLevelShowed.replace('{',"")
                thirdLevelShowed=thirdLevelShowed.replace('}',"")
                return (
                    <div>
                        <form key={'secondLevel' + index}>
                            <div>
                                <label>
                                    <input type="radio"
                                        value={level.title}
                                        checked={this.state.secondLevelSubmit === level.title}
                                        onChange={this.handleChange.bind(this, {key:'secondLevelSubmit',value:level})}
                                    />
                                    {level.title}
                                </label>
                            </div>
                        </form>
                          {thirdLevelShowed} 
                    </div>
                )
            })
        }

        return (
            <td >
                <Popup className='popup' trigger={<button> Sizes</button>} position="right center">
                    {
                        <div className='popup'>
                            {(this.state.showButtons === 1) && firstLevelTitles}
                            {(this.state.showButtons === 2) && secondLevelTitles}
                     
                            {(this.state.showButtons > 1) && (
                                <button onClick={this.onClick.bind(this, '-', )}>
                                    {'<<<'}previous
                                </button>)}
                            {(this.state.showButtons < 2) && (
                                <button onClick={this.onClick.bind(this, '+')}>
                                    next >>>
                                </button>)}
                            {(this.state.showButtons === 2) && (
                                <button onClick={this.onClick.bind(this, 'submit')}>
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
