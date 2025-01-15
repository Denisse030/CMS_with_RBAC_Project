const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user.model');
const Log = require('../models/log.model');
const { web3, contract } = require('../blockchain/web3');
const { isAnomalous } = require('./anomaly-detection');
const thresholds = require('./thresholds');

console.log('Thresholds loaded in passport.auth.js:', thresholds);

async function logAction(action, role) {
    try {
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        await contract.methods.addLog(action, role).send({
            from: sender,
            gas: 3000000,
        });

        console.log(`Action "${action}" logged on blockchain.`);
    } catch (error) {
        console.error('Blockchain logging error:', error);
    }
}

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Username/email is not registered' });
                }
                const isMatch = await user.isValidPassword(password);
                if (isMatch) {
                    console.log('Password match. Resetting failed attempts.');
                    const failedAttempts = user.failedAttempts || 0;
                    if (isAnomalous(failedAttempts, thresholds)) {
                        console.log('Anomalous login detected for user:', user.id);
                        req.flash('warning', 'Suspicious login detected. Please verify your identity.');
                    }
                    user.failedAttempts = 0;
                    await user.save();
                    await logAction('User Login', user.role);
                    return done(null, user);
                } else {
                    console.log(`Password mismatch for user: ${email}`);

                    user.failedAttempts = (user.failedAttempts || 0) + 1;
                    await user.save();
                    if (isAnomalous(user.failedAttempts, thresholds)) {
                        console.log('Anomalous login detected for user:', email);
                        req.flash('warning', 'Suspicious login detected. Please verify your identity.');
                    }
                    return done(null, false, { message: 'Incorrect Password' });
                }
            } catch (error) {
                console.error('Error during login:', error);
                return done(error);
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

module.exports = passport;
module.exports.logAction = logAction;
