import React, { Component } from 'react'
// import Navigation from './Navigation'
import CardHomepage from './CardHomepage'
import Spinner from '../Layouts/Spinner'

export default class Home extends Component {
    // state = {
    //     news: []
    // }


    // componentDidMount(){
    //     console.log("data fetching")
    //     fetch("http://localhost:7000/?source=guardian")
    //         .then(data => data.json())
    //         .then(data => {
    //             this.setState({news: data.response.results})
    //             console.log(this.state)
    //         })
    //         .catch(err => console.log(err))
    // }

    render() {
        let source = this.props.source

        if (source === "Guardian"){
            return (                    
                    <div className="my-3 mx-3">
                    {
                        this.props.fetched_news.map( item => {
                            return <CardHomepage key={item.id} newsData={item} source={source} pathChange={this.props.pathChange}  />
                        })
                    }                        
                    </div>
            )            
        }
        else if (source === "NYTimes"){
            return (
                <div className="my-3 mx-3">
                    {
                        this.props.fetched_news.map( item => {
                            return <CardHomepage key={item.url} newsData={item} source={source} pathChange={this.props.pathChange} />
                        })
                    }                        
                    </div>
            )
        }
        else{
            return (
                <Spinner />
            )
        }
    }
}
