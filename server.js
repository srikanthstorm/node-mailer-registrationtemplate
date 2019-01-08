
var mail = require('./server/routes/Emailservice.js');
module.exports.sendEmailtoUsers = function (toemail, title, description,loginname,loginpassword,username,password,loginlink) {
         mail.sendPasswordReset(toemail, title, description,loginname,loginpassword,username,password,loginlink);


}

/*Summary Email */
