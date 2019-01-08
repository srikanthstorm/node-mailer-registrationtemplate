
// exports.sendPasswordReset = function (email, title, description,content,image,source) {
var nodeMailer = require("nodemailer");
var EmailTemplate = require('email-templates').EmailTemplate;


exports.sendPasswordReset = function (email, title, description,from,password) {

  var sender = 'smtps://'+from;   // The emailto use in sending the email
  //(Change the @ symbol to %40 or do a url encoding )
  var password = password;  // password of the email to use

  var transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.gmail.com');
  var sendResetPasswordLink = transporter.templateSender(new EmailTemplate('./template/sendFeeds'));
  var sendSummaryEmail = transporter.templateSender(new EmailTemplate('./template/summaryMails'));

    sendResetPasswordLink({
        to: email,
        subject: 'News Feeds of the Day'
    }, {
        title: title,
        description: description,
        content: "content",
        image: "image",
        source: "source"
    }, function (err, info) {
        if (err) {
         //   console.log(err)
        } else {
            console.log('Link sent\n'+ JSON.stringify(info));
        }
    });
};

exports.sendSummaryMail = function (email, feeds) {
    var content =  feeds.forEach(function(feed){
        var primary = feed._id.primary_keyword;
        var titles = feed.title;
        + '<p>'+ primary +'<p>'+
       titles.forEach(function(title){
          +'<ul><li>' +title+ '</li></ul>'
       })
    });
      sendSummaryEmail({
        to: email,
        subject: 'Summary of Mailed Stories'
    }, {
        feeds: feeds
    }, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log('Link sent\n');
        }
    });

};
