var express             = require('express');
var socket              = require('socket.io');
var path                = require('path');
var bodyParser          = require('body-parser');
var config              = require('./config/database');
var mongoose            = require('mongoose');
var bcrypt              = require('bcrypt');
var morgan              = require('morgan');
var passport            = require('passport');
var expressJWT          = require('express-jwt');
var cors                = require('cors');


mongoose.connect(config.database);
var db                  = mongoose.connection;
var MongoStore = require('connect-mongo');

// bring in passport strategy we just defined
require('./config/passport')(passport);

// Init App
var app = express();


// Declaration Models
var User     = require('./models/user');



app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization,Client-Security-Token");
    next();
});

app.options('/*', function (request, response, next) {
    response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    response.send();
});

app.use(bodyParser.json());                         // Parseir applciation/json
app.use(bodyParser.urlencoded({extended: false}));  // Pour parser dans la BD
app.use(morgan('dev'));                             // voir log status des pages
app.use(passport.initialize());                     // initialise passport for user
app.use(cors());

/*------------Declaration Routes Avec Path definit une fois-------------------*/
app.use('/',   require('./routes/userRoutes'));




/* *************************************************Chat************************************************************* */
// Pour charger toutes les 'vues.pug' dans le dossier 'views'
app.set('views',path.join(__dirname, 'public'));
app.set('view engine','pug');
app.use(express.static(path.join(__dirname, 'public'))); // Declaration du dossier public



// Start Server
var server = app.listen(3000, function(){
    console.log('Server started on port 3000');
});


