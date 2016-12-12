var express = require('express');
var router = express.Router();
var FoundObject = require('../models/found');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  // get all the todos and render the index view
  FoundObject.find({})
  .then(function(foundObjects) {
    res.render('found-objects/index', { foundObjects: foundObjects } );
  }, function(err) {
    return next(err);
  });
});

// NEW
router.get('/new', function(req, res, next) {
  var foundObject = {
    title: '',
    location: '',
    about: '',
  };
  res.render('found-objects/new', { foundObject: foundObject } );
});

// SHOW
router.get('/:id', function(req, res, next) {
  FoundObject.findById(req.params.id)
  .then(function(foundObject) {
    if (!foundObject) return next(makeError(res, 'Document not found', 404));
    res.render('found-objects/show', { foundObject: foundObject });
  }, function(err) {
    return next(err);
  });
});

// CREATE
router.post('/', function(req, res, next) {
  var foundObject = new FoundObject({
    title: req.body.title,
    location: req.body.location,
    about: req.body.about,
  });
  foundObject.save()
  .then(function(saved) {
    res.redirect('/found-objects');
  }, function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  FoundObject.findById(req.params.id)
  .then(function(foundObject) {
    if (!foundObject) return next(makeError(res, 'Document not found', 404));
    res.render('found-objects/edit', { foundObject: foundObject });
  }, function(err) {
    return next(err);
  });
});

// UPDATE
router.put('/:id', function(req, res, next) {
  FoundObject.findById(req.params.id)
  .then(function(foundObject) {
    if (!foundObject) return next(makeError(res, 'Document not found', 404));
    foundObject.title = req.body.title;
    foundObject.location = req.body.location;
    foundObject.about = req.body.about;
    return foundObject.save();
  })
  .then(function(saved) {
    res.redirect('/found-objects');
  }, function(err) {
    return next(err);
  });
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  FoundObject.findByIdAndRemove(req.params.id)
  .then(function() {
    res.redirect('/found-objects');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
