const express = require('express');
const bodyParser= require('body-parser');

const config = require('./config/config');
const {mongoose}= require('./db/database.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

//logging
app.use((req,res,next)=>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	date = new Date().toString()
	console.log(`Got a request at ${date} to ${req.path}`)
	next()
})

require('./routes/userRoutes')(app);
require('./routes/siteRoutes')(app);
require('./routes/filesRoutes')(app);
require('./routes/generalRoutes')(app);
app.listen(process.env.PORT);
