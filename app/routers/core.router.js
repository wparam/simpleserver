var son =require('../controllers/son.ctrl');
module.exports = function(app){
    app.get('/', function (req, res) {
        res.render('index', {title: 'Hey', message: 'Hello world'});
    });

    app.get('/son', son.handle.bind(son));
    
};




