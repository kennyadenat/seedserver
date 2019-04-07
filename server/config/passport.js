const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').OAuth2Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;



module.exports = function () {

  passport.serializeUser((user, done) => {

  });

  passport.deserializeUser((user, done) => {

  });

  //Passport JWT
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'secret';
  opts.issuer = 'accounts.examplesoft.com';
  opts.audience = 'yoursite.net';


  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({
      id: jwt_payload.sub
    }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  }));


  //Use Local Strategy
  passport.use(new LocalStrategy(
    function (username, password, done) {
      User.findOne({
        username: username
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));

  //Google Strategy
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID || config.google.clientID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));

  //Facebook Strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({
        facebookId: profile.id
      }, function (err, user) {
        return cb(err, user);
      });
    }
  ));

  //Twitter Strategy
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL
    },
    function (token, tokenSecret, profile, cb) {
      User.findOrCreate({
        twitterId: profile.id
      }, function (err, user) {
        return cb(err, user);
      });
    }
  ));


  //Github Strategy
  passport.use(new GitHubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({
        githubId: profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'github',
            github: profile._json
          })
          user.save(err => {})
        } else {
          return done(err, user);
        }
      });
    }
  ));


  //LinkedIn Strategy
  passport.use(new LinkedInStrategy({
      consumerKey: config.linkedin.clientID,
      consumerSecret: LINKEDIN_SECRET_KEY,
      callbackURL: "/auth/linkedin/callback"
    },
    function (token, tokenSecret, profile, done) {
      User.findOne({
        linkedinId: profile.id
      }, function (err, user) {
        return done(err, user);
      });
    }
  ));


  //Instagram Strategy
  passport.use(new InstagramStrategy({
      clientID: INSTAGRAM_CLIENT_ID,
      clientSecret: INSTAGRAM_CLIENT_SECRET,
      callbackURL: "/auth/instagram/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({
        instagramId: profile.id
      }, function (err, user) {
        return done(err, user);
      });
    }
  ));


}