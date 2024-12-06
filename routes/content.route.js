const router = require('express').Router();
const Content = require('../models/content.model');
const { roles } = require('../utils/constants');

router.get('/list', async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === roles.moderator) {
      query.createdBy = req.user._id;
    }

    const content = await Content.find(query).populate('createdBy', 'email');
    res.render('content-list', { content });
  } catch (error) {
    next(error);
  }
});

router.get('/create', async (req, res, next) => {
  try {
    res.render('create-content');
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      req.flash('error', 'Title and body are required');
      return res.redirect('/content/create');
    }
    await Content.create({
      title,
      body,
      createdBy: req.user._id,
    });

    req.flash('success', 'Content created successfully');
    res.redirect('/content/list');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
