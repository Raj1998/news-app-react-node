import React, { Component } from 'react'
import CardFav from './CardFav'
import { Row, Col } from 'react-bootstrap'
// import { withRouter } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

class Favorites extends Component {
    constructor(){
        super()
        this.state = {
            fav: []
        }
    }
    
    componentDidMount(){
        ReactTooltip.hide()
        ReactTooltip.rebuild()
        // this.props.pathChange("/favorites")
        let keys = Object.keys(localStorage)
        let i = 0
        let arr = []
        for (i = 0; i < keys.length; i++) {
            if (keys[i] !== "source"){
                let val = JSON.parse(localStorage.getItem(keys[i]) )
                // console.log( keys[i] );
                // console.log( val );
                arr.push(val)
            }
        }
        this.setState( {fav: arr } )
        // console.log(this.state)
    }

    removeFav = (id) => {
        localStorage.removeItem(id)
        let currFav = this.state.fav
        currFav = currFav.filter( item => item.id !== id)
        this.setState({fav: currFav})
    }

    render() {
        if (this.state.fav.length === 0){
            return (
                <center><h3>You have no saved articles.</h3></center>
            )
        }
        return (

            <div>
                <Row className="mx-2">
                    <Col lg="12">
                        <h3>Favorites</h3>
                    </Col>
                </Row>
                <Row className="mx-2 my-1">
                {
                    this.state.fav.map( item => {
                        return <Col lg="3" sm="12" key={item.id}><CardFav data={item} removeFav={this.removeFav} /></Col>
                        
                    })
                }
                </Row>
            </div>
        )
    }
}


export default Favorites