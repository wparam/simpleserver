
module.exports = function(app){
    app.get('/', function (req, res) {
        res.render('index', {title: 'Hey', message: 'Hello world'});
    });
};



