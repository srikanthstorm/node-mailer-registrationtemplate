
var mail = require('./server/routes/Emailservice.js');
module.exports.sendEmailtoUsers = function(to,title,description,fromEmail,password){
         mail.sendPasswordReset(to,title,description,fromEmail,password);


}

/*Summary Email */
