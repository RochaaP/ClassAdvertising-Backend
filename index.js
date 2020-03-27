
// app.listen(3000, () => console.log('Example app listening on port 3000!'))


// app.use(bodyParser.json)
// app.use(bodyParser.urlencoded({extended: false}))

// // var port = process.env.PORT || 3000;


// app.use(logger('dev'));



// app.post('/postData', (req, res) => {
//     // console.log(req.body);
//     res.json(req.body)
//     // const document = db.doc('items/first-item');
//     // document.set({
//     //     name:  req.body.name,
//     //     description: req.body.username
//     //   }).then(() => {
//     //     console.log("Handle if document successfully created");
//     //   });
// })

const express = require('express');
const http = require('http');
const path = require('path'); 
const logger = require('morgan');
const bodyParser = require('body-parser')
const app = express();

// app.use(express.static('dist/frontend/'))///check whether is this needed

// app.use('/', express.static(path.join(__dirname+"/public/register")));
// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
// });

// app.use(express.static(__dirname + '/dist/frontend'));

// app.get('/*', (req,res) => {
//   res.sendFile(path.join(__dirname+'/dist/frontend/index.html'));
// });

// const register = require('./public/auth/register');

app.listen(3000, () => console.log('Example app listening on port 3000!'))

// app.use('/register',register);

//core

// const cors = require('cors');
// app.use(cors);

// const allowedExt = [
//   '.js',
//   '.ico',
//   '.css',
//   '.png',
//   '.jpg',
//   '.woff2',
//   '.woff',
//   '.ttf',
//   '.svg',
// ];
// app.get('*', (req, res) => {
//     // if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
//     //   res.sendFile(path.resolve('dist/${req.url}'));
//     // } else {
//       res.sendFile(path.resolve('dist/frontend/index.html'));
//     // }
//   });
// var corsOptions = {
//   // origin: 'http://example.com',
//   origin: 'localhost',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
// }

// app.use(cors(corsOptions))

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

let db = admin.firestore();

const paperRouter = require("./routes/papers");
const questionRouter = require("./routes/questions");
const userRouter = require("./routes/users");
const subjectRouter = require("./routes/subjects");

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

app.get('/', (req, res) => {
  console.log("sjdhf");
	res.send('./index.html')
})

app.get('/getData', (req, res) => {
	res.json({'message': 'Hello World'})
})

// app.post('/postData', bodyParser.json(), (req, res) => {
// 	console.log("the node post"+req.body['firstName']);
// 	res.json(req.body);
// })

//register
app.post('/postRegData', bodyParser.json(), (req, res) => {

   id = req.body['id'];
   registerItem = req.body['registerItem'];

   if (registerItem == 'person'){

   const regDocument = db.doc('allRegisteredUsers/'+id) 
   regDocument.set({
     email: req.body['email'],
     registerItem: req.body['registerItem'],
     name: req.body['firstName'],
     create: admin.firestore.FieldValue.serverTimestamp(),
     verify: 'Not Verified'
   });
    const document = db.doc('user/'+id);
    document.set({
      verify: 'Not Verified',
      email: req.body['email'],
      firstName: req.body['firstName'],
      lastName: req.body['lastName'],
      contact: req.body['contact'],
      registerItem: req.body['registerItem'],
      title: '',
      degree: '',
      university: '', 
      degreeYear: '',
      grad: '',
      profileImagePath: '',
      yearExperiences: '',
      teachingSchool: '',

      universityMSc: '',
      degreeMSc: '',
      yearMSc: '',

      universityPhD: '',
      degreePhd: '',
      yearPhD: '',

      subject: '',
      gradeA: '',
      gradeB: '',
      gradeC: '',
      gradeS: '',

      achievement: [],
      personalAchievement: []


    })
    .then(function() {
      console.log('Document successfully written!');
    })
    .catch(function(error) {
        console.error('Error writing document: ', error);
    });
   }
   else if(registerItem == 'institute'){

    const regDocument = db.doc('allRegisteredUsers/'+id) 
    regDocument.set({
      email: req.body['email'],
      registerItem: req.body['registerItem'],
      name: req.body['name'],
      create: admin.firestore.FieldValue.serverTimestamp(),
      verify: 'Not Verified'
    });

    const document = db.doc('institute/'+id);
    document.set({
      verify: 'Not Verified',
      email: req.body['email'],
      name: req.body['name'],
      contact: req.body['contact'],
      streetNo1: '',
      streetNo2: '',
      city: '',
      town: '',
      province: '',
      profileImagePath: ''
    })
    .then(function() {
      console.log('Document successfully written!');
    })
    .catch(function(error) {
        console.error('Error writing document: ', error);
    });
   }
   
	res.json(req.body);
})

//getUserRegister
app.post('/register/getUserRegData',bodyParser.json(), (req, res) => {
  let email = req.body['email'];
  let userDetails=[];
  var collection = db.collection('allRegisteredUsers');
  collection.where('email', "==", email).get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({name:doc.data().name, reg: doc.data().registerItem});
    });                        
    res.status(200).json(userDetails);   
}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});

})

//userDetails-person
app.post('/getUserData/person',bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    let userDetails=[];
    var collection = db.collection('user');
    collection.where('email', "==", email).get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.status(200).json(userDetails);   
  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });

})

//updateDetails-person
app.post('/updateUserDetails/person', bodyParser.json(), (req, res) => {
  id = req.body['id'];
  console.log('afdsf '+req.body['email']);
  const document = db.doc('user/'+id);
  document.update({
    email: req.body['email'],
    title: req.body['title'],
    firstName: req.body['firstName'],
    lastName: req.body['lastName'],
    contact: req.body['contact'],
    degree: req.body['degree'],
    university: req.body['university'],
    grad: req.body['grad'],
    degreeYear: req.body['degreeYear'],
    profileImagePath: req.body['profileImagePath'],
    yearExperiences: req.body['yearExperiences'],
    teachingSchool: req.body['teachingSchool'],

    universityMSc: req.body['universityMSc'],
    degreeMSc: req.body['degreeMSc'],
    yearMSc: req.body['yearMSc'],

    universityPhD: req.body['universityPhD'],
    degreePhd: req.body['degreePhD'],
    yearPhD: req.body['yearPhD'],

    subject: req.body['subject'],
    gradeA: req.body['gradeA'],
    gradeB: req.body['gradeB'],
    gradeC: req.body['gradeC'],
    gradeS: req.body['gradeS'],

    achievement: req.body['achievement'],
    personalAchievement: req.body['personalAchievement']
    
  },{merge:true})
  .then(function() {
    console.log('Document successfully written!');
  })
  .catch(function(error) {
      console.error('Error writing document: ', error);
  });

})

//userDetails-institute
app.post('/getUserData/institute',bodyParser.json(), (req, res) => {
  const email = req.body['email'];
 // const email = 'rochpathiraja@gmail.com'

  let userDetails=[];
  var collection = db.collection('institute');
  collection.where('email', "==", email).get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);   
}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});

})

//updateDetails-institute
app.post('/updateUserDetails/institute', bodyParser.json(), (req, res) => {
  id = req.body['id'];
  console.log('afdsf '+req.body);
  const document = db.doc('institute/'+id);
  document.update({
    email: req.body['email'],
    name: req.body['name'],
    contact: req.body['contact'],
    streetNo1: req.body['streetNo1'],
    streetNo2: req.body['streetNo2'],
    city: req.body['city'],
    town: req.body['town'],
    province: req.body['province'],
    profileImagePath: req.body['profileImagePath']

  },{merge:true})
  .then(function() {
    console.log('Document successfully written!');
  })
  .catch(function(error) {
      console.error('Error writing document: ', error);
  });

})

// add new posts
app.post('/uploadposts',bodyParser.json(), (req, res) => {
  const email = req.body['email'];
  const registerItem = req.body['registerItem'];
  console.log(registerItem)
  const id = req.body['id']
  let userDetails=[];

  if(registerItem == 'person'){
    var collection = db.collection('user');
    collection.where('email', "==", email).get().then(snapshot =>{
      snapshot.forEach(doc =>{
        firstname = doc.data().firstName;
        lastname = doc.data().lastName;
        let vale = `${firstname} ${lastname}`;
        let title = doc.data().title;
        let proPic = doc.data().profileImagePath;
        let verify = doc.data().verify;
        // console.log('vvarasdf ' +vale);

        const document = db.doc('posts/'+id);
              document.set({
                email: req.body['email'],
                verify: verify,
                title: title,
                name: vale,
                proPic: proPic,
                description: req.body['description'],
                path: req.body['path'],
                registerItem: registerItem,
                create: admin.firestore.FieldValue.serverTimestamp()
                
              })
              .then(function() {
                console.log('Document successfully written!');
              })
              .catch(function(error) {
                  console.error('Error writing document: ', error);
              });
      });                        
      res.status(200).json(userDetails);   
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });  
  }

  if(registerItem == 'institute'){
    var collection = db.collection('institute');
    collection.where('email', "==", email).get().then(snapshot =>{
      snapshot.forEach(doc =>{
        name = doc.data().name;
        let proPic = doc.data().profileImagePath;
        
        const document = db.doc('posts/'+id);
              document.set({
                email: req.body['email'],
                name: name,
                proPic: proPic,
                description: req.body['description'],
                path: req.body['path'],
                registerItem: registerItem,
                create: admin.firestore.FieldValue.serverTimestamp()
              })
              .then(function() {
                console.log('Document successfully written!');
              })
              .catch(function(error) {
                  console.error('Error writing document: ', error);
              });
      });                        
      res.status(200).json(userDetails);   
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });  
  }
})

// post on  newsfeed
app.get('/getPostsData/posts', (req, res) => {
  let userDetails=[];
  var collection = db.collection('posts').orderBy('create', 'desc');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});

})

//get user's posts
app.post('/getUserPosts/user', bodyParser.json(), (req, res) => {
  const email = req.body['email'];
  let userDetails=[];
var collection = db.collection('posts').where('email', "==", email);
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});

})


// addClassDetails-person
app.post('/uploadClasses/person', bodyParser.json(), (req, res) => {
  id = req.body['id'];
  const document = db.doc('classes/'+id);
  document.set({
    email: req.body['email'],
    registerItem: req.body['registerItem'],
    content: req.body['content']
   })
  .then(function() {
    console.log('Document successfully written!');
  })
  .catch(function(error) {
      console.error('Error writing document: ', error);
  });

})

// getClassDetails-person
app.post('/getClasses/person', bodyParser.json(), (req, res) => {
  const email = req.body['email'];
  console.log(":asdfasdf email "+ email);
  let userDetails=[];
  var collection = db.collection('classes').where('email','==',email);
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})
	

//Admin - Get All users
app.get('/getAllUsers', (req, res) => {
  let userDetails=[];
  var collection = db.collection('allRegisteredUsers').orderBy('create', 'desc');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})
// Verify User Details-person
// app.post('/getAllUsers/person', bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   console.log(":asdfasdf email "+ email);
//   let userDetails=[];
//   var collection = db.collection('classes').where('email','==',email);
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })


// addClassDetails-institute
app.post('/uploadClasses/institute', bodyParser.json(), (req, res) => {
  id = req.body['id'];
  const document = db.doc('InstituteClasses/'+id);
  document.set({
    email: req.body['email'],
    registerItem: req.body['registerItem'],
    content: req.body['content']
   })
  .then(function() {
    console.log('Document successfully written!');
  })
  .catch(function(error) {
      console.error('Error writing document: ', error);
  });

})

// getClassDetails-institute
app.post('/getClasses/institute', bodyParser.json(), (req, res) => {
  const email = req.body['email'];
  console.log(":asdfasdf email "+ email);
  let userDetails=[];
  var collection = db.collection('InstituteClasses').where('email','==',email);
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/papers", paperRouter);
app.use("/questions", questionRouter);
app.use("/users", userRouter);
app.use("/subjects", subjectRouter);
// app.get("/papers", (req, res) =>{
//   paperRef = db.collection("papers");
//   console.log("Mtute-Papers");
//   let papers = [];
//   paperRef.get().then(snapshot =>{
//       snapshot.forEach(doc =>{
//           papers.push({id: doc.id, data: doc.data()});
//       });                        
//       res.status(200).json(papers);
//   }).catch(err =>{
//       console.log('Error getting paper documents', err);
//       res.status(500).json('Error getting paper documents', err);
//   });
// });

// app.get("/questions/paper/:paperId", (req, res) =>{ 
//   questionRef = db.collection("questions");   
//   console.log("Mtute-Questions Filter By Paper Id");
//   let paperId = req.params.paperId;
//   let questions = [];
//   questionRef.where('paper', "==", paperId).get().then(snapshot =>{
//       snapshot.forEach(doc =>{
//           questions.push({id: doc.id, data: doc.data()});
//       });                        
//       res.status(200).json(questions);   
//   }).catch(err =>{
//       res.status(500).json('Error getting question document by Paper Id: '+ err);
//   });
// });
  
app.use((req, res, next) =>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});