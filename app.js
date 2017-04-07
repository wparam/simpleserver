var express = require('express')
var path = require('path')
var app = express()
var router = require('./app/routers/core.router')(app)

app.set('views', './app/views');
app.set('view engine', 'pug');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(3001, function(){
    console.log('server is running');
});