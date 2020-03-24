const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router();


// const admin = require('firebase-admin');
// const serviceAccount = require('./../../serviceAccountKey.json');

// admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

// let db = admin.firestore();
const admin = require('firebase-admin');
const firebase = require('./../../firebase/firebase');
var db = admin.firestore();


// router.post('/', bodyParser.json(), (req, res) => {
//     console.log("the node "+req.body['firstname']);
  
//      id = req.body['id'];
//      registerItem = req.body['registerItem'];
  
//      const document = db.doc('users/'+id) 
//      document.set({
//        email: req.body['email'],
//        registerItem: req.body['registerItem'],
//        create: admin.firestore.FieldValue.serverTimestamp()
//      });
  
//      if (registerItem == 'person'){
//       const document = db.doc('user/'+id);
//       document.set({
//         email: req.body['email'],
//         firstName: req.body['firstName'],
//         lastName: req.body['lastName'],
//         contact: req.body['contact'],
//         registerItem: req.body['registerItem'],
//       })
//       .then(function() {
//         console.log('Document successfully written!');
//       })
//       .catch(function(error) {
//           console.error('Error writing document: ', error);
//       });
//      }
//      else if(registerItem == 'institute'){
//       const document = db.doc('institute/'+id);
//       document.set({
//         email: req.body['email'],
//         name: req.body['name'],
//         contact: req.body['contact']
//       })
//       .then(function() {
//         console.log('Document successfully written!');
//       })
//       .catch(function(error) {
//           console.error('Error writing document: ', error);
//       });
//      }
     
//       res.json(req.body);
//   })
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

   const regDocument = db.doc('users/'+id) 
   regDocument.set({
     email: req.body['email'],
     registerItem: req.body['registerItem'],
     name: req.body['firstName'],
     create: admin.firestore.FieldValue.serverTimestamp()
   });

  
    const document = db.doc('user/'+id);
    document.set({
      email: req.body['email'],
      firstName: req.body['firstName'],
      lastName: req.body['lastName'],
      contact: req.body['contact'],
      registerItem: req.body['registerItem'],
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
      yearPhD: ''
    })
    .then(function() {
      console.log('Document successfully written!');
    })
    .catch(function(error) {
        console.error('Error writing document: ', error);
    });
   }
   else if(registerItem == 'institute'){

    const regDocument = db.doc('users/'+id) 
    regDocument.set({
      email: req.body['email'],
      registerItem: req.body['registerItem'],
      name: req.body['name'],
      create: admin.firestore.FieldValue.serverTimestamp()
    });

    const document = db.doc('institute/'+id);
    document.set({
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
  var collection = db.collection('users');
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
  console.log('afdsf '+req.body);
  const document = db.doc('user/'+id);
  document.update({
    email: req.body['email'],
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
    yearPhD: req.body['yearPhD']

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
        // console.log('vvarasdf ' +vale);

        const document = db.doc('posts/'+id);
              document.set({
                email: req.body['email'],
                name: vale,
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
        
        const document = db.doc('posts/'+id);
              document.set({
                email: req.body['email'],
                name: name,
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
  var collection = db.collection('users').orderBy('create', 'desc');
  collection.get().then(snapshot =>{
    snapshot.forEach(doc =>{
        userDetails.push({id: doc.id, data: doc.data()});
    });                        
    res.status(200).json(userDetails);  

}).catch(err =>{
    res.status(500).json('Error getting document: '+ err);
});

})