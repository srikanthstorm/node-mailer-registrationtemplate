const Keywords = require('../model/keywords'); 
const stockCodes = require('../model/stockCodes'); 

const db = require ('../db');
module.exports = function(app, db) {
/* List of all keywords */
  app.get('/Keywords',(req,res)=>{
    Keywords.find({keyword_status: 'active'},(err, keyword) => {
      if (err) {
        res.send(err);
      }
      res.json(keyword);
    });
});
app.get('/keywords/:status',(req,res)=>{
    Keywords.find({keyword_status: req.params.status}, (err, keyword) => {
      if (err) {
        res.send(err);
      }
      res.json(keyword);
    });
});
/* Deactivate Many Keywords */
app.route('/keywords/deactivate/:feed').put((req,res) =>{
    var sucess;
    const data =req.params.feed.split(",");
    for (var i = 0; i < data.length; i++) {
      Keywords.findByIdAndUpdate({ '_id': data[i] },{$set:{'keyword_status':'deactive'}}, {new: true },  function(err, result){
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
      res.json({"status": "Unable to deactivate Keywords"})
  } else {
    res.json({"status": "Selected Keywords Deactivated"})  
  }    
})
app.route('/keywords/activate/:feed').put((req,res) =>{
  var sucess;
  const data =req.params.feed.split(",");
  for (var i = 0; i < data.length; i++) {
    Keywords.findByIdAndUpdate({ '_id': data[i] },{$set:{'keyword_status':'active'}}, {new: true },  function(err, result){
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
    res.json({"status": "Unable to activate Keywords"})
} else {
  res.json({"status": "Selected Keywords activated"})  
}    
})
/* Add New Keyword  */
app.post('/addKeyword', (req, res) => {
    let keyword = JSON.parse(Object.keys(req.body)[0]);
    Keywords.create(keyword)
      .then(function () {
        res.json('success');
      })
      .catch(function (err) {
        res.status(400).send(err);
      });
});
/*Update Keywords*/
app.put('/Keywords/update', (request,res) => {
  let data = JSON.parse(Object.keys(request.body)[0]);
  Keywords.findOneAndUpdate({'_id':data.id},{$set:{'keyword_name':data.keyword_name}},{new: true },  function(err, result){
      if(err){
          console.log(err);
          res.json({"status":"Unable to Update Keyword"})
      }
      if (result) {
        res.json({"status":"Keyword Updated",result });
      }
  });
});
/* List of Stock Codes*/
app.get('/StockCodes',(req,res)=>{
    stockCodes.find({stock_status: 'active'}, (err, stockCode) => {
      if (err) {
        res.send(err);
      }
      res.json(stockCode);
    }).limit(100);
});
/* List of all Sources by status */
app.get('/stockCode/:status',(req,res)=>{
    stockCodes.find({stock_status: req.params.status}, (err, stockCode) => {
      if (err) {
        res.send(err);
      }
      res.json(stockCode);
    });
});
/* Deactivate StockCode */
app.put('/stockCode/deactivate/:id',(req,res)=>{
    stockCodes.findByIdAndUpdate({'_id':req.params.id},{$set:{'stock_status':'deactive'}}, {new: true },  function(err, result){
        if(err){
            res.json({"status":"Unable to Deactivate Stock Code"})
        }
        if (result) {
            res.json({"status":"Stock Code Deactivated",result});
        }
  
    });
  
  });
/* Deactivate Many StockCodes */
app.route('/stockCodes/ignoreMany/:feed').put((req,res) =>{
      var sucess;
      const data =req.params.feed.split(",");
      for (var i = 0; i < data.length; i++) {
        stockCodes.findByIdAndUpdate({ '_id': data[i] },{$set:{'stock_status':'deactive'}}, {new: true },  function(err, result){
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
        res.json({"status": "Unable to deactivate Company"})
    } else {
      res.json({"status": "Selected Companies Deactivated"})  
    }    
})
/*Update Stock Code*/
app.put('/stockCode/update', (request,res) => {
    let data = JSON.parse(Object.keys(request.body)[0]);
    stockCodes.findOneAndUpdate({'_id':data._id},{$set:{'stock_name':data.stock_name, 'stock_code': data.stock_code, 'stock_sector': data.stock_sector}},{new: true },  function(err, result){
        if(err){
            console.log(err);
            res.json({"status":"Unable to Update StockCode"})
        }
        if (result) {
          res.json({"status":"Stock Code Updated",result });
        }
    });
});
/* Add New Stock Code */
app.post('/addStockCode', (req, res) => {
    let stockCode = JSON.parse(Object.keys(req.body)[0]);
    stockCodes.create(stockCode)
      .then(function () {
        res.json('success');
      })
      .catch(function (err) {
        res.status(400).send(err);
      });
});
//Re -activate Stock Code
app.put('/stockCode/reactivate/:id',(req,res)=>{
  stockCodes.findByIdAndUpdate({'_id':req.params.id},{$set:{'stock_status':'active'}}, {new: true },  function(err, result){
    if(err){
      res.json({"status":"Unable to re-activate Company"})
  }
  if (result) {
      res.json({"status":"Company Activated Again",result});
  }
  });
});
};

