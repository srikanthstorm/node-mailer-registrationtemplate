# Installation

## Install the package with NPM:

Run `npm i node-mailer-template`


## Usage

 var mailer = require('node-mailer-template')
 mailer.sendEmailtoUsers("toAddress","title","Description","fromEmail",'password');

### Example

 mailer.sendEmailtoUsers("xyz@gmail.com","Title","Description","yourusername%40gmail.com",'password');

 ![Screenshot](https://github.com/srikanthstorm/node-mailer-registrationtemplate/blob/master/template.png)


 Note: `@ in the from email should be mentioned as %40 or else your from email will fail to work, It can be normal for to email`
 if any requirements or updates mail us at srikanthnaidu512@gmail.com
