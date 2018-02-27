var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('ok');
})

app.post('/api/logs', function(req, res){
  console.log('got data from client');
  res.json({
      status: 'OK',
      data: req.body
  });
});

app.listen(3000, function() {
    console.log('listening on 3000');
});