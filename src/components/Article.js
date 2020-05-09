import React, { Component } from 'react'
import { api_base_endpoint } from '../Data'
import { withRouter } from 'react-router-dom'
import { Card,  } from 'react-bootstrap'
import Spinner from '../Layouts/Spinner'
import Comments from './Comments'
import { EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon} from 'react-share'
import { FaRegBookmark, FaBookmark, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip'
// import { DataContext } from './DataContext'
import _ from 'lodash';

class Article extends Component {
    _mounted = false
    
    constructor(){
        super()
        this.state = {
            id: "",
            source: "",
            results: null,
            title: "",
            img_url: "",
            desc: "",
            tarikh: "",
            isFav: null,
            url: "",
            shortDesc : null,
            fullDesc: null,
            showSpinner: true,
            shortD: true,
            togglingDesc: null,
        }
        this.myRef = React.createRef();
        this.myRef1 = React.createRef();
        this.myRef2 = React.createRef();
        this.secPar = React.createRef();
        
        
    }


    componentDidMount(){
        this._mounted = true
        // this.props.updateSearchBar()

        ReactTooltip.rebuild()
        
        // this.props.pathChange("/article")
        let urlParams = new URLSearchParams(this.props.location.search)
        let id = urlParams.get('id')
        let source = urlParams.get('source')
        
        // this.removeCommentBox = commentBox(commentbox_project_id, { defaultBoxId: id } );
        
        let isFav = localStorage.getItem(id) == null ? false : true
        
        this.setState({id: id, source, isFav: isFav})

        fetch(api_base_endpoint+`/article?source=${source}&id=${id}`)
            .then(data => data.json())
            .then(data => {
                // console.log(data)
                // this.setState({results: data})
            
                let title
                let img_url
                let tarikh
                let desc
                let section
                let url
        
                if (source === "Guardian" ){
                    
        
                    let m_data = data.response.content
                    title = m_data.webTitle

                    try {
                        let assets = m_data.blocks.main.elements[0].assets
                        assets = assets[assets.length - 1]
                        img_url = assets.file
                    }
                    catch (err) {
                        img_url = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                    }


                    tarikh = m_data.webPublicationDate.slice(0,10)
                    desc = m_data.blocks.body[0].bodyTextSummary
                    section = m_data.sectionId
                    url = m_data.webUrl
        
                }
                else if  (source === "NYTimes" ){
                    
                    
                    let m_data = data.response.docs[0]

                    let image_url = null
                    let hu = null
                    // TODO: width >= 2000 check

                    try {
                        // image_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"

                        let ar = m_data.multimedia
                        
                        for(let i = 0; i < ar.length; i+=1){
                            let element = ar[i]
                            if(element.width >= 2000){
                                hu = element.url
                                break
                            }
                        }
                        if (hu !== null) image_url = "https://www.nytimes.com/"+hu
                        else image_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
                    } catch (error) {
                        image_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
                    }
                    title = m_data.headline.main            
                    img_url = image_url
                    tarikh = m_data.pub_date.slice(0,10)
                    desc = m_data.abstract
                    section = m_data.section_name
                    url = m_data.web_url

                }
                else{
                    
                }

                if(this._mounted)
                {

                    
                    this.setState({showSpinner: false})

                    this.setState({id: id, title: title, img_url: img_url, desc: desc, tarikh: tarikh, section: section, source: source, url: url})

                    let s = desc.split('.')
                    // console.log(s)
                    if (s.length > 5){
                        let sd = s.slice(0,4).join('.')+". "
                        let fd =  s.slice(4,s.length).join('.')

                        fd = <span >                               
                                    {sd}
                                <br /><br />
                                  <span ref={this.secPar}>
                                    {fd}                 
                                    </span>             
                            </span>
                        this.setState( {shortDesc: sd, fullDesc: fd, togglingDesc: sd })
                        
                    }
                }

            } )
            .catch(err => console.log(err))
        
        
        
    }


    showMore = () => {
        this.setState({togglingDesc: this.state.fullDesc, shortD: false}, () => {
            this.secPar.current.scrollIntoView({behavior: 'smooth'})
        })
        // console.log(this.myRef)
        

        
    }

    showLess = () => {
        this.setState({togglingDesc: this.state.shortDesc, shortD: true}, () => {
            // document.getElementById('abc').scrollIntoView({
            //     behavior: 'smooth'
            //   });
            this.myRef1.current.scrollIntoView({behavior: 'smooth'})
        })
        
    }

    saveFav = () => {
        // ReactTooltip.rebuild()
        console.log('saving... Favorite')
        let dataToStore = _.cloneDeep(this.state)
        delete dataToStore.fullDesc
        delete dataToStore.shortDesc
        delete dataToStore.togglingDesc

        // console.log(dataToStore)
        localStorage.setItem(this.state.id, JSON.stringify(dataToStore));
        this.setState({isFav: true})
        // toast("Saving "+this.state.title);
        toast("Saving "+this.state.title, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
    }

    removeFav = () => {
        // ReactTooltip.rebuild()
        console.log('removing... Favorite')
        localStorage.removeItem(this.state.id)
        this.setState({isFav: false})
        toast("Removing "+this.state.title, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,            
            });
    }

    componentWillUnmount(){
        this._mounted = false
        // this.removeCommentBox();
    }

    render() {
        
        let urlParams = new URLSearchParams(this.props.location.search)
        let id = urlParams.get('id')

        if (this.state.showSpinner) {
            return <Spinner />
        }
        else {
            
            return (
                
                <div>
                    {/* <DataContext.Consumer>
                        {
                            (context) => { context.incKey() }
                        }
                    </DataContext.Consumer> */}

                    <Card style={{margin: "1em", padding: "1em"}} className="CardHome" ref={this.myRef1}>
                        <h2><em>{this.state.title}</em></h2>
                            
                        
                        {/* <Row> */}
                            <div className="mx-2">
                            <span>{this.state.tarikh}</span>
                            
                        
                           <span style={{float:"right"}}>

                                <span className="wideShare">
                                <FacebookShareButton
                                    children={<FacebookIcon size={32} round={true}></FacebookIcon>}
                                    url={this.state.url}
                                    hashtag="#CSCI_571_NewsApp"
                                    data-tip="Facebook" data-for="Facebook"
                                />
                                <TwitterShareButton
                                    children={ <TwitterIcon size={32} round={true} /> }
                                    url={this.state.url}
                                    hashtags={["CSCI_571_NewsApp"]}
                                    data-tip="Twitter" data-for="Twitter"
                                />
                                <EmailShareButton
                                    children={ <EmailIcon size={32} round={true} /> }
                                    url={this.state.url}
                                    subject="#CSCI_571_NewsApp"
                                    data-tip="Email" data-for="Email"
                                />

                                </span>
                              
                { !this.state.isFav ? 
                    <FaRegBookmark onClick={this.saveFav} color="#dd0035" size={28} data-tip="Bookmark" data-for="bkmbtn"/> 
                    : 
                    <FaBookmark onClick={this.removeFav} color="#dd0035" size={28} data-tip="Remove Bookmark" data-for="bkmbtn1"/> }
                            
                            <div className="sm-12" style={{color:"red"}}>
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
                                </div>

                            </span>

                        


                            </div>
                        {/* </Row> */}
                        <Card.Img variant="top" src={this.state.img_url} />
                        <Card.Body >
                        <Card.Text className="artDesc">

                            <span  ref={this.myRef} id="abc">
                                {
                                    
                                    (this.state.shortDesc == null) ? this.state.desc : this.state.togglingDesc
                                    
                                
                                }

                                

                            </span>

                            <br />
                            <span style={{float: 'right'}}>

                                {
                                (this.state.shortDesc != null) ?

                                (this.state.shortD) ? <FaAngleDown onClick={this.showMore} size={25}/> : <FaAngleUp onClick={this.showLess} size={25} />
                                
                                :
                                <></>

                                }
                            </span>
                        </Card.Text>
                        </Card.Body>
                    </Card>

                   
                    

                    <ReactTooltip place="top" id='Facebook'  />
                    <ReactTooltip place="top" id='Twitter'/>
                    <ReactTooltip place="top" id='Email'/>

                    <ReactTooltip place="top" id='bkmbtn'/>
                    <ReactTooltip place="top" id='bkmbtn1'/>
                  

                    <Comments cid={id} />
                    {/* // <div className="commentbox" /> */}
                </div>

                
            )
        }

        
    }
}


export default withRouter(Article)