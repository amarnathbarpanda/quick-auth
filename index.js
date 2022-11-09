const express = require('express');
const app = express();


const db = require('./config/mongoose');

const port  = 8000;

//to access static files
app.use(express.static('./assets'));



// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

