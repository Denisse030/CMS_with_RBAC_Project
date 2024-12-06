const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const connectEnsureLogin = require('connect-ensure-login');
const { roles } = require('./utils/constants');
const User = require('./models/user.model');
const contentRoute = require('./routes/content.route');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.DB_NAME,
      collectionName: 'sessions',
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/user', connectEnsureLogin.ensureLoggedIn({redirectTo: '/auth/login'}), require('./routes/user.route'));
app.use('/admin', connectEnsureLogin.ensureLoggedIn({redirectTo: '/auth/login'}), ensureAdmin, require('./routes/admin.route'));
app.use('/content', connectEnsureLogin.ensureLoggedIn({ redirectTo: '/auth/login' }), contentRoute);

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render('error_40x', { error });
});

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log('💾 connected...');
    app.listen(PORT, () => console.log(`🚀 on port ${PORT}`));
  })
  .catch((err) => console.log(err.message));

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect('/auth/login');
//   }
// } // protect routes (how we authorize these routes depending on the status of the authentication of the user) we can write either a middleware like function or we can install a package (which we will do eventually) --- we installed the package connect-ensure-login

function ensureAdmin(req, res, next) {
    if (req.user.role === roles.admin) {
      next();
    } else {
      req.flash('warning', 'You are not authorized to see this route.');
      res.redirect('/');
    }
  }

  function ensureModerator(req, res, next) {
    if (req.user.role === roles.moderator) {
      next();
    } else {
      req.flash('warning', 'you are not Authorized to see this route');
      res.redirect('/');
    }
  }

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy for secure cookies
    session.cookie.secure = true; // Serve cookies only over HTTPS
}