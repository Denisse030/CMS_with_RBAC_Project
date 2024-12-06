const router = require('express').Router();
const User = require('../models/user.model'); 
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');
const Log = require('../models/log.model');

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
  
module.exports = router;