const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = require('./database');                   					   // Connect to the database

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/login.html'));                        // Open login.html file
});



app.post('/auth', function(request, response) {										// Authorize username and password for login
	
	let email = request.body.email;
	let password = request.body.password;
	
	if (email && password) {

		connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			
			if (error) throw error;
			
			if (results.length > 0) {
				
				request.session.loggedin = true;
				request.session.email = email;
				
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});




app.post('/register', function(request, response){                                            // Register and enter the data into 'user' table
	
	var fName = request.body.fName;
	var mName = request.body.mName;
	var lName = request.body.lName;
	var mobile = request.body.mobile;
	var email = request.body.email;
	var password = request.body.password;
	


	var sql = `INSERT INTO user(firstName, middleName, lastName, mobile, email, password) VALUES ("${fName}", "${mName}", "${lName}", "${mobile}", "${email}", "${password}")`;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log("record inserted");
		
		response.redirect('/home');
	})
})


app.get('/home', function(request, response) {										// Redirect to home.html
	const filePath = path.join(__dirname + '/home.html');
	
	response.sendFile(filePath, function(err){
		if(err)
		{
			return response.status(err.status).end();
		}
		else
		{
			return response.status(200).end()
		}
	});
	
});


app.get('/editor.html', function(request, response) {
	response.sendFile(__dirname + '/editor.html')										// Open editor.html
})


app.get('/home.css', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/css/home.css'));                          // Apply the home.css file
});


app.get('/editor.css', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/css/editor.css'));                        // Apply the editor.css file
});



app.get('/header.jpg', function(request, response)										
{
	response.sendFile(path.join(__dirname + '/img/header.jpg'));						// Apply header.jpg image
})


app.get('/logo.png', function(request, response)
{
	response.sendFile(path.join(__dirname + '/img/logo.png'));							// Apply 'logo.png' logo
})



app.post('/blog_db', function(request, response){										// Insert data into 'post' table
	var content = request.body.content;
	var title = request.body.title;
	var d = new Date();
	
	var sql = `INSERT INTO post(title, content, publishedAt) VALUES ("${title}", "${content}", "${d}")`;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log("record inserted");
		response.send(result);
	})
})



app.get('/home.html', function(request, response){										// Print all the data from 'post' database
	var sql = `SELECT * from post`;
	connection.query(sql, function(err,result){
		response.send(result);
	})
})


app.listen(3000);