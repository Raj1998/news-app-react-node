import React, { Component } from 'react'
import AsyncSelect from 'react-select/async'
import _ from 'lodash';
import { withRouter } from 'react-router-dom'

const azureBaseUrl = "https://rajpatel.cognitiveservices.azure.com/bing/v7.0/suggestions"
let options = [
    // { value: 'chocolate', label: 'Chocolate' },
    // { value: 'strawberry', label: 'Strawberry' },
    // { value: 'vanilla', label: 'Vanilla' }
  ]

class AsyncSearch extends Component {
    state = {
        value: ''
    }

    loadOptions = (inputValue, callback) => {
        console.log(inputValue)
       
            // let suggestions = []
            // fetch(azureBaseUrl+"?q="+inputValue,
            //     {
            //         method: 'GET',
            //         headers: {
            //             'Ocp-Apim-Subscription-Key': 'ac024cec74564fddaf6810bf13a1702a'
            //         }
            //     }
            // )
            // .then( data => data.json() )
            // .then( data => {
            //     // console.log(data.suggestionGroups[0].searchSuggestions)
                
                
            //     let m_d = data.suggestionGroups[0].searchSuggestions
            //     m_d.forEach(element => {
            //         suggestions.push( { value: element.displayText, label: element.displayText } )
            //     });
    
            //     console.log(suggestions)
            //     callback(suggestions)
            //     // return suggestions
                
            // })
            // .catch( err => console.log(err) )
        
        
        callback([
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' }
          ])
    
    }

    makeSearch = (v) => {
        // this.setState({asyncKey: v.value})
        
        let source = this.props.checked ? "Guardian" : "NYTimes"
        console.log("Searching...", v.value, source)
        // this.urlChange("/search")()
        this.props.history.push(`/search?q=${v.value}&source=${source}`)
        options = []
    }

    componentDidUpdate(){
        
    }

    render() {

        return (
            <AsyncSelect
                                    key={this.props.asyncKey}
                                    placeholder="Enter keyword .." 
                                    options={options} 
                                    onInputChange={(value) => {this.setState({value})}}
                                    // inputValue = {this.state.value}
                                    loadOptions={_.debounce(this.loadOptions, 1050, {
                                        leading: true
                                    })                                    
                                    }
                                    value={ undefined } 
                                    onChange={this.makeSearch}
                                    />
        )
    }
}


export default withRouter(AsyncSearch)