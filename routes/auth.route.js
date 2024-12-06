const router = require('express').Router();
const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');


router.get(
    '/login',
    connectEnsureLogin.ensureLoggedOut({ redirectTo: '/' }),
    async (req, res, next) => {
        res.render('login');
    }
);

router.post(
    '/login',
    connectEnsureLogin.ensureLoggedOut({ redirectTo: '/' }),
    passport.authenticate('local', {
        successReturnToOrRedirect: '/', 
        failureRedirect: '/auth/login', 
        failureFlash: true,
    })
);

router.get(
    '/register',
    connectEnsureLogin.ensureLoggedOut({ redirectTo: '/' }),
    async (req, res, next) => {
        res.render('register');
    }
);

router.post(
    '/register',
    connectEnsureLogin.ensureLoggedOut({ redirectTo: '/' }),
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email must be a valid email')
            .normalizeEmail()
            .toLowerCase(),
        body('password')
            .trim()
            .isLength(2)
            .withMessage('Password length is short, min 2 characters required'),
        body('password2').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password do not match');
            }
            return true;
        }),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Handle validation errors
                errors.array().forEach((error) => {
                    req.flash('error', error.msg);
                });
                res.render('register', {
                    email: req.body.email,
                    messages: req.flash(),
                });
                return;
            }

            const { email } = req.body;
            const doesExist = await User.findOne({ email });
            if (doesExist) {
                res.redirect('/auth/register');
                return;
            }
            const user = new User(req.body);
            await user.save();
            req.flash(
                'success',
                `${user.email} registered successfully, you can now login`
            );
            res.redirect('/auth/login');
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/logout',
    connectEnsureLogin.ensureLoggedIn({ redirectTo: '/' }),
    async (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    }
);

module.exports = router;

