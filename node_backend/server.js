const express = require('express')
var path = require('path');
const fetch = require('node-fetch')
const googleTrends = require('google-trends-api');

const app = express()
const port = 8081

const api_key_guardian = "9b43aac5-1512-409b-b17c-8247ebb93f10"
const api_key_nytimes = "j6qKgMFciYeqvxpMAOBKJXaEU8AollW4"

// https://content.guardianapis.com/search?api-key=9b43aac5-1512-409b-b17c-8247ebb93f10&section=(sport|business|technology|politics)&show-blocks=all
// https://api.nytimes.com/svc/topstories/v2/home.json?api-key=j6qKgMFciYeqvxpMAOBKJXaEU8AollW4

// https://content.guardianapis.com/%5bSECTION_NAME%5d?api-key=%9b43aac5-1512-409b-b17c-8247ebb93f10&show-blocks=all
// https://api.nytimes.com/svc/topstories/v2/world.json?api-key=%5bYOUR_API_KEY%5d
// world, politics, business, technology, sports


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") 
    next()
})

app.use(express.json());


app.get('/api', async   (req, res) => {

    let results
    let url
    
    let source = req.query.source
    let section = req.query.section

    // source      section
    // g           world, politics, business, technology, sport
    // nyt         world, politics, business, technology, sports

    if(source === "guardian"){
        if (section === undefined || section === ""){
            url = `https://content.guardianapis.com/search?api-key=${api_key_guardian}&section=(sport|business|technology|politics)&show-blocks=all`
        }
        else{
            url = `https://content.guardianapis.com/${section}?api-key=${api_key_guardian}&show-blocks=all`
        }
    }
    else if (source === "nytimes"){
        if (section === undefined) {
            url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${api_key_nytimes}`
        }
        else{
            url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${api_key_nytimes}`            
        }
    }
    
    try {
        results = await fetch(url)
        results = await results.json()
    } catch (error) {
        results = {"message": "Something went wrong"}
    }

    // console.log("source: "+source+ " Section: "+section )

    res.send(results)
})


app.get('/api/article', async (req, res) => {
    let source = req.query.source
    let id = req.query.id
    console.log(req.query.source, id)
    let url
    let results

    if (source === "Guardian"){
        url = `https://content.guardianapis.com/${id}?api-key=${api_key_guardian}&show-blocks=all`
    }
    else if (source === "NYTimes"){
        url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("${id}")&api-key=${api_key_nytimes}`
    }

    try {
        
        results = await fetch(url)
        results = await results.json()
        
    } catch (error) {
        results = {"message": "Something went wrong"}
    }
    res.send(results)
})


app.get('/api/search', async (req, res) => {
    let source = req.query.source
    let query = req.query.q
    console.log(req.query.source, query)
    let url
    let results

    if (source === "Guardian"){
        url = `https://content.guardianapis.com/search?q=${query}&api-key=${api_key_guardian}&show-blocks=all`
    }
    else if (source === "NYTimes"){
        url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${api_key_nytimes}`
    }

    try {
        results = await fetch(url)
        results = await results.json()
        
    } catch (error) {
        results = {"message": "Something went wrong"}
    }
    res.send(results)
})


app.get('/api/api_endpoints', (req, res) => {
    res.send(        
        "<h3 style='font-family:Arial'><a target='_blank' href='/api?source=guardian'>Home</a><br><br><a target='_blank' href='/api?source=guardian&section=world'>Section</a><br><br><a target='_blank' href='/api/article?id=https://www.nytimes.com/2020/04/05/us/politics/trump-hydroxychloroquine-coronavirus.html&source=NYTimes'>Article</a><br><br><a target='_blank' href='/api/search?q=kuchisake-onna&source=Guardian'>Search</a></h3>"
    )
})




// =============== modified response for mobile devices ===================

app.post('/api/mobile/search', (req, res) => {

    //  { "for_":"search" or "trending",  }
    // console.log(req.body.query)

    googleTrends.interestOverTime({keyword: req.body.query, startTime: new Date("2019-06-01")})
    // googleTrends.interestOverTime({keyword: 'Amazon', startTime: new Date("2019-06-01")})
    .then(function(results){
        results = JSON.parse(results)

        results = results.default.timelineData
        
        // let count = {}
        let answer = []
        // console.log(results.length)
        results.forEach( item => {
            // console.log(item.value[0])
            answer.push(item.value[0])
            // count[item.value[0]] = (count[item.value[0]] || 0) + 1
        })
        // console.log(count)
        
        res.send({"points":answer})
    })
    .catch(function(err){
        console.error(err);
        res.send({"msg": "oops"})
    });
})



app.get('/api/mobile', async   (req, res) => {

    let results
    let url
    let news_arr = []
    
    let sec = req.query.section

    // source      section
    // g           world, politics, business, technology, sport
    // nyt         world, politics, business, technology, sports
    
    
    try {
        if (sec === undefined || sec === "x"){
            url = `https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=${api_key_guardian}`
            // url = `https://content.guardianapis.com/search?api-key=${api_key_guardian}&section=(sport|business|technology|politics)&show-blocks=all`
        }
        else{
            url = `https://content.guardianapis.com/${sec}?api-key=${api_key_guardian}&show-blocks=all`
        }
            let fetched_data = await fetch(url)
            fetched_data = await fetched_data.json()
            fetched_data = fetched_data.response.results

            fetched_data.forEach(element => {
            
                let title
                // let desc
                let image_url
                let tarikh
                let section
                let url
                let id
                
                
                id = element.id
                title = element.webTitle
                // desc = element.blocks.body[0].bodyTextSummary
                tarikh = element.webPublicationDate
                section = element.sectionName
                url = element.webUrl

                let curr_time = new Date()
                let article_pub_date = new Date(tarikh)
                let diff = curr_time - article_pub_date
                let time_ago

                if ( diff / (1000) < 60 ) {
                    time_ago = Math.round(diff / (1000)) + "s ago"
                }
                else if ( diff / (1000 * 60) < 60 ) {
                    time_ago = Math.round(diff / (1000 * 60)) + "m ago"
                }
                else {
                    time_ago = Math.round(diff / (1000 * 60 * 60)) + "h ago"
                }
                
                

                if (sec === undefined || sec === "x"){
                    if (element.fields === undefined || element.fields.thumbnail === undefined ){
                        image_url = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                    }
                    else{
                        image_url = element.fields.thumbnail+""
                    }
                }
                else{
                    try {
                        let assets = element.blocks.main.elements[0].assets
                        assets = assets[assets.length - 1]
                        image_url = assets.file                    
                    } catch (error) {                
                        image_url = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                    }
                }
                

                let curr_news = {
                    "id": id, 
                    "title": title,
                    // "desc": desc,
                    "image_url": image_url,
                    "pubDate": tarikh,
                    "section": section,
                    "url": url,
                    "time_ago": time_ago
                }
                news_arr.push(curr_news)
                
            });
            
            results = {"status": "ok", "news": news_arr}

        // }
        // else{
        //     url = `https://content.guardianapis.com/${section}?api-key=${api_key_guardian}&show-blocks=all`
        //     fetched_data = await fetch(url)
        //     fetched_data = await fetched_data.json()            
        // }

        
    } catch (error) {
        console.log(error)
        results = {"status": "Something went wrong", "news": news_arr}
    }

    // console.log("source: "+source+ " Section: "+section )

    res.send(results)
})


app.get('/api/mobile/article', async (req, res) => {
    
    let id = req.query.id
    let req_url
    let results

    req_url = `https://content.guardianapis.com/${id}?api-key=${api_key_guardian}&show-blocks=all`
    

    try {
        
        results = await fetch(req_url)
        results = await results.json()

        let title
        let img_url
        let tarikh
        let desc
        let section
        let url

        let m_data = results.response.content
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
        desc = ""
                    m_data.blocks.body.forEach(e => desc += e.bodyHtml )
        section = m_data.sectionName
        url = m_data.webUrl

        let curr_news = {
            "id": id, 
            "title": title,
            "desc": desc,
            "image_url": img_url,
            "pubDate": tarikh,
            "section": section,
            "url": url,
        }
        
        results = {"message": "ok", "news": curr_news}

    } catch (error) {
        console.log(error)
        results = {"message": "Something went wrong"}
    }
    res.send(results)
})


app.get('/api/mobile/search', async (req, res) => {
    
    let query = req.query.q
    // console.log(query)
    let req_url
    let results
    let news_arr = []

    req_url = `https://content.guardianapis.com/search?q=${query}&api-key=${api_key_guardian}&show-blocks=all`
    

    try {
        results = await fetch(req_url)
        results = await results.json()
        results = results.response.results

        results.forEach(element => {
                
            let title
            // let desc
            let image_url
            let tarikh
            let section
            let url
            let id       



            
            id = element.id
            title = element.webTitle
            // desc = element.blocks.body[0].bodyTextSummary
            tarikh = element.webPublicationDate
            section = element.sectionName
            url = element.webUrl
            

            let time_ago
            let curr_time = new Date()
            let article_pub_date = new Date(tarikh)
            let diff = curr_time - article_pub_date

            if ( diff / (1000) < 60 ) {
                time_ago = Math.round(diff / (1000)) + "s ago"
            }
            else if ( diff / (1000 * 60) < 60 ) {
                time_ago = Math.round(diff / (1000 * 60)) + "m ago"
            }
            else if ( diff / (1000 * 60 * 60) < 24 ) {
                time_ago = Math.round(diff / (1000 * 60 * 60)) + "h ago"
            }
            else {
                time_ago = Math.round(diff / (1000 * 60 * 60 * 24)) + "d ago"
            }


            try {
                let assets = element.blocks.main.elements[0].assets
                assets = assets[assets.length - 1]
                image_url = assets.file
                
            } catch (error) {
                image_url = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
            }
            let curr_news = {
                "id": id, 
                "title": title,
                // "desc": desc,
                "image_url": image_url,
                "pubDate": tarikh,
                "section": section,
                "url": url,
                "time_ago": time_ago
            }
            news_arr.push(curr_news)
            
        });
        
        results = {"status": "ok", "news": news_arr}

        
    } catch (error) {
        console.log(error)
        results = {"message": "Something went wrong"}
    }
    res.send(results)
})


app.use('/static', express.static('build/static'))
app.use('/assets', express.static('build/assets'))

app.get('*', function(req, res, n) {
    res.sendFile(path.join(__dirname+'/build/'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))