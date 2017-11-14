var express     = require('express');               // ExperssJS Framework
var router      = express.Router();                 // var global route
var passport    = require('passport');

var Logement    = require('../models/logement');    // import data models virment
var User        = require('../models/user');        // import data models user





// Filtre
router.get('/filtre', passport.authenticate('jwt', { session: false }), function(req, res) {

    Logement.find({}, function(err, logement){
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(logement);
        }
    }).sort({"reservation.checkInDate": 1});              // --- 1 for asc and -1 for desc

});



// Afficher la page des logements
router.get('/logements', passport.authenticate('jwt', { session: false }), function(req, res) {
    Logement.find({userId : req.user.id}, function(err, logement){
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(logement);
        }
    });

});

// Add logement
router.post('/logement', passport.authenticate('jwt', { session: false }), function(req, res) {


    var logement = new Logement();
        logement.userId = req.user._id;
        logement.type = req.body.type;
        logement.nbRoom = req.body.nbRoom;
        logement.prix = req.body.prix;
        logement.country = req.body.country;
        logement.city = req.body.city;
        logement.address = req.body.address;
        logement.description = req.body.description;
        logement.reservation.checkInDate = req.body.checkInDate;
        logement.reservation.checkOutDate = req.body.checkOutDate;


        logement.save(function(err) {
            if (err) {
                console.log("err" + JSON.stringify(err));
                res.status(500).send({ success: false, message: "Imposible d'ajouter le logement"});
            }
            else{

                logement.save(function(err) {
                    if (err) {
                        res.status(500).send({ success: false, message: "Imposible d'effectuer l'ajout"});
                    }
                    else{
                        res.status(201).send({ success: true });
                    }
                });

            }
        });
});





// Modifier le logement
router.put('/logement/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    Logement.findByIdAndUpdate({_id: req.params.id}, req.body).then(function () {       // mettre à jour le virement selon son id

        Logement.findOne({_id: req.params.id}).then(function (logement) {
            res.send(logement);
        });

    });
});

// Supprimer le logement
router.delete('/logement/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    Logement.findByIdAndRemove({_id: req.params.id}).then(function (logement) {  // supprime user selon son id
        res.send(logement);
    });
});


module.exports = router;