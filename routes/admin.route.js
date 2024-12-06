const router = require('express').Router();
const User = require('../models/user.model'); 
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');
const Log = require('../models/log.model');
const { contract } = require('../blockchain/web3'); // Import contract from web3.js

router.post('/update-role', async (req, res, next) => {
  try {
      const { id, role } = req.body;
      if (!id || !role) {
          req.flash('error', 'Invalid request');
          return res.redirect('back');
      }

      const user = await User.findByIdAndUpdate(id, { role }, { new: true });
      req.flash('info', `Updated role for ${user.email} to ${user.role}`);

      // Log the role update to the blockchain
      await logAction("Role Update", role, user._id);

      res.redirect('back');
  } catch (error) {
      next(error);
  }
});


router.get('/logs', async (req, res, next) => {
  try {
      const logs = await Log.find()
          .populate('user', 'email')
          .sort({ timestamp: -1 });
      res.render('logs', { logs });
  } catch (error) {
      console.error('Error rendering logs:', error);
      next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find(); 
    // res.send(users);
    res.render('manage-user', {users});
  } catch (error) {
    next(error);
  }
});

router.get('/user/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id');
        res.redirect('/admin/users');
        return;
      }
      const person = await User.findById(id);
      res.render('profile', { person });
    } catch (error) {
      next(error);
    }
  });

  router.post('/update-role', async (req, res, next) => {
    try {
      const { id, role } = req.body;
        if (!id || !role) {
        req.flash('error', 'Invalid request');
        return res.redirect('back');
      }
        if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id');
        return res.redirect('back');
      }
        const rolesArray = Object.values(roles);
        if (!rolesArray.includes(role)) {
        req.flash('error', 'Invalid role');
        return res.redirect('back');
      }
        if (req.user.id === id) {
        req.flash(
          'error',
          'Admins cannot remove themselves from Admin, ask another admin.'
        );
        return res.redirect('back');
      }
        const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      );
      req.flash('info', `updated role for ${user.email} to ${user.role}`);
      res.redirect('back');
    } catch (error) {
      next(error);
    }
  });

  router.get('/blockchain-logs', async (req, res, next) => {
    try {
        const logsCount = await contract.methods.getLogsCount().call(); // Get total logs count
        const logs = [];
        
        // Loop through logs and fetch each one
        for (let i = 0; i < logsCount; i++) {
            const log = await contract.methods.getLog(i).call();
            logs.push({
                action: log[0],
                user: log[1],
                role: log[2],
                timestamp: new Date(log[3] * 1000).toLocaleString(),
            });
        }
        
        // Render the logs in a view
        res.render('blockchain-logs', { logs });
    } catch (error) {
        console.error("Error fetching blockchain logs:", error);
        next(error);
    }
});

router.get('/blockchain-logs', async (req, res, next) => {
  try {
      const logsCount = await contract.methods.getLogsCount().call(); // Get total log count
      const logs = [];

      for (let i = 0; i < logsCount; i++) {
          const log = await contract.methods.getLog(i).call(); // Fetch each log
          logs.push({
              action: log[0],
              user: log[1],
              role: log[2],
              timestamp: new Date(log[3] * 1000).toLocaleString(),
          });
      }

      res.render('blockchain-logs', { logs }); // Render logs to a new EJS view
  } catch (error) {
      console.error("Error fetching blockchain logs:", error);
      next(error);
  }
});

  
module.exports = router;