var express = require('express');
var router = express.Router();

/* GET menu listing. */
router.get('/', function(req, res, next) {

  req.app.get('db').query('SELECT * FROM settings', function (err, rows, fields) {
    var settings = rows;
    var weekStarts = null;
    for(var i=0;i<settings.length;i++)
      if(settings[i]['k'] == 'weekStarts')
        weekStarts = settings[i]['v'];

    req.app.get('db').query("SELECT * FROM menu ORDER BY cast(week as decimal) asc, FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')", function (err, rows, fields) {
      var menu = rows;
      req.app.get('db').query('SELECT * FROM food', function (err, rows, fields) {
        var food = rows;
        req.app.get('db').query('SELECT * FROM ingredient', function (err, rows, fields) {
          var ingredient_list = rows;
          res.render('menu', {title: 'Menu', food: food, menu: menu, weekStarts: weekStarts, ingredient_list:ingredient_list});
        });
      });
    });
  });
});

/* POST new menu item */
router.post('/new', function(req, res, next) {
  console.log(req.body);

  for(var key in req.body)
    if(req.body.hasOwnProperty(key))
      req.body[key] = req.body[key].toString();


  req.app.get('db').query("INSERT INTO `menu` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/menu/");
  });
});

/* POST new food item */
router.post('/food/new', function(req, res, next) {
  console.log(req.body);

  for(var key in req.body)
    if(req.body.hasOwnProperty(key))
      req.body[key] = req.body[key].toString();


  req.app.get('db').query("INSERT INTO `food` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/menu/");
  });
});


module.exports = router;
