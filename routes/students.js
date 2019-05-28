var router = require('express').Router();
var studentsCtrl = require('../controllers/students');
var imageUpload = require('../config/imageUpload');

// GET /students
router.get('/students', studentsCtrl.index);

// POST /facts
// We will already have access to the logged in student on
// the server, therefore do not use: /students/:id/facts
router.post('/facts', isLoggedIn, studentsCtrl.addFact);

// DELETE /facts/:id
router.delete('/facts/:id', studentsCtrl.delFact);

// render image upload form
router.get('/upload', studentsCtrl.upload);

// post request to make upload to S3
router.post('/upload', imageUpload.array('images', 3), function(req, res, next) {
  req.files.forEach(function(file) {
    req.user.profileImages.push(file.location);
  })
  req.user.save(function(err) {
    if (err) {
      console.log('ERROR')
      console.log(err);
    }
    res.redirect('/students');
  });
})

// display collection of all images for student
router.get('/student/:id/images', studentsCtrl.profileImages);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}

module.exports = router;
