# Installation

## Install the package with NPM:

```bash
npm i node-mailer-template
```

## Usage

 
```bash
 var mailer = require('node-mailer-template')
 mailer.sendEmailtoUsers("recipientEmail","Title","Description","senderEmail",'Password');
```
### Example

```bash
 mailer.sendEmailtoUsers("toemail@gmail.com","Title","Description","youremail%40gmail.com",'password');
```
 ![Screenshot](https://github.com/srikanthstorm/node-mailer-registrationtemplate/blob/master/template.png)


 ```bash
 Note: @ in the from sender email should be mentioned as %40 or else your from email will fail to work, It can be normal for to recipient email
 ```
 if any requirements or updates mail us at srikanthnaidu512@gmail.com
