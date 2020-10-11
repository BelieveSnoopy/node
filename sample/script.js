// In this part of the code we import the necessary modules that we'll use to build our app

var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');

//Here we will use sessions to make user management easier. For example if user logs in once, he won't have to do it again next time he visits the website because the browser will memorize his session.
var session;

//The line below is essential to initialize any app built with ExpressJS. Every project must contain this.
//You can find more detailed info on why this is important on Stackoverflow, but it's not something to worry about for now.
var app = express();

//Here we use the body parser module in our app to parse the body of the requests that the users make to our web app.
//Don't worry about the settings that I used, just keep in mind that this module is what makes extracting the data from requests easier.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(sessions({
    secret: 'SECRET ENCRYPTION KEY',
    resave: false,
    saveUninitialized: true
}));


//Now we will start listening for requests, each one of the functions below will take care of handling requests for a certain URL.
//For example, the one below this comment will take care of handling GET requests made to 'localhost:1337/admin'
app.get('/admin', function(req, resp) {
    //We'll get the session key from the request's body.
    session = req.session;

    //this condition will verify if a session already exists. If yes, this means that the user is already logged in and we'll send him to the 'redirects' page that will take care of redirecting them to the proper URL.
    if (session.uniqueID){
        resp.redirect('/redirects');
    }

    //This line will send the admin.html file as a response to the GET request.
    resp.sendFile('./files/admin.html', {root: __dirname});
});


//This will also handle GET requests made to 'localhost:1337/login'. It's the same one as the the function above.
app.get('/login', function(req, resp){
    session = req.session;
    if(session.uniqueID){
        resp.redirect('/redirects');
    }
    resp.sendFile('./files/login.html', {root: __dirname});
});


// This one is a bit dfferent as it will handle a POST request instead.
//This is the request that the user will make when they hit the login button.
app.post('/login', function(req, resp){
    //As we said earlier, the first thing we do is to check if the user is already logged in or not (the session ID should not be null if they are)
    session = req.session;

    if(session.uniqueID){
        resp.redirect('/redirects');
    }
    
    //This part will verify the login credentials. In a real world app, we will get the real info from a database. But for the sake of simplicity, I used strings in this case.
    if (req.body.username == 'admin' && req.body.password == 'admin'){
        //If the login credentials are valid, we will give the user a new session ID and then send them to the 'redirects' page that will take care of redirecting them to the proper URL.
        session.uniqueID = req.body.username;
    }
    resp.redirect('/redirects');
});

//This is the function that will take care of redirecting users.
//After they are sent to 'redirects', this function will check their session ID. if it's a valid one, they will be redirected to /admin. Else, it will show an error message.
app.get('/redirects', function(req, resp) {
    session = req.session;
    if (session.uniqueID) {
        resp.redirect('/admin');
    } else {
        resp.end('Invalid login info.');
    }
});


//After writing all of our functions, we tell our app to listen on port 1337. Web apps usually run on port 80, but since this is only a test app, I used port 1337.
//Now if you visit 'localhost:1337/login' on your browser, a login page should appear.
app.listen(1337, function() {
    console.log('Listening at Port 1337');
});


//I hope this made it clear for you, if you still have any questions, please do not hesitate to contact me. Good Luck!