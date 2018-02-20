var express = require('express');
var router = express.Router();

/* GET routes listing. */
router.get('/', function(req, res, next) {
  req.app.get('db').query('SELECT * FROM driver', function (err, rows, fields) {
    if (err) throw err
    var driver_list = rows;

    req.app.get('db').query('SELECT * FROM customer WHERE Sunday IS NOT NULL', function(err, rows, fields){
      if (err) throw err
      var customer_list = rows;

      req.app.get('db').query("SELECT route.id, route.name, route.day, concat(driver.firstName, ' ', driver.lastName) as driver, route.customer FROM route JOIN driver on driver.id = route.driver WHERE route.status != 'deleted' or route.status is NULL", function(err, rows, fields) {
        if (err) throw err
        var route_list = rows;
        res.render('routes', {title: 'Routes (' + route_list.length + ')', driver_list: driver_list, customer_list: customer_list, route_list:route_list});
      });
    });
  });
});

/* POST new route item */
router.post('/new', function(req, res, next) {
  for(var key in req.body)
    if(req.body.hasOwnProperty(key))
      req.body[key] = req.body[key].toString();

  req.app.get('db').query("INSERT INTO `route` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/routes/");
  });
});

/* GET delete route item */
router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("UPDATE `route` SET status = 'deleted' WHERE id = " + id, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/routes/");
  });
});


module.exports = router;
