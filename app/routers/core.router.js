const {handleProxy, syncRequest} = require('../controllers/core.ctrl');

module.exports = function(app){
    app.get('/', function (req, res) {
        res.end('Hello');
    });

    app.get('/sherpa/*', handleProxy);
    
};




