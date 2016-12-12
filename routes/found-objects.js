var express = require('express');
var router = express.Router();
var FoundObject = require('../models/found');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    req.flash('error', 'Please signup or login.');
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
  // get all the todos and render the index view
  var foundObjects = global.currentUser.foundObjects;
    res.render('found-objects/index', { foundObjects: foundObjects, message: req.flash() } );
  }, function(err) {
    return next(err);
  });

// NEW
router.get('/new', authenticate, function(req, res, next) {
  var foundObject = {
    title: '',
    location: '',
    about: '',
    timestamp: true
  };
  res.render('found-objects/new', { foundObject: foundObject } );
});


// SHOW
// router.get('/:id', authenticate, function(req, res, next) {
//   FoundObject.findById(req.params.id)
//   .then(function(foundObject) {
//     if (!foundObject) return next(makeError(res, 'Document not found', 404));
//     res.render('found-objects/show', { foundObject: foundObject });
//   }, function(err) {
//     return next(err);
//   });
// });

router.get('/:id', authenticate, function(req, res, next) {
  var foundObject = currentUser.foundObjects.id(req.params.id);
  if (!foundObject) return next(makeError(res, 'Document not found', 404));
  res.render('found-objects/show', { foundObject: foundObject, message: req.flash() } );
});

// CREATE
// router.post('/', function(req, res, next) {
//   var foundObject = new FoundObject({
//     title: req.body.title,
//     location: req.body.location,
//     about: req.body.about
//   });
//   foundObject.save()
//   .then(function(saved) {
//     res.redirect('/found-objects');
//   }, function(err) {
//     return next(err);
//   });
// });

router.post('/', authenticate, function(req, res, next) {
  var foundObject = {
    title: req.body.title,
    location: req.body.location,
    about: req.body.about
  };
  // Since a user's todos are an embedded document, we just need to push a new
  // TODO to the user's list of todos and save the user.
  currentUser.foundObjects.push(foundObject);
  currentUser.save()
  .then(function() {
    res.redirect('/found-objects');
  }, function(err) {
    return next(err);
  });
});

// EDIT
// router.get('/:id/edit', function(req, res, next) {
//   FoundObject.findById(req.params.id)
//   .then(function(foundObject) {
//     if (!foundObject) return next(makeError(res, 'Document not found', 404));
//     res.render('found-objects/edit', { foundObject: foundObject });
//   }, function(err) {
//     return next(err);
//   });
// });

router.get('/:id/edit', authenticate, function(req, res, next) {
  var foundObject = currentUser.foundObjects.id(req.params.id);
  if (!foundObject) return next(makeError(res, 'Document not found', 404));
  res.render('found-objects/edit', { foundObject: foundObject, message: req.flash() } );
});

// UPDATE
// router.put('/:id', function(req, res, next) {
//   FoundObject.findById(req.params.id)
//   .then(function(foundObject) {
//     if (!foundObject) return next(makeError(res, 'Document not found', 404));
//     foundObject.title = req.body.title;
//     foundObject.location = req.body.location;
//     foundObject.about = req.body.about;
//     return foundObject.save();
//   })
//   .then(function(saved) {
//     res.redirect('/found-objects');
//   }, function(err) {
//     return next(err);
//   });
// });

router.put('/:id', authenticate, function(req, res, next) {
  var foundObject = currentUser.foundObjects.id(req.params.id);
  if (!foundObject) return next(makeError(res, 'Document not found', 404));
  else {
    foundObject.title = req.body.title;
    foundObject.location = req.body.location;
    foundObject.about = req.body.about;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/found-objects');
    }, function(err) {
      return next(err);
    });
  }
});

// DESTROY
// router.delete('/:id', function(req, res, next) {
//   FoundObject.findByIdAndRemove(req.params.id)
//   .then(function() {
//     res.redirect('/found-objects');
//   }, function(err) {
//     return next(err);
//   });
// });

router.delete('/:id', authenticate, function(req, res, next) {
  var foundObject = currentUser.foundObjects.id(req.params.id);
  if (!foundObject) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.foundObjects.indexOf(foundObject);
  currentUser.foundObjects.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/found-objects');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
