
module.exports = function(app){
    app.get('/', function (req, res) {
        res.send('Hello World!')
    });
    console.log('hit')
}




