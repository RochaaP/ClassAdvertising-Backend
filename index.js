
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

app.get('/', (req, res) => {
  res.send('Welcome to Node API')
 
})

app.get('/getData', (req, res) => {
  // res.json({'message': 'Hello World'})
  console.log("asdhjfkajd")
})
///

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

let db = admin.firestore();


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
     lastName: req.body['lastName'],
     create: admin.firestore.FieldValue.serverTimestamp(),
     verify: 'assets/verification/not_verified.png'
   });
    const document = db.doc('user/'+id);
    document.set({
      verify: 'assets/verification/not_verified.png',
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
      backgroundImagePath: '',
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
      verify: 'assets/verification/not_verified.png'
    });

    const document = db.doc('institute/'+id);
    document.set({
      verify: 'assets/verification/not_verified.png',
      email: req.body['email'],
      name: req.body['name'],
      contact: req.body['contact'],
      streetNo1: '',
      streetNo2: '',
      city: '',
      town: '',
      province: '',
      profileImagePath: '',
      backgroundImagePath: ''
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
    backgroundImagePath: req.body['backgroundImagePath'],
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
    profileImagePath: req.body['profileImagePath'],
    backgroundImagePath: req.body['backgroundImagePath']

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
        let verify = doc.data().verify;
        
        const document = db.doc('posts/'+id);
              document.set({
                email: req.body['email'],
                name: name,
                verify: verify,
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
  const email = req.body['email'];
  var collection = db.collection('allRegisteredUsers').where('email', "==", email);
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
     var name = doc.data().name + ' '+doc.data().lastName;;
  
      id = req.body['id'];
      const document = db.doc('PersonClasses/'+id);
      document.set({
        email: req.body['email'],
        registerItem: req.body['registerItem'],
        content: req.body['content'],
        name: name 
      })
      .then(function() {
        console.log('Document successfully written!');
      })
      .catch(function(error) {
          console.error('Error writing document: ', error);
      });
    })
  })  
})
// getClassDetails-person
app.post('/getClasses/person', bodyParser.json(), (req, res) => {
  const email = req.body['email'];
  console.log(":asdfasdf email "+ email);
  let userDetails=[];
  var collection = db.collection('PersonClasses').where('email','==',email);
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
  var collection = db.collection('allRegisteredUsers').orderBy('name');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})

//Get all Person Users
app.get('/getAllUsers/person', (req, res) => {
  let userDetails=[];
  var collection = db.collection('allRegisteredUsers').where('registerItem', '==', 'person');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})

app.get('/getAllUsers/institute', (req, res) => {
  let userDetails=[];
  var collection = db.collection('allRegisteredUsers').where('registerItem', '==', 'institute');
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
app.post('/getAllUsers/verifyUser', bodyParser.json(), (req, res) => {
  const email = req.body['email'];
  var collection = db.collection('allRegisteredUsers').where('email', "==", email);
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{

          const document = db.doc('allRegisteredUsers/'+doc.id);
          document.update({
           verify: 'assets/verification/verified.png'
          })
          .then(function() {
            console.log('Document successfully written!');
          })
          .catch(function(error) {
              console.error('Error writing document: ', error);
          });
    });
}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});


    var collection = db.collection('posts').where('email', "==", email);
      collection.get().then(snapshot =>{
        snapshot.forEach(doc =>{

              const document = db.doc('posts/'+doc.id);
              document.update({
              verify: 'assets/verification/verified.png'
              })
              .then(function() {
                console.log('Document successfully written!');
              })
              .catch(function(error) {
                  console.error('Error writing document: ', error);
              });
        });
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });

})

// addClassDetails-institute
app.post('/uploadClasses/institute', bodyParser.json(), (req, res) => {

  const email = req.body['email'];
  var collection = db.collection('allRegisteredUsers').where('email', "==", email);
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
     var name = doc.data().name;
  
            id = req.body['id'];
            const document = db.doc('InstituteClasses/'+id);
            document.set({
              email: req.body['email'],
              registerItem: req.body['registerItem'],
              content: req.body['content'],
              name: name
            })
            .then(function() {
              console.log('Document successfully written!');
            })
            .catch(function(error) {
                console.error('Error writing document: ', error);
            });

      });
    })
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
	
//get all users for person search
app.get('/getAllClasses/persons', (req, res) => {
  let userDetails=[];
  var collection = db.collection('PersonClasses');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})
	

//get all users for institute search
app.get('/getAllClasses/institute', (req, res) => {
  let userDetails=[];
  var collection = db.collection('InstituteClasses');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});
})
	