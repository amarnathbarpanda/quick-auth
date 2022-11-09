const csurf = require('csurf');
const express = require('express');
const app = express();
const expressSession = require('express-session')

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

app.use(expressSession({
    secret: 'amar2324'
}));

app.use(csurf());

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

