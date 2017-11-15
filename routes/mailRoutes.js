var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* Envoi de Mail (Simulation via Ethereal)*/
router.post('/send', function(req, res, next) {
  
    var to = req.query.to;
    var subject = req.query.subject;
    var body = req.query.body;

    nodemailer.createTestAccount((err, account) => {
    
        // Creation d'un objet smtp de test à partir de ethereal
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass  // generated ethereal password
            }
        });
    
        let mailOptions = {
            from: 'ynovnanterne@gmail.com',
            to: to,
            subject: subject,
            text: body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            //En cas d'erreur on revoie une erreur 500 avec le message d'erreur au format json
            if (error) {
                errorMailer = {
                    "Error": error.message
                }

                res.status(500).send(errorMailer);
            }
            else{
                //En cas de succès on envoit l'url permettant de voir la simulation du mail sur ethereal
                successMailer ={
                    "Message sent": info.messageId,
                    // Preview only available when sending through an Ethereal account
                    "Preview URL" : nodemailer.getTestMessageUrl(info)
                };

                res.status(200).send(successMailer);
            }
        });
    });
});

module.exports = router;