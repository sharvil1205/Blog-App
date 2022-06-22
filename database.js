var mysql = require("mysql");

var connection = mysql.createConnection({                           // Connect to the database
    host: 'localhost',
    database: 'blog',
    user: 'root',
    password: 'password'
});

module.exports = connection;