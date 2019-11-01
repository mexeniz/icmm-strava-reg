var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , StravaStrategy = require('passport-strava-oauth2').Strategy
  , fs = require('fs');
var urlencode = require('urlencode');

const models = require('./models')
const resHelper = require('./resHelper')
const queryHelper = require('./queryHelper')
const path = require('path')

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_SCOPE = process.env.STRAVA_SCOPE || "activity:read,profile:read_all";
const BIND_ADDRESS = process.env.BIND_ADDRESS || "0.0.0.0";
const PORT = process.env.PORT || 3000;
const CALL_BACK_URL = process.env.CALL_BACK_URL || `http://${BIND_ADDRESS}:${PORT}`;
const SERVICE_TYPE = process.env.SERVICE_TYPE || "intania";
const BASE_HREF = process.env.BASE_HREF || null;

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
    var user = profile
    var userId;
    console.log(`Authorized user logins: ${user.name.givenName} ${user.name.familyName}`);
    console.log(user._raw);
    models.users.findAll({
      limit: 1,
      where: {
        strava_id: user.id,
      }
    }).then(entries => {
      if (entries.length == 0) {
        return models.users.create({
          first_name: user.name.givenName,
          last_name: user.name.familyName,
          strava_id: user.id
        })
      } else {
        userId = entries[0].id;
        console.log(`Found user: id=${userId} strava_id=${user.id}`);
      }
    }).then((entry) => {
      if (entry) {
        userId = entry.id;
        console.log(`Created new user: id=${userId} strava_id=${user.id}`);
      }

      return models.credentials.findAll({
        limit: 1,
        where: {
          strava_client: STRAVA_CLIENT_ID,
          user_id: userId,
        }
      })
    }).then(entries => {
      if (entries.length == 0) {
        console.log(`Creating new credential: id=${userId} strava_client=${STRAVA_CLIENT_ID}`);
        return models.credentials.create({
          user_id: userId,
          strava_client: STRAVA_CLIENT_ID,
          strava_token: accessToken,
          strava_refresh: refreshToken
        })
      }
      // else{
      //   console.log(`Updating a credential: id=${userId} strava_client=${STRAVA_CLIENT_ID}`);
      //   return models.credentials.update({
      //     strava_client: STRAVA_CLIENT_ID,
      //     strava_token: accessToken,
      //     strava_refresh: refreshToken
      //   },{
      //     where: {
      //       strava_client: STRAVA_CLIENT_ID,
      //       user_id: userId,
      //     }
      //   });
      // }
    }).then(entry => {
      // asynchronous verification, for effect...    
      process.nextTick(function () {
        return done(null, profile);
      });
    })
  }
));

var app = express.createServer();

// if (BASE_HREF){
//   app.locals.baseURL = BASE_HREF;
// }

// configure Express
app.configure(function () {
  if (SERVICE_TYPE === "foundation") {
    console.log("Run as foundation challenge service");
    app.set('views', __dirname + '/views/foundation');
  } else {
    console.log("Run as intania challenge service");
    app.set('views', __dirname + '/views/intania');
  }
  app.set('trust proxy', 1);
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
	  secret: 'intania icmm' , 
	  proxy: true,
    key: 'connection.sid',
  }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});


app.get('/', function (req, res) {
  if (req.user) {
    // User is authenticated
    queryHelper.getOneUserByStravaId(req.user.id).then(entries => {
      if (entries == null || entries.length == 0) {
        // Failed to find user information
        res.render('index', { user: null });
      } else {
        var data = resHelper.makeUserData(entries[0], req.user);
        res.render('index', data);
      }
    })
  } else {
    // User is not authenticated
    res.render('index', { user: null });
  }
});

app.get('/profile', ensureAuthenticated, function (req, res) {
  queryHelper.getOneUserByStravaId(req.user.id).then(entries => {
    if (entries == null || entries.length == 0) {
      return res.status(404).send({
        message: 'No matching strava account information'
      });
    } else {
      var data = resHelper.makeUserData(entries[0], req.user);
      res.render('profile', data);
    }

  })
});

// GET /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Strava authentication will involve
//   redirecting the user to strava.com.  After authorization, Strava
//   will redirect the user back to this application at /login/callback
app.get('/login',
  passport.authenticate('strava', { scope: [STRAVA_SCOPE] }),
  function (req, res) {
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
  function (req, res) {
    // Log token/code and save them to a file.
    var user = req.user
    var code = req.query.code
    var userId;
    console.log(`Code:${code}, Authorized user:`);
    console.log(user._raw);

    return models.users.findAll({
      limit: 1,
      where: {
        strava_id: user.id,
      }
    }).then(entries => {
      if (entries.length == 0) {
        return models.users.create({
          first_name: user.name.givenName,
          last_name: user.name.familyName,
          strava_id: user.id
        })
      } else {
        userId = entries[0].id;
        console.log(`Found user: id=${userId} strava_id=${user.id}`);
      }
    }).then((entry) => {
      if (entry) {
        userId = entry.id;
        console.log(`Created new user: id=${userId} strava_id=${user.id}`);
      }

      return models.credentials.findAll({
        limit: 1,
        where: {
          strava_client: STRAVA_CLIENT_ID,
          user_id: userId,
        }
      })
    }).then(entries => {
      if (entries.length == 0) {
        console.log(`Creating new credential: id=${userId} strava_client=${STRAVA_CLIENT_ID}`);
        return models.credentials.create({
          user_id: userId,
          strava_client: STRAVA_CLIENT_ID,
          strava_token: user.token,
          strava_code: code,
        })
      } else {
        console.log(`Updating a credential: id=${userId} strava_client=${STRAVA_CLIENT_ID}`);
        return models.credentials.update({
          strava_token: user.token,
          strava_code: code,
        }, {
          where: {
            strava_client: STRAVA_CLIENT_ID,
            user_id: userId
          }
        });
      }
    })
      .then(() => {
        return resHelper.redirect(res, BASE_HREF, '/');
      }).catch(err => {
        console.error(err);
        return resHelper.redirect(res, BASE_HREF, '/login');
      })
  });

app.get('/logout', function (req, res) {
  req.logout();
  resHelper.redirect(res, BASE_HREF, '/');
});

if (SERVICE_TYPE == "foundation") {
  app.post('/me',
    (req, res) => {
      if (!req.isAuthenticated()) {
        return resHelper.redirect(res, BASE_HREF, '/login');
      }

      const user = req.user;
      console.log('req.body');
      console.log(req.body);
      const { registrationId, phoneNumber, firstName, lastName, raceType } = req.body;

      return queryHelper.getOneUserByStravaId(req.user.id).then(entries => {
        if (entries.length == 0) {
          return resHelper.redirect(res, BASE_HREF, '/login');
        }
        let user = entries[0];
        if (user.registration) {
          // Registration info
          return res.status(400).send({
            message: 'User have already registered.'
          });
        }

        if (registrationId) {
          // Register by registration ID from Thai.run
          return models.registrations.findAll({
            limit: 1,
            where: {
              registration_id: registrationId,
            }
          }).then(entries => {
            if (entries.length == 0) {
              var data = resHelper.makeUserData(user, req.user);
              data['error'] = {
                message: "ข้อมูลรหัสลงทะเบียนไม่ถูกต้อง"
              }
              return res.render('error', data);
            }
            // Update user.registration_id in database
            user.registration_id = entries[0].id;
            return user.save()
          })
        } else if (firstName && lastName && phoneNumber) {
          // Register by general information
          return models.registrations.findAll({
            limit: 1,
            where: {
              phone_number: phoneNumber,
              first_name: firstName,
              last_name: lastName,
            }
          }).then(entries => {
            if (entries.length == 0) {
              var data = resHelper.makeUserData(user, req.user);
              data['error'] = {
                message: "ข้อมูล ชื่อ นามสกุล หรือ เบอร์โทร ไม่ถูกต้อง"
              }
              return res.render('error', data);
            }
            // Update user.registration_id in database
            user.registration_id = entries[0].id;
            return user.save()
          })
        } else {
          return res.status(400).send({
            message: 'Bad request'
          });
        }
      }).then(() => {
        return resHelper.redirect(res, BASE_HREF, '/profile');
      }).catch(err => {
        console.error(err);
        return res.render('error', {
          error: {
            message: "Internal server error"
          }
        });
      })
    });
}


app.get('/vis', function (req, res) {
  //app.set('views', __dirname+'/views/vis');
  res.render('../vis/index', { layout: 'blank.ejs', user: null });
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
  return resHelper.redirect(res, BASE_HREF, '/login');
}