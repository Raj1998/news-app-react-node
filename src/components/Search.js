import React, { Component } from 'react'
import { api_base_endpoint } from '../Data'
import { withRouter } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import CardFav from './CardFav'

class Search extends Component {
    state = {
        res: []
    }
    _mounted = false


    componentDidMount(){
        // this.props.pathChange("/search")
        this._mounted = true

        let urlParams = new URLSearchParams(this.props.location.search)
        let query = urlParams.get('q')
        let source = urlParams.get('source')

        fetch(api_base_endpoint+`/search?source=${source}&q=${query}`)
        .then(data => data.json())
        .then(data => {
            // console.log(data)
            // this.setState({results: data})

            let arr = []
            if (source === "Guardian"){
                let results = data.response.results

                results.forEach(element => {                    
                    let image_url
                    
                    try {
                        let assets = element.blocks.main.elements[0].assets
                        assets = assets[assets.length - 1]
                        image_url = assets.file                        
                    } catch (error) {
                        image_url = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                    }
                    

                    arr.push({
                        id: element.id,
                        title: element.webTitle,
                        tarikh: element.webPublicationDate.slice(0,10),
                        section: element.sectionId,
                        img_url: image_url,
                        source: "Guardian"
                    })
                });


            }
            else if (source === "NYTimes") {                
                let results = data.response.docs

                results.forEach(element => {                    
                    let image_url
                    let hu = null
                    // TODO: width >= 2000 check

                    try {
                        let ar = element.multimedia

                        for(let i = 0; i < ar.length; i+=1){
                            let it = ar[i]
                            if(it.width >= 2000){
                                hu = it.url
                                break
                            }
                        }
                        if (hu !== null) image_url = "https://www.nytimes.com/"+hu
                        else image_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
                        
                    } catch (error) {
                        image_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
                    }
                    
                    arr.push({
                        id: element.web_url,
                        title: element.headline.main,
                        tarikh: element.pub_date.slice(0,10),
                        section: element.news_desk,
                        img_url: image_url,
                        source: "NYTimes"
                    })
                });

            }
            if(this._mounted)
                this.setState({res: arr})

        })
        .catch(err => console.log(err))

        console.log(source, query)
    }

    componentWillUnmount(){
        this._mounted = false
    }

    render() {
        return (
            <div>
                <Row className="mx-2">
                    <Col lg="12">
                        <h3>Results</h3>
                    </Col>
                </Row>
                <Row className="mx-2">
                {
                    this.state.res.map( item => {                      
                        if( ! (item.title === "" || item.tarikh === "" || item.section === "") ){
                            
                            return <Col lg="3" sm="12" key={item.id}><CardFav data={item} removeFav={this.removeFav} /></Col>
                        }
                        else{
                            return <></>
                        }
                        
                    })
                }
                </Row>
            </div>
        )
    }
}

export default withRouter(Search)