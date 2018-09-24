import React, { Component } from 'react';
import './App.css';
import config from './config.js'
import { load } from './helpers/spreadsheet'
import {  Row } from './subcomponents';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
      sizes: [],
      showAll: false,
      sheetRowsPerPage: 100,
      page: 1,
    };
  }
static getDerivedStateFromProps(nextProps, prevState){
  var showAll=nextProps.location.pathname.split('/')[1]==='sizes'?true:false
  var page=parseInt(nextProps.location.pathname.split('/')[2],10); 
  if(showAll!==prevState.showAll||page!==prevState.page){
    return { showAll,page};
 }
 else return null;
}
  componentDidMount() {
    window.gapi.load("client", this.initClient);
  }
  initClient = () => {
    // 2. Initialize the JavaScript client library.
    window.gapi.client
      .init({
        apiKey: config.apiKey,
        // Your API key will be automatically added to the Discovery Document URLs.
        discoveryDocs: config.discoveryDocs,
        clientId: config.clientId,
        scope: config.scope
      })
      .then(() => {
        var auth = window.gapi.auth2.getAuthInstance().signIn();
        this.setState({ auth })
        // 3. Initialize and make the API request.
        load(this.onLoad);
      });
  };
  onLoad = (data, error) => {
    if (data) {
      this.setState({ data });
    } else {
      this.setState({ error });
    }
  };
  showAll() {
    var colorsSizes=this.state.showAll?'colors':'sizes'
    var url=`/${colorsSizes}/${this.state.page}`
    this.props.history.push(url)
  }
  setPage(page){
    var colorsSizes=this.state.showAll?'sizes':'colors'
    var url=`/${colorsSizes}/${page}`
    this.props.history.push(url)
  }
  render() {
    var prevRowKod
    var columnGroupIndex = -1;
    const { data, error } = this.state;
    var columnGroupEndRows = data.map((row, rowNumber) => {
      if (row[0] !== prevRowKod) {
        prevRowKod = row[0]
        return rowNumber
      }
      return undefined
    }).filter((a) => a)
    columnGroupEndRows.push(6765)
    prevRowKod = null
    const tableFill = data.map((row, sheetRowLessOne) => {
        if ((row[0] !== prevRowKod) || this.state.showAll) {
          columnGroupIndex++
          prevRowKod = row[0]
          var finishedSelector=row.filter((cell)=>{
            return cell==='finished'
          })[0]
         if(!finishedSelector){
          var propsObj={
            row,
            sheetRowLessOne,
            columnGroupEndRows,
            columnGroupIndex,
            showAll:this.state.showAll,
            sizes:this.props.sizes
          }
          return (
              <Row propsObj={propsObj} key={'Row'+sheetRowLessOne+prevRowKod} categories={this.props.categories}/>
            )
        }
        return undefined;
      }
      return undefined
    }).filter((a) => typeof a !== 'undefined')
    let paginatedTableFill=tableFill.slice((this.state.page-1)*this.state.sheetRowsPerPage,this.state.page *this.state.sheetRowsPerPage)
    var paginationItemsCount=Math.ceil(tableFill.length/this.state.sheetRowsPerPage)
    var paginationItems=[...Array(paginationItemsCount)].map((_ , index)=>{
      return (
      <li 
        key={'li'+index} 
        className={this.state.page===index+1?"pagination selected":"pagination"} 
        onClick={this.setPage.bind(this,index+1)}>{index+1}
      </li>)
    })
    if (error) {
      return <div>{this.state.error}</div>;
    }
    return (
      <div>
        <button 
          onClick={this.showAll.bind(this)}
        >
          {this.state.showAll ? 'switch to colors and pictures' : 'switch to sizes'}   
        </button>
        <table key={'main table'}>
          <tbody key={'tbody'}>
            {paginatedTableFill}
          </tbody>
        </table>
        <div>
           <ul>{paginationItems}</ul>
        </div>
      </div>
    );
  }
}
export default App;
