var express     = require('express');               // ExperssJS Framework
var router      = express.Router();                 // var global route
var passport    = require('passport');

var mailrequest = require('request');

var Reservation    = require('../models/reservation');    // import data models virment
var User        = require('../models/user');        // import data models user



// Renvoie toutes les reservations de l'utilisateur connecté
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    Reservation.find({userId : req.user.id}, function(err, reservations){
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(reservations);
        }
    });

});


// Ajout de reservation + check si date isBooked
//Les dates doivent être au format (MM/DD/YYYY) sinon la convertion en date ne marche pas.
router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res) {


    var reservation = new Reservation();
        reservation.userId = req.user._id;
        reservation.logementId = req.body.logementId;
        reservation.checkInDate = req.body.checkInDate;
        reservation.checkOutDate = req.body.checkOutDate;

        //Requete permettant de checker si une reservation existe déja dans la periode désiré
        //Problème comparaison de date
        //Requete fonctionne sur mongoDB en ajoutant ISODate()
        var isBookedQuery = {
            logementId : reservation.logementId,
            $or: [
                {
                    checkInDate: { $lte: new Date(reservation.checkInDate) },
                    checkOutDate: { $gte: new Date(reservation.checkInDate) }
                },
                {
                    checkInDate: { $lte: new Date(reservation.checkOutDate) },
                    checkOutDate: { $gte: new Date(reservation.checkOutDate) }
                }
            ]

        };

        console.log(JSON.stringify(isBookedQuery));
        var nbReserv = Reservation.find(isBookedQuery).count();

        

        var isBooked = nbReserv>0?true:false;

        if(isBooked){
            res.status(500).send({ success: false, message: "Le logement est déja booké dans la période sélectionné."});
        }
        else{
            reservation.save(function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ success: false, message: "Impossible d'ajouter la reservation"});
                }
                else{
                    //Envoie d'un mail de confirmation à l'utilisateur
                    sendConfirmationMail(req.user.email);
                    res.status(201).send({ success: true, "Preview URL (Mail Ethereal)":"Dans la console" });
                }
            });
        }

        
});

function sendConfirmationMail(to){
    to = to;
    subject = "Confirmation";
    text = "Bonjour, \nNous vous confirmons votre réservervation. \nCordialement.";
    var MailResponse = {};

    mailrequest.post('http://localhost:3000/mail/send?subject='+ subject +'&to='+ to +'&body='+ text, function (error, response, body) {
          
        if (!error && response.statusCode == 200) {
            console.log("Mail response :");
            console.log(body);
        }
    });

}

// Supprimer la reservation
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    Reservation.findByIdAndRemove({_id: req.params.id}).then(function (reservation) {  // supprime selon son id
        res.status(200).send(reservation);
    });
});


module.exports = router;