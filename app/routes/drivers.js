var express = require('express');
var router = express.Router();

/* GET drivers listing. */
router.get('/', function(req, res, next) {
  req.app.get('db').query("SELECT * FROM driver WHERE status != 'deleted' or status is NULL", function (err, rows, fields) {
    if (err) throw err
    var driver_list = rows;

    res.render('drivers', {title: 'Drivers (' + driver_list.length + ')', driver_list: driver_list});
  });
});

/* POST new driver */
router.post('/new', function(req, res, next) {
  console.log(req.body);

  for(var key in req.body)
    if(req.body.hasOwnProperty(key))
      req.body[key] = req.body[key].toString();


  req.app.get('db').query("INSERT INTO `driver` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/drivers/");
  });
});

/* GET delete driver item */
router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("UPDATE `driver` SET status = 'deleted' WHERE id = " + id, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/drivers/");
  });
});

module.exports = router;
