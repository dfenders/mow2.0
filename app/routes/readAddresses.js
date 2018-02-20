var express = require('express');
var fs = require("fs");
var csv = require("fast-csv");
var async = require("async");
var router = express.Router();

/* GET settings listing. */
router.get('/', function(req, res, next) {
  var asyncTasks = [];
  var stream = fs.createReadStream("C:\\Users\\adonm\\Desktop\\lds-nz-street-address-CSV\\nz-street-address.csv");

  var csvStream = csv.fromStream(stream, {headers : true})
      .on("data", function(data){
        if(data["town_city"] == "Dunedin" || data["town_city"] == "Mosgiel") {
          asyncTasks.push(function (callback) {
            var address = data["full_address"];
            var lat = data["shape_Y"];
            var lng = data["shape_X"];
            req.app.get('db').query("INSERT INTO `addresses` (address,lat,lng) VALUES (?,?,?) ON DUPLICATE KEY UPDATE address = ?", [address, lat, lng, address], function (err, rows, fields) {
              callback();
            });
          });
        }
      }).on("end", function(){
        async.parallel(asyncTasks, function(){
          console.log("DONE!!!");
        });
      });
});

module.exports = router;