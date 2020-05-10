import React, { Component } from 'react';
import Home from './components/Home'
import { Switch, Route, withRouter, HashRouter } from 'react-router-dom'
// // import CardHomepage from './components/CardHomepage'
// import World from './components/World'
// import Politics from './components/Politics'
import Navigation from './components/Navigation'
import Article from './components/Article'
import Favorites from './components/Favorites'
import Search from './components/Search'
import { api_base_endpoint } from './Data'
// import { Container } from 'react-bootstrap'
import { DataProvider } from './components/DataContext'

// https://content.guardianapis.com/%5bSECTION_NAME%5d?api-key=%9b43aac5-1512-409b-b17c-8247ebb93f10&show-blocks=all
// https://api.nytimes.com/svc/topstories/v2/world.json?api-key=%5bYOUR_API_KEY%5d
// world, politics, business, technology, sports

import './App.css'



const NYTimes_map = { 
  "/World": "world",
  "/Politics":"politics", 
  "/Business":"business",
  "/Technology": "technology",
  "/Sports": "sports"
};

const Guardian_map = { 
  "/World": "world",
  "/Politics":"politics", 
  "/Business":"business",
  "/Technology": "technology",
  "/Sports": "sport"
};

class App extends Component{
  
  constructor() {
    super() 

    let savedSource = localStorage.getItem('source')
    let source 
    if ( savedSource !== null ){
        // console.log(savedSource)
        source = savedSource
        // savedSource === "Guardian" ? this.setState({checked: true}) : this.setState({checked: false})          
    }
    else{
      localStorage.setItem('source', 'Guardian')
      source = "Guardian"
    }

    this.state = {
      news: [],
      source: source,
      path: null,
      asyncKey: 0,
      svalue: '',
    }

  }

  

  componentDidMount() {
    
    console.log(this.props.location.pathname)
    let path = this.props.location.pathname
    this.setState({path: this.props.location.pathname})
    this.switchChange(this.state.source, path)
  }

  switchChange = (source, path) => {
    // let path = this.props.location.pathname
    // console.log("From swithChange... "+path)
    // console.log("From swithChange... "+this.state.path)
    // console.log("Path: ", path)
    // this.setState({source})

    // path = this.props.location.pathname
    if(path === "/"){
      if (source === "NYTimes"){
        console.log("NYTimes data fetching... Category: /")
        this.setState({source: "Loding"})
        fetch(`${api_base_endpoint}?source=nytimes`)
            .then(data => data.json())
            .then(data => {
                this.setState({news: data.results.slice(0,10), source: "NYTimes"})
                // console.log(this.state)
            })
            .catch(err => console.log(err))
      }
      else if ( source === "Guardian") {
        console.log("Gaurdian data fetching... Category: /")
        this.setState({source: "Loding"})
        fetch(`${api_base_endpoint}?source=guardian`)
            .then(data => data.json())
            .then(data => {
                this.setState({news: data.response.results.slice(0,10), source: "Guardian"})
                // console.log(this.state)
            })
            .catch(err => console.log(err))
      }
    }
    else if ( ! (path === "/article" || path === "/favorites" || path === "/search") ) {
      if (source === "NYTimes"){
        let category = NYTimes_map[path]
        // console.log(path + " "+category)
        console.log("NYTimes data fetching... Category: ", category)
        this.setState({source: "Loding"})
        fetch(`${api_base_endpoint}?source=nytimes&section=${category}`)
            .then(data => data.json())
            .then(data => {
                this.setState({news: data.results.slice(0,10), source: "NYTimes"})
                // console.log(this.state)
            })
            .catch(err => console.log(err))
      }
      else if (source === "Guardian") {
        let category = Guardian_map[path]
        // console.log(category)
        console.log("Gaurdian data fetching... Category: ", category)
        this.setState({source: "Loding"})
        fetch(`${api_base_endpoint}?source=guardian&section=${category}`)
            .then(data => data.json())
            .then(data => {
                this.setState({news: data.response.results.slice(0,10), source: "Guardian"})
                // console.log(this.state)
            })
            .catch(err => console.log(err))
      }
    }

  }



  pathChangeHandler = (path) => {
    console.log("Path changed... "+ path)
    this.setState({path: path})
    this.switchChange(this.state.source, path)
  }
  
  newPathChangeHandler = (path) => e => {
    console.log("Path changed... "+ path)
    // this.setState({path: path})
    this.switchChange(this.state.source, path)
  }

  // updateAsyncKey = () => {
  //   this.setState({asyncKey: this.state.asyncKey+1})
  // }

  // componentWillUpdate(){
  //   console.log("XXX app updated...")
  // }
  

  render(){
    
    return (
      <DataProvider>
        <HashRouter>
        <div className="App">
          {/* {this.state.path} */}
            <Navigation switchProp={this.switchChange} pathChange={this.pathChangeHandler} path={this.state.path} asyncKey={this.state.asyncKey} svalue={this.state.svalue} />
            <Switch>
              {/* <Route path="/" component={ () => <Home fetched_news={this.state.news} source={this.state.source} />} exact /> */}
              <Route path="/(|World|Politics|Business|Technology|Sports)" component={ () => <Home fetched_news={this.state.news} source={this.state.source} pathChange={this.pathChangeHandler} /> } exact />
              {/* <Route path="/Politics" component={ () => <Home fetched_news={this.state.news} source={this.state.source} />} exact /> */}
              <Route path="/article" component={() => <Article updateSearchBar={()=>this.setState({ asyncKey: this.state.asyncKey+1 })}  />}  />
              <Route path="/favorites" component={() => <Favorites  />} />
              <Route path="/search" component={() => <Search  source={this.state.source} />} />
            </Switch>
            
        </div>
        </HashRouter>
      </DataProvider>
    );
  }
}

export default withRouter(App);
