const router = require('express').Router();
const User = require('../models/user.model');


router.get('/profile', async (req, res, next) => {
  // console.log(req.user);
  const person = req.user;
  res.render('profile', { person });
});

module.exports = router;