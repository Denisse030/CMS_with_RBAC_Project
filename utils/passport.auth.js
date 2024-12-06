const passport = require('passport');
const LocalSrategey = require('passport-local');
const User = require('../models/user.model');
const Log = require('../models/log.model');

passport.use(
  new LocalSrategey(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Username/email is not registered' });
        }
        const isMatch = await user.isValidPassword(password);
        if (isMatch) {
          await Log.create({ action: 'User Login', user: user._id, metadata: { email } });
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect Password' });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
