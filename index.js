// initialize express app (wrapper around node HTTP service)
var express = require('express');
var app = express();

// set our public folder (for resource requests)
app.use(express.static('public'));

// catch the default route and return our index.html file
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

// listen on port 4000
app.listen(4000)
console.log('app listening on 4000')
