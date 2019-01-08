const http = require('http');
var cron = require('node-cron');
var request = require('request');
const Source = require('../model/source'); 
const fs = require('fs');
var headers = {
    'Content-Type': 'application/json',
    'X-Requested-By': 'sdc'
};


module.exports = function(app, db) {
// Status of pipelines
app.route('/getPipestatus').get((req,res) =>{
    var options = {
        url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipelines/status',
        headers: headers,
        auth: {
            'user': 'admin',
            'pass': 'admin'
        }
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
           // console.log(body);
            res.json(body) ;
        }
    }
    
    request(options, callback);
  
})
//status of a Pipeline
app.route('/getPipestatus/byID/:pipelineID').get((req,res) =>{
    var pipelineID = req.params.pipelineID;
    var options = {
        url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+ pipelineID +'/status',
        headers: headers,
        auth: {
            'user': 'admin',
            'pass': 'admin'
        }
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
           //console.log(JSON.parse(body));
            res.json(JSON.parse(body)) ;
        }
    }
    
    request(options, callback);
  
})
//start a pipeline
app.route('/startPipeline/:pipelineID').put((req,res) => {
    var pipelineID = req.params.pipelineID;
    var options = {
        url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+pipelineID +'/start?rev=0',
        method: 'POST',
        headers: headers,
        auth: {
            'user': 'admin',
            'pass': 'admin'
        }
    };

    
     function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
           // console.log(body);
            res.json({"status":"Process starting",body});
        }
    }
    request(options, callback);  
    
    
})
app.route('/autoTagStories').get((req,res)=> {

    http.get('http://18.233.97.89:5001/hellomain', (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          console.log(JSON.parse(data).explanation);
          res.json('success')
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });

})
//stop a pipeline
app.route('/stopPipeline/:pipelineID').put((req,res) => {
   var pipelineID = req.params.pipelineID;
   var options = {
    url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+ pipelineID +'/stop?rev=0',
    method: 'POST',
    headers: headers,
    auth: {
        'user': 'admin',
        'pass': 'admin'
        }
    };
    function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        res.json({"status":"Process stopped",body});
    }
    }
    request(options, callback);
   
})
/* create pipeline  */
app.post('/createPipeline/:id', (req, res) => {
    Source.findById(req.params.id, (err, source) => {
        if (err) {
            res.send(err);
        }
        var  name = source._id + source.source_name;
        var url = source.link + source.api_key; 
        let file = fs.readFileSync('./template/pipeline.json');
         let newFile = JSON.parse(file);
         newFile.pipelineConfig.title = name;
         for(i =0; i< newFile.pipelineConfig.stages[0].configuration.length; i++){
            if(newFile.pipelineConfig.stages[0].configuration[i].name === 'conf.resourceUrl') {
                 newFile.pipelineConfig.stages[0].configuration[i].value = url;
            }
         }  
         let data = JSON.stringify(newFile, null, 2);
         fs.writeFile('./template/pipeline.json', data, function (err) {
            if (err) return console.log(err);
            console.log('writing to ');
            res.json({"status":"success"});
          });  
    });
   
   
});
/*Start All Pipelines */
app.route('/startAllPipelines').post((req,res) => {
    var sucess;
   Source.find({source_status: 'active'}, (err, source) => {
        if (err) {
          res.send(err);
        }
        if(source) {
            for(var i=0; i<source.length; i++) {
               // console.log(source[i].pipelineId);
                var options = {
                    url: 'http://ec2-54-152-4-232.compute-1.amazonaws.com:18630/rest/v1/pipeline/'+source[i].pipelineId +'/start?rev=0',
                    method: 'POST',
                    headers: headers,
                    auth: {
                        'user': 'admin',
                        'pass': 'admin'
                    }
                };
                 function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                       // console.log(body);
                       sucess = true;
                    }
                }
                request(options, callback);  
            }
            if( sucess == true){
                res.json({"status": "Unable to start Pipelines"})
            } else {
              res.json({"status": "All Pipelines Started"})  
            }  
        } 
      });
     
})

}

