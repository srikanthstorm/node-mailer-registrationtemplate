
var cron = require('node-cron');
const Rssfeed = require('../model/rssfeed');
const Users = require('../model/Users'); //importing user model
const db = require ('../db');
 var mail = require('./Emailservice');
 sendEmailtoUsers = function(list,title,description,content,image,source){
    list.forEach(function(value){
        //  console.log("Mailer console:",title,description,source);
         mail.sendPasswordReset(value,title,description,content,image,source);
        
        })   
}
 
/*Summary Email */
summaryEmailtoAdmin = function(emails,feeds){
    console.log('from mail function',emails);
   
      emails.forEach(function(value){
                mail.sendSummaryMail(value,feeds);
               })    
}
module.exports = function(app, db) {
    
    /* Fetch by ID */
app.route('/rssFeed/:id').get((req,res) => {
    Rssfeed.findById(req.params.id, (err, rss) => {
        if (err) {
            res.send(err);
        }
        res.json(rss);
    });
})
/* Fetch all Feeds */
app.route('/rssFeeds').get((req,res) => {
    Rssfeed.find({}, (err, rssfeed) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(rssfeed);
    }); 
})
 /* Fetch all untagged Feeds */
 app.route('/untaggedFeeds').get((req,res) => {
    Rssfeed.find({feed_status: 'untagged'}, (err, rssfeed) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(rssfeed);
    }).limit(50); 
})
/* Fetch by Feed_status */
app.route('/statusFeeds/:feed_status').get((req,res) => {
    Rssfeed.find({feed_status: req.params.feed_status},  (err, rssfeed) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(rssfeed);
    }).limit(100);
})
/* Fecth by n days*/
app.route('/rssFeedsbyDate/:date').get((req,res) => {
    date = req.params.date * 24 * 60 * 60 * 1000;
    Rssfeed.find({articles_publishedAt: {$gt:new Date(Date.now() - date)} },  (err, rssfeed) => {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        }
        res.status(200).json(rssfeed);
    }).limit(100);
})
/* Fetch Untagged Feeds by Oldest Date */
app.route('/rssFeed/old/:feed_status').get((req,res) => {
    Rssfeed.find({feed_status: req.params.feed_status}, (err, rssfeed) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(rssfeed);
    }).sort({ "articles_publishedAt" : -1 }).limit(100);
})
/* Fetch Oldest untagged by source Name */
app.route('/rssFeed/oldestUntagged/:articles_source_name').get((req,res) => {
    const articles_source_name = req.params.articles_source_name;
    console.log(articles_source_name);
    const date = 3 * 24 * 60 * 60 * 1000;
    if(articles_source_name == 'All'){
        Rssfeed.find({$and :[  {'feed_status': 'untagged'},
         {articles_publishedAt: {$gt:new Date(Date.now() - date)} } 
        ]}
            ,(err, rssfeed) => {
            if (err) {
                res.send(err);
            }
            res.json(rssfeed[0]);
        }).sort({'articles_publishedAt':1}).limit(1);
    }
    else {
        Rssfeed.find({$and :[{'articles_source_name':articles_source_name}, 
        {'feed_status': 'untagged'},
         {articles_publishedAt: {$gt:new Date(Date.now() - date)} } 
        ]}
            ,(err, rssfeed) => {
            if (err) {
                res.send(err);
            }
            res.json(rssfeed[0]);
        }).sort({'articles_publishedAt':1}).limit(1);
    } 
})


/* Fetch feeds by article name, status, date*/
app.route('/rssFeed/mainPage/:feed_status/:articles_source_name/:article_publishedAt').get((req,res) => {
    const articles_source_name = req.params.articles_source_name;
    const feed_status = req.params.feed_status;
     const date = req.params.article_publishedAt  * 24 * 60 * 60 * 1000;
    if(articles_source_name != 'All'){
        Rssfeed.find({$and :[{'articles_source_name':articles_source_name}, 
        {'feed_status': feed_status},
         {articles_publishedAt: {$gt:new Date(Date.now() - date)} } 
     ]},(err, rssfeed) => {
            if (err) {
                res.send(err);
            }
            res.json(rssfeed);
        });
       }
       else  {
         Rssfeed.find({$and :[ {'feed_status': feed_status},
         {articles_publishedAt: {$gt:new Date(Date.now() - date)} } 
     ]}, (err, rssfeed) => {
            if (err) {
                res.send(err);
            }
            res.json(rssfeed);
        });
       }
       
})
/* Tag Feed with  */
app.route('/rssfeed/:id/:primary_keyword/:keyword/:stockcode').put((req,res) =>{
    if(req.params.keyword != 'undefined'){
        if(req.params.primary_keyword != 'undefined' &&  req.params.stockcode != 'undefined'){
            Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{'primary_keyword':req.params.primary_keyword,'keyword':req.params.keyword, 'stockcode': req.params.stockcode, 'feed_status': 'tagged'}},{new: true },  function(err, result){
                if(err){
                    console.log(err); 
                }
                if (result) {
                    res.json({"status":"Feed Tagged with given keyword and StockCodes",result});
                }
            }); 
        } else if(req.params.primary_keyword == 'undefined' &&  req.params.stockcode == 'undefined'){
            Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{'keyword':req.params.keyword}},{new: true },  function(err, result){
                if(err){
                    console.log(err); 
                }
                if (result) {
                    res.json({"status":"Feed Tagged with given keyword and StockCodes",result});
                }
            }); 
        }else if(req.params.primary_keyword != 'undefined' &&  req.params.stockcode == 'undefined'){
            Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{'primary_keyword':req.params.primary_keyword,'keyword':req.params.keyword,  'feed_status': 'tagged'}},{new: true },  function(err, result){
                if(err){
                    console.log(err); 
                }
                if (result) {
                    res.json({"status":"Feed Tagged with given keyword and StockCodes",result});
                }
            }); 

        }else if(req.params.primary_keyword == 'undefined' &&  req.params.stockcode != 'undefined'){
            Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{'keyword':req.params.keyword, 'stockcode': req.params.stockcode,  'feed_status': 'tagged'}},{new: true },  function(err, result){
                if(err){
                    console.log(err); 
                }
                if (result) {
                    res.json({"status":"Feed Tagged with given keyword and StockCodes",result});
                }
            }); 
        }  
    } else if(req.params.keyword === 'undefined') {
        if(req.params.primary_keyword != 'undefined' &&  req.params.stockcode != 'undefined'){
            Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{'primary_keyword':req.params.primary_keyword, 'stockcode': req.params.stockcode, 'feed_status': 'tagged'}},{new: true },  function(err, result){
                if(err){
                    console.log(err); 
                }
                if (result) {
                    res.json({"status":"Feed Tagged with given keyword and StockCodes",result});
                }
            }); 
        } else if(req.params.primary_keyword == 'undefined' &&  req.params.stockcode == 'undefined'){
            var result = 'hello';
            res.json({"status":"No values given to update",result});
        }else if(req.params.primary_keyword != 'undefined' &&  req.params.stockcode == 'undefined'){
            Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{'primary_keyword':req.params.primary_keyword, 'feed_status': 'tagged'}},{new: true },  function(err, result){
                if(err){
                    console.log(err); 
                }
                if (result) {
                    res.json({"status":"Feed Tagged with given keyword and StockCodes",result});
                }
            }); 

        }else if(req.params.primary_keyword == 'undefined' &&  req.params.stockcode != 'undefined'){
            Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{ 'stockcode': req.params.stockcode,  'feed_status': 'tagged'}},{new: true },  function(err, result){
                if(err){
                    console.log(err); 
                }
                if (result) {
                    res.json({"status":"Feed Tagged with given keyword and StockCodes",result});
                }
            }); 
        } 
    }
 
})
/* Oldest feed to show on dashboard*/
app.get('/untaggedFeedsOldest',(req,res)=>{
    Rssfeed.find({feed_status: 'untagged'}, (err, rssfeed) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(rssfeed);
    }).sort({ "date_time" : 1 }).limit(1);
});
/*Ignore Feed */
app.route('/rssfeed/ignore/:id').put((req,res) =>{
    Rssfeed.findByIdAndUpdate({'_id':req.params.id},{$set:{'feed_status':'ignored'}}, {new: true },  function(err, result){
        if(err){
            res.json({"status":"Unable to Update Feed"})
        }
        if (result) {
            res.json({"status":"Feed Ignored",result});
        }
    });
})
// Ignore Many
app.route('/rssfeed/ignoreMany/:feed').put((req,res) =>{
    var sucess;
    const data =req.params.feed.split(",");
    for (var i = 0; i < data.length; i++) {
        Rssfeed.findByIdAndUpdate({ '_id': data[i] },{$set:{'feed_status':'ignored'}}, {new: true },  function(err, result){
            if(err){
                sucess = false;
                console.log(err);
            }
            if (result) {
               sucess = true;
            }
        });
    }
    if( sucess == true){
        res.json({"status": "Selected Feeds Ignored"})
    } else {
        res.json({"status": "Unable to Ignore Feeds"})
    }
})
/* Add new feed */
app.route('/rssfeed/new').post((req,res) => {
    let rssfeed = JSON.parse(Object.keys(req.body)[0]);
    Rssfeed.create(rssfeed)
    .then(function () {
        res.json('success');
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}) 
/* Count by sources */
app.route('/sources/count').get((req,res) => {
    const date = 3 * 24 * 60 * 60 * 1000;
    Rssfeed.aggregate([
        {$match:{feed_status:{$eq:'untagged'},'articles_publishedAt': {$gt:new Date(Date.now() - date)}}},
        { $group: {_id:'$articles_source_name'

, count:{$sum:1}}}
            ],(err, rssfeed) =>{
    if (err) {
        console.log(err);
        res.send(err);
    } 
    res.json(rssfeed);
});
})
/* Count of all untagged Feeds */
app.route('/feeds/count').get((req,res) => {
    const date = 3 * 24 * 60 * 60 * 1000;
    Rssfeed.aggregate([
        {$match:{feed_status:{$eq:'untagged'} ,articles_publishedAt: {$gt:new Date(Date.now() - date)} }},
        { $group: {_id:'All', count:{$sum:1}}}
            ],(err, rssfeed) =>{
            if (err) {
                console.log(err);
                res.send(err);
            }
            rssfeed.forEach(function(value){
            res.json(value);
        })
            
        });

})
//Mail summary
app.route('/feeds/mailed').get((req,res) => {
    const date = 1 * 24 * 60 * 60 * 1000;
     var email;
     var emails = [];
        Users.find({user_type: 'admin', user_status: 'active'},
        {_id:0, user_businessEmail:1},(err, user) => {
            if (err) {  res.status(500).send(err);}
            if(user){
                user.forEach(function(value){
                    email = value.user_businessEmail;
                    emails.push(email);
                    emails = emails.filter( function( item, index, inputArray ) {
                        return inputArray.indexOf(item) == index;
                        });
                    Rssfeed.aggregate(
                        [{$match:{feed_status:{$eq:'mailed'} ,sent: {$gt:new Date(Date.now() - date)} }},
                        {$group : { _id:{primary_keyword: "$primary_keyword"} ,
                        title:{ $push: "$articles_title"}, source: {$push: "$articles_url"} }}
                            ],(err, rssfeed) =>{
                            if (err) {
                                console.log(err);
                                res.send(err);
                            }
                            if(rssfeed){
                                summaryEmailtoAdmin(emails,rssfeed);
                                res.json(rssfeed);     
                            }
                        });
                })
            }     
        }); 

    

})

/* Send Feeds by mail */
app.get('/sendEmail/:feed',(req,res)=>{
    var sentDate = new Date();
    var emails = [];
    var mailList = [];
    var newEmails = [];
    var newWmail =[];
    const feed =req.params.feed.split(","); 
    for(i=0; i<feed.length;i++){
        Rssfeed.findById(feed[i],(err,rssfeed) => {
            if (err) {
                res.send(err);
            } 
            if(rssfeed){
                keyword = rssfeed.keyword.split(","); 
                 for(i=0;i<keyword.length;i++){
                    return new Promise(function(resolve, reject) {
                        Users.find({user_keywords: { $regex: keyword[i]}, user_status: 'active'},
                        {_id:0, user_businessEmail:1},(err, user) => {
                            if (err) {  res.status(500).send(err);}
                            if(user){
                                user.forEach(function(value){
                                    if(value != null){
                                    emails.push(value.user_businessEmail);
                                    }
                                })
                                mailList = emails;
                            }  
                           mailList = mailList.filter( function( item, index, inputArray ) {
                            return inputArray.indexOf(item) == index;
                            });
                        resolve(mailList);
                         sendEmailtoUsers(mailList,rssfeed.articles_title,rssfeed.articles_description,rssfeed.articles_content,rssfeed.articles_urlToImage,rssfeed.articles_url);
                         Rssfeed.findByIdAndUpdate({'_id':rssfeed._id},{$set:{'sent':sentDate, 'feed_status': 'mailed'}},{new: true },  function(err, result){
                            if(err){
                                console.log(err);
                            }
                            if (result) {
                              res.json({"status":"success"});
                            }
                        });   
                        }); 
                    });
                              
                } 
            
            }
        }); 
    }
}) 
/* Summary mail at 9pm everyday
'00 00 21 * * *'
*/
cron.schedule('00 00 14 * * *', function(){
    const date = 1 * 24 * 60 * 60 * 1000;
    var email;
    var emails = [];
       Users.find({user_type: 'admin', user_status: 'active'},
       {_id:0, user_businessEmail:1},(err, user) => {
           if (err) {  res.status(500).send(err);}
           if(user){
               user.forEach(function(value){
                   email = value.user_businessEmail;
                   emails.push(email);
                   emails = emails.filter( function( item, index, inputArray ) {
                       return inputArray.indexOf(item) == index;
                       });
                   Rssfeed.aggregate(
                       [{$match:{feed_status:{$eq:'mailed'} ,sent: {$gt:new Date(Date.now() - date)} }},
                       {$group : { _id:{primary_keyword: "$primary_keyword"} ,
                       title:{ $push: "$articles_title"}, source: {$push: "$articles_url"} }}
                           ],(err, rssfeed) =>{
                           if (err) {
                               console.log(err);
                               res.send(err);
                           }
                           if(rssfeed){
                               console.log('hi');
                               summaryEmailtoAdmin(emails,rssfeed);
                                
                           }
                       });
               })
           }     
       }); 
  });
  app.route('/changeDate').get((req,res) => {
    Rssfeed.find({}, (err, rssfeed) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if(rssfeed)
        {
            rssfeed.forEach(function(value){
                var newform = new Date(value.channel_item_pubDate_0_value);
                Rssfeed.findByIdAndUpdate({'_id':value._id},{$set:{'channel_item_pubDate_0_value':newform}}, {new: true },  function(err, result){
                    if(err){
                       }
                    if (result) {
                         }
                });
            });
        }
        
    }); 
})
};

