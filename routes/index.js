var express = require('express');
var router = express.Router();
var bing = require("node-bing-api")({ accKey: "456f57f1122745889c431d6e01d4fc63" });
var mongoose = require('mongoose');
var searchTerm = require('../models/searchTerm');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/recentSearches', function(req, res){
  console.log("Test");
  mongoose.connect("mongodb://admin:admin@ds119728.mlab.com:19728/prototype");
  searchTerm.find({}, function(err, data){
    if(err){
      res.send("Can't find database");
    }
    else
      res.json(data);
  });
});

router.get('/api/:val(*)', function(req, res){
  var val = req.params.val;
  var offset = req.query.offset||0;
  
  mongoose.connect("mongodb://admin:admin@ds119728.mlab.com:19728/prototype");
  
  var data = new searchTerm({
    searchVal: val,
    searchDate : new Date()
  });
  
  data.save(function(err){
    if(err)
        res.send("Error Saving to Database");
  });
  
  bing.images(val, {
    top: 10,
    offset: offset
  }, function(error, rez, body){
    if(error){
      console.log("Something is wrong");
    }
    var bingData = [];
    for(var i=0; i<10; i++){
      bingData.push({
        url: body.value[i].webSearchUrl,
        snippet: body.value[i].name,
        thumbnail: body.value[i].thumbnailUrl,
        context: body.value[i].hostPageDisplayUrl
      });
    }
    res.json(bingData);
  });
});

module.exports = router;
