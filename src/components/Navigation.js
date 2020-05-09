import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import Switch from "react-switch";
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import AsyncSelect from 'react-select/async'
import { Link, withRouter } from 'react-router-dom'
// import {DebounceInput} from 'react-debounce-input';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip'
import {azureBaseUrl, azureKey} from '../Data'
// import AsyncSearch from './AsyncSearch';

// import { DataContext } from './DataContext';

let options = [
    // { value: 'chocolate', label: 'Chocolate' },
    // { value: 'strawberry', label: 'Strawberry' },
    // { value: 'vanilla', label: 'Vanilla' }
  ]



class Navigation extends Component {
    _mounted = false
    constructor(props){
        super(props);

        let savedSource = localStorage.getItem('source')

        this.state = { 
            checked: savedSource === "Guardian" ? true : false , 
            value: '',
            asyncKey: 0,
        
        };




        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        this._mounted = true
        // ReactTooltip.rebuild()
        console.log("Nav Component mounterd...")     
        
        // let savedSource = localStorage.getItem('source')

        // if ( savedSource !== null ){
        //     console.log(savedSource)
        //     savedSource === "Guardian" ? this.setState({checked: true}) : this.setState({checked: false})          
        // }
        // else{
        //   localStorage.setItem('source', 'Guardian')
        //   this.setState({checked: true})
        // }

        // this.handleChange(this.state.checked)
    } 
    
    componentDidUpdate(previousProps, previousState){
        console.log("Nav Component did update...")
        ReactTooltip.rebuild()


        // if (this.state.value !== '') {
        //     console.log('navi condd..')
        //     if (this._mounted === true && this.props.location.pathname !== "/search"){
        //         this.setState({asyncKey: this.state.asyncKey+1})
        //     }
        // }

    }

    componentWillUnmount(){
        this._mounted = false
        // this.removeCommentBox();
    }
    
    handleChange(checked) {
        // checked = !checked
        // console.log("changes... ")
        // console.log(checked)
        this.setState({checked: checked})
        
        let source
        if (checked === false){
            source = "NYTimes"
            localStorage.setItem('source', source)
        }
        else{
            source = "Guardian"
            localStorage.setItem('source', source)
        }
        this.props.switchProp(source, this.props.path)
        this.setState({ checked });
    }

    urlChange = (path) => e => {
        this.setState({asyncKey: this.state.asyncKey+1})
        // this.setState({value: ''})
        console.log("url changed to: ", path)
        this.props.pathChange(path)
        
    }

    makeSearch = (v) => {
        // if (this.props.location.pathname !== "/search"){
        //     // this.setState({asyncKey: v.value})
        // }
        
        let source = this.state.checked ? "Guardian" : "NYTimes"
        console.log("Searching...", v.value, source)
        // this.urlChange("/search")()
        this.props.history.push(`/search?q=${v.value}&source=${source}`)
        // options = []
    }

    loadOptions = (inputValue, callback) => {
        console.log(inputValue)
            let suggestions = []
            fetch(azureBaseUrl+"?q="+inputValue,
                {
                    method: 'GET',
                    headers: {
                        'Ocp-Apim-Subscription-Key': azureKey
                    }
                }
            )
            .then( data => data.json() )
            .then( data => {
                // console.log(data.suggestionGroups[0].searchSuggestions)
                
                
                let m_d = data.suggestionGroups[0].searchSuggestions
                m_d.forEach(element => {
                    suggestions.push( { value: element.displayText, label: element.displayText } )
                });
    
                // console.log(suggestions)
                callback(suggestions)
                // return suggestions
                
            })
            .catch( err => console.log(err) )
        
        // callback([
        //     { value: 'chocolate', label: 'Chocolate' },
        //     { value: 'strawberry', label: 'Strawberry' },
        //     { value: 'vanilla', label: 'Vanilla' }
        //   ])
        
    
    }

    // inpChange = (v) => {
    //     this.setState({value: v})
    //     console.log(this.props.location.pathname)
    // }

    render() {
        ReactTooltip.rebuild()
        
        let currPath = this.props.location.pathname
        // console.log("Curpath: ",currPath)

        return (
            <div>
            <Navbar bg="" variant="dark" expand="lg" className="color-nav">

                
          
          <div className="nav-container">
                    <div style={{width: "20vw"}} className="search-bar">
                            {/* <DebounceInput                                
                                debounceTimeout={2000}
                                onChange={event => console.log({value: event.target.value})}
                                
                                element={ () =>  */}

                                {/* <AsyncSearch 
                                    asyncKey={this.state.asyncKey}
                                    checked={this.state.checked}
                                /> */}

                            {/* <DataContext.Consumer>
                            {
                                (context) =>  */}
                                <AsyncSelect
                                    // key={this.state.asyncKey}
                                    // key={context.state.asyncKey}
                                    cacheOptions={false}
                                    placeholder="Enter keyword .." 
                                    options={options} 
                                    // onInputChange={this.inpChange}
                                    // inputValue = { ''  }
                                    value = { this.props.location.pathname !== "/search" ? '' : undefined }
                                    // value = {  this.state.value  }
                                    loadOptions={_.debounce(this.loadOptions, 1090, {
                                        leading: true
                                    })
                                    
                                    } 
                                    onChange={this.makeSearch}
                                    />
                            {/* } */}
                            {/* </DataContext.Consumer> */}
                                
                                {/* // } */}
                                {/* //  /> */}
                        </div>
                        {/* <p>Value: {this.state.value}</p> */}
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        
            </div>
                        
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/" onClick={this.urlChange("/")} className={(currPath === "/") ? "active" : ""} >Home</Nav.Link>
                            <Nav.Link as={Link} to="/World" onClick={this.urlChange("/World")} className={(currPath === "/World") ? "active" : ""}>World</Nav.Link>
                            <Nav.Link as={Link} to="/Politics" onClick={this.urlChange("/Politics")} className={(currPath === "/Politics") ? "active" : ""}>Politics</Nav.Link>
                            <Nav.Link as={Link} to="/Business" onClick={this.urlChange("/Business")} className={(currPath === "/Business") ? "active" : ""}>Business</Nav.Link>
                            <Nav.Link as={Link} to="/Technology" onClick={this.urlChange("/Technology")} className={(currPath === "/Technology") ? "active" : ""}>Technology</Nav.Link>
                            <Nav.Link as={Link} to="/Sports" onClick={this.urlChange("/Sports")} className={(currPath === "/Sports") ? "active" : ""}>Sports</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto rightIcons">
                        <Nav.Link as={Link} to="/favorites" active={true}>
                            {
                                ( currPath !== "/favorites")  ?
                                <FaRegBookmark data-tip="Bookmark" data-for="nb"/> :
                                <FaBookmark data-tip="Bookmark" data-for="nb1"/>
                    

                            }
                        </Nav.Link>
                        
                        {
                            ( ! (currPath === "/search" || currPath === "/favorites" || currPath === "/article"  )) ?
                        <>
                        <Nav.Link href="" active={true}>NYTimes</Nav.Link>
                        <Nav.Link href=""><Switch onChange={this.handleChange} checked={this.state.checked} uncheckedIcon={false} checkedIcon={false} onColor="#1195f6" /></Nav.Link>
                        <Nav.Link href="" active={true}>Guardian</Nav.Link>
                        </>
                        :
                        <></>
                        }
                    </Nav>
                    <ReactTooltip place="bottom" id='nb'/>
                    <ReactTooltip place="bottom" id='nb1'/>
                </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}


export default withRouter(Navigation)