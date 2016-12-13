var express = require('express')
var router = express.Router()
var multer = require('multer')

var uploading = multer({
  dest: __dirname + '../public/uploads/',
  limits: {fileSize: 1000000, files:1},
})


router.post('/upload', uploading, function(req, res, next) {
 res.send('this is working')
})

module.exports = router;
