const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router;
const app = express();
const cors = require('cors');
var mysql = require('mysql');

var con = mysql.createConnection({

  host: 'localhost',
  user: 'root',
  password: 'q',
  database: 'online_shop'

});

const frontendDirectoryPath = path.resolve(__dirname, './../static');

console.log('satic resource at ' + frontendDirectoryPath);
app.use(express.static(frontendDirectoryPath));
app.use(cors());
// always want to have / api /

const apiRouter = new router();
app.use('/api', apiRouter);
apiRouter.get('/', (req, res) => {
    res.send({ 'shop-api': '1.0' });
});

apiRouter.get('/products', (req, res) => {
    con.query('select * from products', function(err, rows) {
    if (err)
      throw err;
    res.json(rows)
    });
});

apiRouter.get('/categories', (req, res) => {
    con.query('select * from product_categories', function(err, rows) {
    if (err)
      throw err;
    res.json(rows)
    });
});

apiRouter.get('/customers', function(req,res) {
  con.query('select * from customers', function(err, rows) {
    if (err)
      throw err;
    res.json(rows)
    });
});

apiRouter.put('/activate/:userid', function (req, res) {
  con.query('update customers set active = ? where id = ?', [req.body.status , req.params.userid], function(err, rows) {
    if (err)
      throw res.json(err);
    console.log( rows );
    res.json(rows);
    });
});

apiRouter.post('/user', function (req, res) {
  con.query('select * from customers where email = ?',[req.body.email] , function(err, rows ) {
      if (err)
      throw res.json(err);
      if (rows.length > 0) {
        throw res.json({error: 'Email is already exist'});
      }
      else {
          con.query('insert into customers (firstname, lastname, birthdate, phone, city, street, email) values (?,?,?,?,?,?,?)',[req.body.firstname, req.body.lastname, req.body.birthdate, req.body.phone, req.body.city, req.body.street, req.body.email,] ,function(err, rows) {
    if (err)
      throw res.json(err);
    console.log( rows );
    res.json(rows);
    });
      }
  });

});

apiRouter.put('/user/:userid', function(req, res) {
  console.log('userid: ' + req.params.userid);
  var sql = 'update customers set ';
  var i = 1;
  var bodyLength = Object.keys(req.body).length;
  var values = [];
  for (var field in req.body) {
    sql += field + ' = ?';
    if(i<bodyLength)
      sql +=',';
    i++;
    values.push( req.body[field]);
  }
  sql += 'where id = ?';
  values.push( req.params.userid);
  con.query(sql,values, function(err, rows) {
    if (err)
      throw res.json(err);
    console.log(rows);
    res.json(rows);
  });
});

apiRouter.delete('/user/:userid', function (req, res) {
  con.query('update customers set deleted = now() where id = ?', [req.params.userid], function(err, rows) {
    if (err)
      throw res.json(err);
    console.log( rows );
    res.json(rows);
    });
});

app.listen(9090, (err) => {
    if (err) throw err;
    console.log('server started on port 9090');
});