import React, { Component } from 'react'
import { Card,  Row, Col, Modal } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { IoMdShare } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import { EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon} from 'react-share'
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class CardFav extends Component {
    state = {
        lgShow : false
    }

    showArticle = () => {
        this.props.data.source === "Guardian" ? this.props.history.push(`/article?id=${this.props.data.id}&source=Guardian`) : this.props.history.push(`/article?id=${this.props.data.id}&source=NYTimes`)
    }

    removeFav = (id) => (e) => {
        e.stopPropagation()
        this.props.removeFav(id)
        toast("Removing "+this.props.data.title, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
    }

    showShare = (e) => {
        e.stopPropagation()
        console.log("share...")
        this.setState({
            lgShow: true
        })
    }

    render() {
        let currPath = this.props.location.pathname
        // console.log(this.props.data)
        let title = this.props.data.title.split(" ")
        if (title.length > 10){
            title = title.slice(0, 10).join(" ")+"...  "
        }
        else{
            title = title.join(" ")
        }
       

        return (
            <div>
                <Card  onClick={this.showArticle} className="cardFav my-2">
                
                <Card.Body>
                    <Card.Title>
                        <strong><em> {title} <IoMdShare onClick={this.showShare} /> { (currPath === "/favorites") ? <MdDelete onClick={this.removeFav(this.props.data.id)} /> : <></>}</em></strong>
                    </Card.Title> 
                       
                    <Card.Img className="mimg" variant="top" src={this.props.data.img_url} />
                    <Card.Text>

                    <span className="my-3">
                        {this.props.data.tarikh}
                                
                                { 
                                (currPath === "/favorites") ?
                                    <span className="sec" id={this.props.data.source}> 
                                        {this.props.data.source}
                                    </span>
                                    :
                                    <></>
                                }

                            <span className="sec mx-1" id={this.props.data.section}>
                                                                {this.props.data.section}  
                                                            </span>
                    </span>
                   
                  
                    </Card.Text>
                    
                </Card.Body>
                </Card>

                <ToastContainer
                                position="top-center"
                                autoClose={2000}
                                hideProgressBar
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnVisibilityChange
                                draggable
                                pauseOnHover
                                transition={Zoom}
                                
                                />

                <Modal
                    size="md"
                    show={this.state.lgShow}
                    onHide={() => this.setState({lgShow: false})}
                    aria-labelledby="example-modal-sizes-title-md"
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-md">
                        <h2>
                            {this.props.data.source}
                        </h2>
                        {this.props.data.title}
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <h4 style={{textAlign:"center"}}>Share via</h4>
                        
                        {/* <FacebookIcon size={52} round={true}>
                        </FacebookIcon> */}

                        <Row>
                            <Col xs={4} style={{textAlign:"center"}}>
                            <FacebookShareButton
                                children={<FacebookIcon size={52} round={true}></FacebookIcon>}
                                url={this.props.data.url}
                                hashtag="#CSCI_571_NewsApp"
                            />
                            </Col>

                            <Col xs={4} style={{textAlign:"center"}}>
                            <TwitterShareButton
                                children={ <TwitterIcon size={52} round={true} /> }
                                url={this.props.data.url}
                                hashtags={["CSCI_571_NewsApp"]}
                            />
                            </Col>

                            <Col xs={4} style={{textAlign:"center"}}>
                            <EmailShareButton
                                children={ <EmailIcon size={52} round={true} /> }
                                url={this.props.data.url}
                                subject="#CSCI_571_NewsApp"
                            />
                            </Col>

                        </Row>
                        
                        <TwitterShareButton />
                        <EmailShareButton />
                    </Modal.Body>
                </Modal>

               
            </div>
        )
    }
}

export default withRouter(CardFav)