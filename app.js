var express = require('express'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    settings = require('./settings.json');

var app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var conn = mysql.createPool({
	host: settings.mysql.host,
	user: settings.mysql.user,
	password: settings.mysql.password,
	database: settings.mysql.database
});
app.get('/users', function(req, res) {
  conn.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ', err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err: err.code
            });
        } else {
            connection.query('SELECT * FROM user', function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err: err.code
                    });
                }
                res.send({
                    result: 'success',
                    err: '',
                    json: rows,
                    length: rows.length
                });
                connection.release();
            });

        }
    });
});

// app.param('collectionName', function(req, res, next, collectionName){
//   req.collection = db.collection(collectionName)
//   return next()
// })

// app.get('/', function(req, res, next) {
//   res.send('please select a collection, e.g., /collections/messages')
// })

// app.get('/collections/:collectionName', function(req, res, next) {
//   req.collection.find({} ,{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
//     if (e) return next(e)
//     res.send(results)
//   })
// })

// app.post('/collections/:collectionName', function(req, res, next) {
//   req.collection.insert(req.body, {}, function(e, results){
//     if (e) return next(e)
//     res.send(results)
//   })
// })

// app.get('/collections/:collectionName/:id', function(req, res, next) {
//   req.collection.findById(req.params.id, function(e, result){
//     if (e) return next(e)
//     res.send(result)
//   })
// })

// app.put('/collections/:collectionName/:id', function(req, res, next) {
//   req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
//     if (e) return next(e)
//     res.send((result===1)?{msg:'success'}:{msg:'error'})
//   })
// })

// app.del('/collections/:collectionName/:id', function(req, res, next) {
//   req.collection.removeById(req.params.id, function(e, result){
//     if (e) return next(e)
//     res.send((result===1)?{msg:'success'}:{msg:'error'})
//   })
// })

app.listen(3000)
