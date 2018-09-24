import React, { Component } from 'react';
import { UrlCell, ColorsCell, SizeCell, FinishedButton, Img, ProductName, SizeSpecifics, Categories } from './index';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            sizes: [],
        };
        this.setRendered = this.setRendered.bind(this);
    }
    setRendered(scrapImgArr, key) {
        const arrayOfEmpty = Array(9 - scrapImgArr.length).fill('empty')
        let fillArray = [];
        if (scrapImgArr.length) {
            fillArray = [...scrapImgArr, ...fillArray]
        } else {
            fillArray = arrayOfEmpty;
        }
        this.setState({ [key]: fillArray })
    }
    render() {
        var productName = 'empty'
        var {
            row,
            columnGroupEndRows,
            columnGroupIndex,
            sheetRowLessOne,
            showAll,
            sizes
        } = this.props.propsObj;

        const rowFill = row.map((cell, index) => {
            if (index === 2) {
                productName = cell
            }
            if (cell === 'empty') {
                cell = '–'
            }
            if (
                index === 0 ||
                index === 1 ||
                index === 2 ||
                index === 3 ||
                //index === 4 ||
                index === 5 ||
                index === 6 ||
                index === 7 ||
                index === 8 ||
                index === 9 ||
                index === 14 ||
                index === 15 ||
                index === 16 ||
                index === 17 ||
                index === 18 ||
                index === 19 ||
                index === 20 ||
                index === 21
            ) {
                if (index > 13) {
                    return (
                        <React.Fragment>
                            <Img data={cell} stateImages={this.state.images} index={index - 14} />
                        </React.Fragment>
                    )
                } else if (index === 6) {
                    return (
                        <React.Fragment key={'Fragment' + index + '' + sheetRowLessOne}>
                            {showAll && <SizeCell
                                data={sizes}
                                range={sheetRowLessOne + 1}
                                setRenderedSizes={this.setRendered}
                                productName={productName}
                            />}
                            {!showAll && <UrlCell
                                data={cell}
                                range={{ start: sheetRowLessOne + 1, end: columnGroupEndRows[columnGroupIndex] }}
                                setRenderedUrls={this.setRendered}
                            />}
                            <FinishedButton row={sheetRowLessOne + 1} />
                            {!showAll &&
                                <Categories
                                    categories={this.props.categories}
                                    value={row[23]}
                                    objString={row[24]}
                                    range={{ start: sheetRowLessOne + 1, end: columnGroupEndRows[columnGroupIndex] }}
                                />}
                        </React.Fragment>
                    )
                } else if (index === 5 && !showAll) {
                    return (<ColorsCell key={'colorsCell' + index} data={cell} range={{ start: sheetRowLessOne + 1, end: columnGroupEndRows[columnGroupIndex] }} />)
                } else if (index === 2) {
                    return (<ProductName row={sheetRowLessOne + 1} data={cell} key={'ProductName' + sheetRowLessOne} />)
                } else if (index > 6 && index < 10) {
                    return (<SizeSpecifics data={cell} stateImages={this.state.sizes} index={index - 7} />)
                }
                return (<td key={index}>{cell}</td>)
            }
            return undefined
        }).filter((a) => typeof a !== 'undefined');
        return (
            <tr key={rowFill[1]['props']['children'] + sheetRowLessOne}>
                <td >{sheetRowLessOne + 1}</td>
                {rowFill}
            </tr>)
    }
}
export default Row;