require('dotenv').config();
const csurf = require('csurf');
const express = require('express');
const app = express();
const expressSession = require('express-session')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo'); 

const passport = require('passport');
const flash = require('connect-flash');
const db = require('./config/mongoose');

const port  = process.env.PORT || 8000;

//to access static files
app.use(express.static('./assets'));



// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// settiing up body parser
app.use(express.urlencoded({extended: true}));

app.use(cookieParser('amar2324'))

// session
app.use(expressSession({
    name: 'quick-auth',
    secret: 'amar2324',
    resave: true, 
    // this forces the sessions to be saved back to our store
    saveUninitialized: false,
    cookie: {
        maxAge: (1000 * 60 * 60)
    },
    store: new MongoStore({
        // mongooseConnection: db, this won't work 
        mongoUrl: 'mongodb://localhost/quick-auth',
        autoRemove: 'disabled'
    },
        function (err) {
            console.log(err || 'connect-mongo ok');
        })
}));

app.use(csurf());

// initializing the passport and passport session
app.use(passport.initialize());
app.use(passport.session());


// connection the flash
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

// initialize routes
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

