import React, { Component } from 'react'
import { Card, Row, Col, Modal } from 'react-bootstrap'
import { IoMdShare } from 'react-icons/io'
import { withRouter } from 'react-router-dom'
import { EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon} from 'react-share'

class CardHomepage extends Component {
    constructor(){
        super()
        this.state = {
            lgShow : false
        }

    }

    showArticle = () => {
        // console.log("testeddd")
        // this.props.pathChange("/article")
        this.props.source === "Guardian" ? this.props.history.push(`/article?id=${this.props.newsData.id}&source=Guardian`) : this.props.history.push(`/article?id=${this.props.newsData.url}&source=NYTimes`)
        // this.context.router.push('/);
        // browserHistory.push("/articles/888")
    }

    showShare = (e) => {
        e.stopPropagation()
        console.log("share...")
        this.setState({
            lgShow: true
        })
    }

    render() {
        // console.log(this.props.newsData.id)
        // https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg
        let title
        let desc
        let image_url
        let tarikh
        let section
        let url

        if(this.props.source === "Guardian"){
            title = this.props.newsData.webTitle
            desc = this.props.newsData.blocks.body[0].bodyTextSummary
            tarikh = this.props.newsData.webPublicationDate.slice(0,10)
            section = this.props.newsData.sectionId
            url = this.props.newsData.webUrl
            
            try {
                let assets = this.props.newsData.blocks.main.elements[0].assets
                assets = assets[assets.length - 1]
                image_url = assets.file
                
            } catch (error) {
                image_url = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
            }
        }
        else {
            
            title = this.props.newsData.title
            desc = this.props.newsData.abstract
            tarikh = this.props.newsData.published_date.slice(0,10)
            section = this.props.newsData.section
            url = this.props.newsData.url

            try {
                let ar = this.props.newsData.multimedia
                image_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
                for(let i = 0; i < ar.length; i+=1){
                    let element = ar[i]
                    if(element.width >= 2000){
                        image_url = element.url
                        break
                    }
                }
                // image_url = this.props.newsData.multimedia[0].url                
            } catch (error) {
                image_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
            }
            // TODO: image width > 2000 case.




        }

        if (title === "" || desc === "" || tarikh === "" || section === "") {
            return  <></>
        }


        return (
            <div>
                  <Card className="mx-2 my-2 CardHome" onClick={this.showArticle}  >
                    <Row>
                        <Col md={3} sm={12}>
                            <div className="cardImg">
                                <Card.Img  variant="top" src={image_url} />
                            </div>
                        </Col>
                        <Col md={9} className="cardBody">
                            <Card.Body>
                            <Card.Text>
                            <strong><em> {title} <IoMdShare onClick={this.showShare} /> </em></strong> <br />
                                
                                <span className="desc">
                                    {desc}
                                </span>
                                <br />

                                <span>
                                <em>{tarikh}</em>

                                <span className="sec" id={section}>
                                {section}
                                </span>
                                </span>
                            </Card.Text>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>

                <Modal
                    size="md"
                    show={this.state.lgShow}
                    onHide={() => this.setState({lgShow: false})}
                    aria-labelledby="example-modal-sizes-title-md"
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-md">
                        {title}
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
                                url={url}
                                hashtag="#CSCI_571_NewsApp"
                            />
                            </Col>

                            <Col xs={4} style={{textAlign:"center"}}>
                            <TwitterShareButton
                                children={ <TwitterIcon size={52} round={true} /> }
                                url={url}
                                hashtags={["CSCI_571_NewsApp"]}
                            />
                            </Col>

                            <Col xs={4} style={{textAlign:"center"}}>
                            <EmailShareButton
                                children={ <EmailIcon size={52} round={true} /> }
                                url={url}
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


export default withRouter(CardHomepage)