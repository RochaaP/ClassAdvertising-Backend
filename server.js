var express = require('express');
var http = require('http');
var path = require('path'); 
var logger = require('morgan');
var bodyParser = require('body-parser')
var app = express();

const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();


var port = process.env.PORT || 3300;


app.use(logger('dev'));

// app.set('view engine','ejs')


// view engine setup
// app.set('public', path.join(__dirname, 'public'));


// app.use(express.static(path.join(__dirname + '/public')));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// app.use(express.static('public'))
// app.set('public',__dirname + '/public');

app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended: false}))


app.get('/',function(req,res){
    res.render('index.html');
});

app.post('/',function(request,response){
  //  var val = request.body.neww
  //   console.log(val)
  // response.render('resoo.html',{data:val})
  res.json(req.body)
})

var server = http.createServer(app);
server.listen(port,()=>{
    console.log('server is starting '+port);
});