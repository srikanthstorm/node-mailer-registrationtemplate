const Source = require('../model/source'); 
const db = require ('../db');
const fs = require('fs');
const request = require('request');
const headers = {
    'Content-Type': 'application/json',
    'X-Requested-By': 'sdc'
};

module.exports = function(app, db) {
    /* List of all Sources */
    app.get('/Source',(req,res)=>{
    Source.find({source_status: 'active'}, (err, source) => {
      if (err) {
        res.send(err);
      }
      res.json(source);
    });
    });
    /* List of all Sources by status */
    app.get('/Source/:status',(req,res)=>{
    Source.find({source_status: req.params.status}, (err, source) => {
      if (err) {
        res.send(err);
      }
      res.json(source);
    });
    });
    /* Deactivate Source */
    app.put('/source/deactivate/:id',(req,res)=>{
     Source.findByIdAndUpdate({'_id':req.params.id},{$set:{'source_status':"deactive"}},{new: true },  function(err, source){
        if(err){
            res.json({"status":"Unable to Deactivate Source"})
        }
        if (source) {
            var pipeline = source.pipelineId;
            var options = {
                url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+ pipeline ,
                method: 'DELETE',
                headers: headers,
                auth: {
                    'user': 'admin',
                    'pass': 'admin'
                }
            };
        
            
             function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                   // console.log(body);
                }
            }
            request(options, callback); 
            res.json({"status":"Source Deactivated", source});
        }
    });
   
    });
    /* Deactivate Many Sources */
app.route('/Source/ignoreMany/:feed').put((req,res) =>{
      var sucess;
      var newSource ;
      const data =req.params.feed.split(",");
      for (var i = 0; i < data.length; i++) {
        Source.findByIdAndUpdate({ '_id': data[i] },{$set:{'source_status':'deactive'}}, {new: true },  function(err, source){
              if(err){
                  sucess = false;
                  console.log(err);
              }
              if (source) {
                  var pipeline = source.pipelineId;
                  var options = {
                    url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+ pipeline ,
                    method: 'DELETE',
                    headers: headers,
                    auth: {
                        'user': 'admin',
                        'pass': 'admin'
                    }
                };
                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                       // console.log(body);
                    }
                }
                request(options, callback); 
                 sucess = true;
                 newSource =  source;
                 return newSource;
              }
          });
      }
      if( sucess == true){
        res.json({"status": "Unable to deactivate Sources"})
    } else {
      res.json({"status": "Selected Sources Deactivated"})  
    }    
  })
    /*Update Source*/
  app.put('/source/update', (request,res) => {
      let data = JSON.parse(Object.keys(request.body)[0])
     Source.findByIdAndUpdate({'_id':data._id},
    {$set:{'source_name':data.source_name, 'userid': data.userid, 'password': data.password,
     'api_key': data.api_key, 'source_type': data.source_type}},{new: true },  function(err, source){
        if(err){
            console.log(err);
        }
        if (source) {
            res.json({"status":"Source values updated",source});
        }
    });
    });
  //Re -activate source
app.put('/source/reactivate/:id',(req,res)=>{
  Source.findByIdAndUpdate({'_id':req.params.id},{$set:{'source_status':'active'}}, {new: true },  function(err, result){
    if(err){
      res.json({"status":"Unable to re-activate Source"})
  }
  if (result) {
     let file = fs.readFileSync('./template/pipeline.json');
      let newFile = JSON.parse(file);
      newFile.pipelineConfig.pipelineId = result.pipelineId;
      newFile.pipelineConfig.title = result.pipelineId;
      for(i =0; i< newFile.pipelineConfig.stages[0].configuration.length; i++){
          if(newFile.pipelineConfig.stages[0].configuration[i].name === 'conf.resourceUrl') {
               newFile.pipelineConfig.stages[0].configuration[i].value = result.link+result.api_key;
             //  console.log(newFile.pipelineConfig.stages[0].configuration[i].value );
          }
      }  
      let newPipwline = JSON.stringify(newFile, null, 2);
      fs.writeFile('./template/pipeline.json', newPipwline, function (err) {
          if (err) return console.log(err);  
      });
      var dataString = newPipwline;
      var options = {

        url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+  result.pipelineId +'/import',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: {
            'user': 'admin',
            'pass': 'admin'
        }
    }; 
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
       // console.log(body);
        } else { console.log(error)}
    }
    request(options, callback);
    res.json({"status":"Source Activated Again",result});
  }
  });
});
    /* Add New Source  */
/*  */
app.post('/addSource', (req, res) => {
    let source = JSON.parse(Object.keys(req.body)[0]);
    let url = source.link.replace(/zxc/gi,'&');
    let url1 = url.replace(/zyem/gi,'=');
    source.link = url1;
    Source.create(source, function (err, data) {
        if(data){
            if(data.api_key !== '' || typeof data.api_key !== 'undefined'){
                source_url = data.link + data.api_key;
            }else{
                source_url = data.link;  
            }
            // let file = fs.readFileSync('./template/xmlPipelines.json');
            let file = fs.readFileSync('./template/BSONPipelines.json');
            let newFile = JSON.parse(file);
            title = data._id + data.source_name;
            newFile.pipelineConfig.pipelineId = title;
            newFile.pipelineConfig.title = title;
            for(i =0; i< newFile.pipelineConfig.stages[0].configuration.length; i++){
                if(newFile.pipelineConfig.stages[0].configuration[i].name === 'conf.resourceUrl') {
                     newFile.pipelineConfig.stages[0].configuration[i].value = data.link + data.api_key;
                 }
            } 
            for(i=0; i< newFile.pipelineConfig.stages.length; i++){
                for(j=0; j< newFile.pipelineConfig.stages[i].configuration[0].value.length; j++){
                    if(newFile.pipelineConfig.stages[i].configuration[0].value[j].fieldToSet === '/articles_source_name'){
                    newFile.pipelineConfig.stages[i].configuration[0].value[j].expression = data.source_name;
                    }    
                }
            }
            let newPipwline = JSON.stringify(newFile, null, 2);
                fs.writeFile('./template/BSONPipelines.json', newPipwline, function (err) {
                    if (err) return console.log(err);  
                })
                Source.findByIdAndUpdate({'_id':data._id},
                {$set:{ 'pipelineId': title}},{new: true },  function(err, source){ 
                })
               var dataString = newPipwline;
                 var options = {
                         url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+  title +'/import',
                         method: 'POST',
                         headers: headers,
                         body: dataString,
                         auth: {
                             'user': 'admin',
                             'pass': 'admin'
                         }
                     }; 
                 function callback(error, response, body) {
                     if (!error && response.statusCode == 200) {
                    // console.log(body);
                 } else { console.log(error)}
             }
             request(options, callback); 
                 res.json('success'); 
        }
    })
});

/* Create pipeline for existing source */

}
