const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression')
const app = express();


// Firebase configuration

// const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const admin = require("./firebase/firebase");
let db = admin.firestore();

// Router Imports
const devRouter = require("./routes/dev");
const apiForwarder = require("./routes/apiForwarder");

// Server configuration
var port = process.env.PORT || 3000;
app.listen(port, () => console.log('mtute.lk listening on port 3000!'));

// GZipping Bundles
app.use(compression());

// Handling CORS
app.use(cors());
app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if(req.method === "OPTIONS"){
      res.header("Access-Control-Allow-Methods", "PUT, DELETE, GET, POST");
      // with this request won't go to routes
      return res.status(200).json({});
  }
  next();
});

// Body passing before sending to the routes
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Routes
app.use("/dev", devRouter); // This router will be used only for development process
app.use("/api", apiForwarder);

// Forwarding Frontend routes
app.use(express.static('dist/frontend'));    //uncomment this when push to heroku

app.use('*', (req,res) => {
  res.sendFile(path.join(__dirname+'/dist/frontend/index.html'));
});

// // Handling error messages
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

// Below code won't be called in server


//get all users full details
app.get('/getUsers/allUsers', (req, res) => {
  let userDetails=[];
  var collection = db.collection('user');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})