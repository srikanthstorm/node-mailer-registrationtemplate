const Users = require('../model/Users'); 
const db = require ('../db');

module.exports = function(app, db) {
/* Login by Username and password */
  app.get('/Users/:username/:password',(req,res)=>{
    Users.find({username: req.params.username, password: req.params.password, user_status: 'active'}, (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  });
  /*Fetch by ID */
  app.get('/Users/:id',(req,res)=>{
    Users.findById(req.params.id, (err, user) => {
      if (err) {
          res.send(err);
      }
      res.json(user);
    });
  });
/* List of all Users */
  app.get('/Users',(req,res)=>{
    Users.find({user_type: 'user', user_status: 'active'}, (err, user) => {
      if (err) {
        res.send(err);

      }
      res.json(user);
    });

  });
  /* by Status */
  app.get('/UsersStatus/:status',(req,res)=>{
    Users.find({user_type: 'user', user_status: req.params.status}, (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    });

  });
  /* add new user */
  app.post('/addUser', (req, res) => {
    let user = JSON.parse(Object.keys(req.body)[0]);
    console.log(user);
    Users.create(user)
      .then(function () {
        res.json('success');
      })
      .catch(function (err) {
        res.status(400).send(err);
      });
});
/* Deactivate User */
app.put('/User/deactivate/:id',(req,res)=>{
  console.log('from routes', req.params.id);
  Users.findByIdAndUpdate({'_id':req.params.id},{$set:{'user_status':'deactive'}}, {new: true },  function(err, result){
    if(err){
      res.json({"status":"Unable to deactivate User"})
  }
  if (result) {
      res.json({"status":"User Deactivated ",result});
  }
  });
});
//Re -activate User
app.put('/User/reactivate/:id',(req,res)=>{
  console.log('from routes', req.params.id);
  Users.findByIdAndUpdate({'_id':req.params.id},{$set:{'user_status':'active'}}, {new: true },  function(err, result){
    if(err){
      res.json({"status":"Unable to re-activate User"})
  }
  if (result) {
      res.json({"status":"User Activated Again",result});
  }
  });
});
/* Delete Many */
app.route('/user/deactivateMany/:feed').put((req,res) =>{
  var sucess;
  const data =req.params.feed.split(",");
  console.log('adc',data);
  for (var i = 0; i < data.length; i++) {
    Users.findByIdAndUpdate({ '_id': data[i] },{$set:{'user_status':'deactive'}}, {new: true },  function(err, result){
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
    res.json({"status": "Unable to deactivate Users"})
   
} else {
  res.json({"status": "Selected Users Deactivated"})
}
  
})
   /*Update Password*/
   app.put('/User/updatePassword/', (req,res) => {
    let data = JSON.parse(Object.keys(req.body)[0])
  console.log(data);
  Users.findOneAndUpdate({'user_lname':data.user_lname},
  {$set:{'password': data.password,
   'api_key': data.api_key}},{new: true },  function(err, result){
      if(err){
          console.log(err);
      }
      if (result) {
          res.json('success',result);
      }
  });
  });
/*Update Preferences */
app.route('/users/:id/:user_keywords/:user_stockCodes').put((req,res) =>{
  Users.findByIdAndUpdate({'_id':req.params.id},{$set:{'user_keywords':req.params.user_keywords, 'user_stockCodes': req.params.user_stockCodes, 'feed_status': 'tagged'}},{new: true },  function(err, result){
      if(err){
          console.log(err);
      }
      if (result) {
          res.json('success');
      }
  });
  })
      /*Update user*/
      app.put('/User/update', (request,res) => {
        let data = JSON.parse(Object.keys(request.body)[0])
      console.log(data);
       Users.findByIdAndUpdate({'_id':data._id},
      {$set:{'user_fname':data.user_fname, 'user_lname': data.user_lname, 'user_businessname': data.user_businessname,
       'user_businessEmail': data.user_businessEmail, 'user_businessphone1': data.user_businessphone1,
       'user_businessphone2': data.user_businessphone2, 'user_address': data.user_address, 
       'user_city': data.user_city, 'user_state':data.user_state, 'user_country':data.user_country,
       'user_zip': data.user_zip}},{new: true },  function(err, source){
          if(err){
              console.log(err);
          }
          if (source) {
              res.json({"status":"User values updated",source});
          }
      });
      });
/*Update User */
app.put('/user/update', (req,res) => {
  let data = JSON.parse(Object.keys(req.body)[0])
console.log('sds',data);
/* Users.findByIdAndUpdate({'_id':data._id},
{$set:{'user_fname':data.user_fname, 'user_lname': data.user_lname, 'user_businessname': data.user_businessname,
'user_businessEmail': data.user_businessEmail, 'user_businessphone1': data.user_businessphone1,
'user_businessphone2': data.user_businessphone2, 'user_address': data.user_address, 
'user_city': data.user_city, 'user_state':data.user_state, 'user_country':data.user_country,
'user_zip': data.user_zip}},{new: true },  function(err, result){
    if(err){
        console.log(err);
    }
    if (result) {
        res.json({"status":"User values updated"});
    }
}); */
});
};
