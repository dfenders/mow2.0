var express = require('express');
var router = express.Router();

/* GET settings listing. */
router.get('/', function(req, res, next) {
  req.app.get('db').query('SELECT * FROM ingredient', function (err, rows, fields) {
    if (err) throw err
    var ingredient_list = rows;
    res.render('settings', {title: 'Settings', ingredient_list:ingredient_list});
  });
});

/* POST settings */
router.post('/new', function(req, res, next) {
  console.log(req.body);
  var k = "";
  var v = "";
  for(var key in req.body) {
    k = key;
    if (req.body.hasOwnProperty(key)) {
      req.body[key] = req.body[key].toString();
      v = req.body[key];
    }
  }

  req.app.get('db').query("INSERT INTO `settings` (k,v) VALUES (?,?) ON DUPLICATE KEY UPDATE v = ?",[k,v,v], function (err, rows, fields) {
    if (err) throw err

    return "success";
  });
});

router.post('/ingredient/new', function(req, res, next) {
  console.log(req.body);
  for(var key in req.body)
    if(req.body.hasOwnProperty(key))
      req.body[key] = req.body[key].toString();

  req.app.get('db').query("INSERT INTO `ingredient` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/settings/");
  });
});

module.exports = router;
