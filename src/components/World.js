import React, { Component } from 'react'
import CardHomepage from './CardHomepage'
import Spinner from '../Layouts/Spinner'

export default class World extends Component {
    // state = {
    //     news: [],
    //     source: this.props.source
    // }

    // componentDidMount() {
    //     // console.log("World mounter ")
    //     // this.props.send()
    //     if (this.props.source === "NYTimes"){
    //             console.log("NYTimes data fetching")
    //             this.setState({source: "Loding"})
    //             fetch("http://localhost:7000/?source=nytimes&section=world")
    //                 .then(data => data.json())
    //                 .then(data => {
    //                     this.setState({news: data.results, source: "NYTimes"})
    //                     // console.log(this.state)
    //                 })
    //                 .catch(err => console.log(err))
    //           }
    //           else if (this.props.source === "Guardian") {
    //             console.log("Gaurdian data fetching")
    //             this.setState({source: "Loding"})
    //             fetch("http://localhost:7000/?source=guardian&section=world")
    //                 .then(data => data.json())
    //                 .then(data => {
    //                     this.setState({news: data.response.results, source: "Guardian"})
    //                     // console.log(this.state)
    //                 })
    //                 .catch(err => console.log(err))
    //           }
    // }

    render() {
        let source = this.props.source
        // console.log(source)
        
        if (source === "Guardian"){
            return (                    
                <div className="my-3 mx-3">
                {
                    this.props.fetched_news.map( item => {
                        return <CardHomepage key={item.id} newsData={item} source={source} />
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
                            return <CardHomepage key={item.url} newsData={item} source={source} />
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
