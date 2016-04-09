var express = require('express');
var app = express();

app.set('views', __dirname);
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});
app.listen(4000)
console.log('app listening')
