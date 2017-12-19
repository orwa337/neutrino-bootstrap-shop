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

app.listen(9090, (err) => {
    if (err) throw err;
    console.log('server started on port 9090');
});