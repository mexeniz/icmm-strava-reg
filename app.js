var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , StravaStrategy = require('passport-strava-oauth2').Strategy
  , fs = require('fs');;
var urlencode = require('urlencode');

const models = require('./models')

var STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
var STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
var BIND_ADDRESS = process.env.BIND_ADDRESS || "localhost";
var PORT = process.env.PORT || 3000;
var CALL_BACK_URL = process.env.CALL_BACK_URL || `http://${BIND_ADDRESS}:${PORT}`;
var AUTH_DATA_FILE = process.env.AUTH_DATA_FILE || "./auth_data.txt";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Strava profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


// Use the StravaStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Strava
//   profile), and invoke a callback with a user object.
passport.use(new StravaStrategy({
  clientID: STRAVA_CLIENT_ID,
  clientSecret: STRAVA_CLIENT_SECRET,
  callbackURL: `${CALL_BACK_URL}`
},
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Strava profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Strava account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express.createServer();

// configure Express
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'intania icmm' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

app.get('/profile', ensureAuthenticated, function(req, res){
  // TODO(M): Read users table here ...
  var data = { 
    stravaProfile: req.user,
    user: {
      intania: 96,
      totalDistance: 96.96
    }
  };
  res.render('profile', data);
});

// GET /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Strava authentication will involve
//   redirecting the user to strava.com.  After authorization, Strava
//   will redirect the user back to this application at /auth/strava/callback
app.get('/login',
  passport.authenticate('strava', { scope: ['public']}),
  function(req, res){
    // The request will be redirected to Strava for authentication, so this
    // function will not be called.
  });

// GET /auth/strava/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/strava/callback', 
  passport.authenticate('strava', { failureRedirect: '/' }),
  function(req, res) {
    // Log token/code and save them to a file.
    var user = req.user
    var code = req.query.code
    console.log(`Code:${code}, Authorized user:`);
    console.log(user._raw);

    return models.users.findAll({
      limit: 1,
      where: {
        strava_id: user.id,
      },
    }).then(entries => {
      if (entries.length == 0) {
        return models.users.create({
          first_name: user.name.givenName,
          last_name: user.name.familyName,
          strava_id: user.id,
          strava_code: code,
          strava_token: user.token,
        })
      }
    }).then(() => {
      return res.redirect('/');
    }).catch(err => {
      console.error(err);
      return res.redirect('/auth/strava')
    })
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/me',
  (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/strava')
    }

    const user = req.user;
    const { registration_id, phone_number, first_name, last_name, race_type, race_category } = req.body;

    return models.users.findAll({
      limit: 1,
      where: {
        strava_id: user.id,
      },
    }).then(entries => {
      if (entries.length == 0) {
        return res.redirect('/auth/strava')
      }

      let user = entries[0];

      if (registration_id) {
        user.registration_id = registration_id;

        return user.save()
      } else if (phone_number && first_name && last_name && race_type && race_category) {
        return models.registrations.findAll({
          limit: 1,
          where: {
            phone_number,
            first_name,
            last_name,
            race_type,
            race_category,
          }
        }).then(entries => {
          if (entries.length == 0) {
            return res.status(404).send({
              message: 'No matching registration information'
            });
          }

          user.registration_id = entries[0].id;

          return user.save()
        })
      } else {
        return res.status(400).send({
          message: 'Bad request'
        });
      }
    }).then(() => {
      return res.redirect('/');
    }).catch(err => {
      console.error(err);
      return res.redirect('/auth/strava')
    })
  });

app.listen(PORT, BIND_ADDRESS);
console.log(`App listen ${BIND_ADDRESS}:${PORT}`);
console.log(`App Strava Client ${STRAVA_CLIENT_ID}`);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
