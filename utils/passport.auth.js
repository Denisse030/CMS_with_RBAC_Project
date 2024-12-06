const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user.model');
const Log = require('../models/log.model');
const { web3, contract } = require('../blockchain/web3');

// Function to log actions to the blockchain
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
        console.error("Blockchain logging error:", error);
    }
}

// Passport strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true, // Enable req access in callback
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Username/email is not registered' });
                }

                const isMatch = await user.isValidPassword(password);
                if (isMatch) {
                    // Log the successful login to the blockchain
                    await logAction("User Login", user.role);

                    // Log to MongoDB (existing logging mechanism)
                    await Log.create({ action: 'User Login', user: user._id, metadata: { email } });

                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect Password' });
                }
            } catch (error) {
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
