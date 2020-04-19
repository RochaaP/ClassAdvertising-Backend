
const express = require('express');
const http = require('http');
const path = require('path'); 
const logger = require('morgan');
const bodyParser = require('body-parser')
const app = express();

var port = process.env.PORT || 3000;
app.listen(port, () => console.log('mtute.lk listening on port 3000!'))
// app.use(express.static('dist/frontend'));    //uncomment this when push to heroku


const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

let db = admin.firestore();

// const devRouter = require("./routes/dev");
const paperRouter = require("./routes/papers");
const questionRouter = require("./routes/questions");
const userRouter = require("./routes/users");
const subjectRouter = require("./routes/subjects");
const attemptRouter = require("./routes/attempts");

const appointmentRouter = require("./routes/appointments/appointments");

const adminImageRouter = require('./routes/admin/images');
const adminVerifyRouter = require('./routes/admin/verify');


const userDetailsRouter = require('./routes/userDetails/navigate');

const instructorClassesRouter = require('./routes/classes/instructors');
const instituteClassesRouter = require('./routes/classes/institutes');

const notesRouter = require('./routes/notes/files');
const postsRouter = require('./routes/posts/posts');

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




app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use("/dev", devRouter); // This router will be used only for development process
app.use("/papers", paperRouter);
app.use("/questions", questionRouter);
app.use("/users", userRouter);
app.use("/subjects", subjectRouter);
app.use("/attempts", attemptRouter);

app.use('/admin/images', adminImageRouter);
app.use('/admin/verify', adminVerifyRouter);

app.use('/userDetails', userDetailsRouter);

app.use('/appointments', appointmentRouter); 
app.use('/notes', notesRouter);
app.use('/posts', postsRouter);

app.use('/classes/instructor', instructorClassesRouter);
app.use('/classes/institute', instituteClassesRouter);


app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname+'/dist/frontend/index.html'));
});
  
// Handling routing if no matching url is not found
app.use((req, res, next) =>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Handling error messages
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

app.use('*', (req,res) => {
  res.sendFile(path.join(__dirname+'/dist/frontend/index.html'));
});
// //register
// app.post('/postRegData', bodyParser.json(), (req, res) => {

//    id = req.body['id'];
   
//    registerItem = req.body['registerItem'];

//    if (registerItem == 'person'){

//    const regDocument = db.doc('users/'+id) 
//    regDocument.set({
//      email: req.body['email'],
//      role: req.body['registerItem'],
//      firstname: req.body['firstName'],
//      lastname: req.body['lastName'],
//      create: admin.firestore.FieldValue.serverTimestamp().toString(),
//      verify: 'assets/verification/not_verified.png',
//      adminFeatures: false,
//      img_url:''
//    });
//     const document = db.doc('instructor/'+id);
//     document.set({
//       verify: 'assets/verification/not_verified.png',
//       email: req.body['email'],
    
//       // title: '',
//       degree: '',
//       university: '', 
//       degreeYear: '',
//       grad: '',
//       profileImagePath: '',
//       backgroundImagePath: '',
//       yearExperiences: '',
//       teachingSchool: '',

//       universityMSc: '',
//       degreeMSc: '',
//       yearMSc: '',

//       universityPhD: '',
//       degreePhd: '',
//       yearPhD: '',

//       subject: '',
//       gradeA: '',
//       gradeB: '',
//       gradeC: '',
//       gradeS: '',

//       achievement: [],
//       personalAchievement: []


//     })
//     .then(function() {
//       console.log('Document successfully written!');
     
//     })
//     .catch(function(error) {
//         console.error('Error writing document: ', error);
       
//     });
//    }
//    else if(registerItem == 'institute'){

//     const regDocument = db.doc('users/'+id) 
//     regDocument.set({
//       email: req.body['email'],
//       role: req.body['registerItem'],
//       firstname: req.body['name'],
//       lastname: '',
//       contact: req.body['contact'],
//       create: admin.firestore.FieldValue.serverTimestamp(),
//       verify: 'assets/verification/not_verified.png',
//       adminFeatures: false,
//       img_url:''
//     });

//     const document = db.doc('institute/'+id);
//     document.set({
//       verify: 'assets/verification/not_verified.png',
//       email: req.body['email'],
//       streetNo1: '',
//       streetNo2: '',
//       city: '',
//       district: '',
//       province: '',
//       backgroundImagePath: ''
//     })
//     .then(function() {
//       console.log('Document successfully written!');
//       // res.json({status:200});
//     })
//     .catch(function(error) {
//         console.error('Error writing document: ', error);
//         // res.json({status:500});
//     });
//    }

//    else if (registerItem == 'student'){

//     const regDocument = db.doc('users/'+id);
//     console.log(regDocument +' user createed '+id );
//     regDocument.set({
//       email: req.body['email'],
//       role: req.body['registerItem'],
//       firstname: req.body['firstname'],
//       lastname: req.body['lastname'],
//       // create: admin.firestore.FieldValue.serverTimestamp().toString(),
//       verify: 'assets/verification/not_verified.png',
//       adminFeatures: false,
//       img_url:'',
//       contact: req.body['contact']
//     });
//      const document = db.doc('student/'+id);
//     console.log('student createed')
//      document.set({
//        verify: 'assets/verification/not_verified.png',
//        email: req.body['email'],
//        subject: ''
 
//      })
//      .then(function() {
//        console.log('Document successfully written!');
//      })
//      .catch(function(error) {
//          console.error('Error writing document: ', error);
//      });
//     }
   
// 	res.json(req.body);
// })

// //getUserRegister
// app.post('/register/getUserRegData',bodyParser.json(), (req, res) => {
//   let email = req.body['email'];
//   let userDetails=[];
//   var collection = db.collection('users');
 
//   collection.where('email', "==", email).get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({name:doc.data().firstname, reg: doc.data().role});
       
//     });                        
//     res.status(200).json(userDetails);   
// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });

// })

// //get details -person
// app.post('/getUserData/person',bodyParser.json(), (req, res) => {
//     const email = req.body['email'];
//     let userDetails = [];
//     var collection = db.collection('users');
   
    
//     collection.where('email', '==', email).get().then(snapshot =>{
//       snapshot.forEach(doc => {
//         console.log(doc.data());
//         const id = doc.id;

//         let collection2 = db.collection('instructor').doc(id);
//         collection2.get().then(doc2=> {
//             console.log('Document data:', doc2.data());
//             userDetails.push({id:doc.id,data:doc.data(),more:doc2.data()});
//             res.status(200).json(userDetails); 
          
//           })
//           .catch(err => {
//             console.log('Error getting document', err);
//           });
//         });
//       });        
//   });

// //updateDetails-person
// app.post('/updateUserDetails/person', bodyParser.json(), (req, res) => {
//   id = req.body['id'];
//   const document = db.doc('users/'+id);
//   document.update({
//     email: req.body['email'],
//     // title: req.body['title'],
//     firstname: req.body['firstName'],
//     lastname: req.body['lastName'],
//     contact: req.body['contact'],
//     img_url: req.body['img_url']
//   },{merge:true});
  
//   const document2  = db.doc('instructor/'+id);
//   document2.update({
//     email: req.body['email'],
//     degree: req.body['degree'],
//     university: req.body['university'],
//     grad: req.body['grad'],
//     degreeYear: req.body['degreeYear'],
//     backgroundImagePath: req.body['backgroundImagePath'],
//     yearExperiences: req.body['yearExperiences'],
//     teachingSchool: req.body['teachingSchool'],

//     universityMSc: req.body['universityMSc'],
//     degreeMSc: req.body['degreeMSc'],
//     yearMSc: req.body['yearMSc'],

//     universityPhD: req.body['universityPhD'],
//     degreePhd: req.body['degreePhD'],
//     yearPhD: req.body['yearPhD'],

//     subject: req.body['subject'],
//     gradeA: req.body['gradeA'],
//     gradeB: req.body['gradeB'],
//     gradeC: req.body['gradeC'],
//     gradeS: req.body['gradeS'],

//     achievement: req.body['achievement'],
//     personalAchievement: req.body['personalAchievement']
    
//   },{merge:true})
//   .then(function() {
//     res.json({status:200});
//     console.log('Document successfully written!');
//   })
//   .catch(function(error) {
//     res.json({status:400})
//       console.error('Error writing document: ', error);
//   });

// })

// //get details -institute
// app.post('/getUserData/institute',bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   let userDetails = [];
//   var collection = db.collection('users');
 
  
//   collection.where('email', '==', email).get().then(snapshot =>{
//     snapshot.forEach(doc => {
//       console.log(doc.data());
//       const id = doc.id;

//       let collection2 = db.collection('institute').doc(id);
//       collection2.get().then(doc2=> {
//           console.log('Document data:', doc2.data());
//           userDetails.push({id:doc.id,data:doc.data(),more:doc2.data()});
//           res.status(200).json(userDetails); 
        
//         })
//         .catch(err => {
//           console.log('Error getting document', err);
//         });
//       });
//     });        
// });


// //updateDetails-institute
// app.post('/updateUserDetails/institute', bodyParser.json(), (req, res) => {
//   id = req.body['id'];
//   const document = db.doc('users/'+id);
//   document.update({
//     // email: req.body['email'],
//     firstname: req.body['firstname'],
//     contact: req.body['contact'],
//     img_url: req.body['img_url'],

//   },{merge:true});

//   const document2  = db.doc('institute/'+id);
//   document2.update({
//     streetNo1: req.body['streetNo1'],
//     streetNo2: req.body['streetNo2'],
//     city: req.body['city'],
//     district: req.body['district'],
//     province: req.body['province'],
//     backgroundImagePath: req.body['backgroundImagePath']

//   },{merge:true})
//   .then(function() {
//     res.json({status:200});
//     console.log('Document successfully written!');
//   })
//   .catch(function(error) {
//       console.error('Error writing document: ', error);
//       res.status(500).json('Error getting document: '+ err);
//   });

// })

// add new posts
// app.post('/uploadposts',bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   const registerItem = req.body['registerItem'];
//   console.log(registerItem)
//   const id = req.body['id']
//   let userDetails=[];

//   if(registerItem == 'person'){
//     var collection = db.collection('users');
//     collection.where('email', "==", email).get().then(snapshot =>{
//       snapshot.forEach(doc =>{
//         firstname = doc.data().firstname;
//         lastname = doc.data().lastname;
//         let vale = `${firstname} ${lastname}`;
//         let proPic = doc.data().img_url;
//         let verify = doc.data().verify;
//         // console.log('vvarasdf ' +vale);

//         const document = db.doc('posts/'+id);
//               document.set({
//                 title: req.body['title'],
//                 email: req.body['email'],
//                 verify: verify,
//                 contact: req.body['contact'],
//                 city: req.body['city'],
//                 district: req.body['district'],
//                 name: vale,
//                 proPic: proPic,
//                 description: req.body['description'],
//                 path: req.body['path'],
//                 registerItem: registerItem,
//                 create: admin.firestore.FieldValue.serverTimestamp()
                
//               })
//               .then(function() {
//                 console.log('Document successfully written!');
//                 res.json({status:200})
//               })
//               .catch(function(error) {
//                 res.json({status:400});
//                   console.error('Error writing document: ', error);
//               });
//       });                        
//       res.json({status:200});
//     }).catch(err =>{
//         res.json({status:400});
//         res.status(500).json('Error getting document: '+ err);
//     });  
//   }

//   if(registerItem == 'institute'){
//     console.log(req.body);
//     var collection = db.collection('users');
//     collection.where('email', "==", email).get().then(snapshot =>{
//       snapshot.forEach(doc =>{
//         name = doc.data().firstname;
//         let proPic = doc.data().img_url;
//         let verify = doc.data().verify;
        
//         const document = db.doc('posts/'+id);
//               document.set({
//                 email: req.body['email'],
//                 name: name,
//                 verify: verify,
//                 proPic: proPic,
//                 title: req.body['title'],
//                 contact: req.body['contact'],
//                 city: req.body['city'],
//                 district: req.body['district'],
//                 description: req.body['description'],
//                 path: req.body['path'],
//                 registerItem: registerItem,
//                 create: admin.firestore.FieldValue.serverTimestamp()
//               })
//               .then(function() {
//                 console.log('Document successfully written!');
//                 res.json({status:200});
//               })
//               .catch(function(error) {
//                 res.json({status:400});
//                 console.error('Error writing document: ', error);
//               });
//       });                        
//       res.json({status:200}) 
//     }).catch(err =>{
//       res.json({status:400});
//         res.status(500).json('Error getting document: '+ err);
//     });  
//   }
// })

// // post on  newsfeed
// app.get('/getPostsData/posts', (req, res) => {
//   let userDetails=[];
//   var collection = db.collection('posts').orderBy('create', 'desc');
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });

// })

// //get user's posts
// app.post('/getUserPosts/user', bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   let userDetails=[];
// var collection = db.collection('posts').where('email', "==", email);
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });

// })


// // addClassDetails-person
// app.post('/uploadClasses/person', bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   var collection = db.collection('users').where('email', "==", email);
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//      var name = doc.data().firstname + ' '+doc.data().lastname;;
  
//       id = req.body['id'];
//       const document = db.doc('PersonClasses/'+id);
//       document.set({
//         email: req.body['email'],
//         registerItem: req.body['registerItem'],
//         content: req.body['content'],
//         name: name 
//       })
//       .then(function() {
//         console.log('Document successfully written!');
//       res.json({status:200});
//       })
//       .catch(function(error) {
//         res.json({status:400});
//           console.error('Error writing document: ', error);
//       });
//     })
//   })  
// })
// // getClassDetails-person
// app.post('/getClasses/person', bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   console.log(":asdfasdf email "+ email);
//   let userDetails=[];
//   var collection = db.collection('PersonClasses').where('email','==',email);
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })
	

// //Admin - Get All users
// app.get('/getAllUsers', (req, res) => {
//   let userDetails=[];
//   var collection = db.collection('users').orderBy('firstname');
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })

// //Get all Person Users
// app.get('/getAllUsers/person', (req, res) => {
//   let userDetails=[];
//   var collection = db.collection('users').where('role', '==', 'person');
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })

// app.get('/getAllUsers/institute', (req, res) => {
//   let userDetails=[];
//   var collection = db.collection('users').where('role', '==', 'institute');
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })



// Verify User Details-person
// app.post('/getAllUsers/verifyUser', bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   var collection = db.collection('users').where('email', "==", email);
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{

//           const document = db.doc('users/'+doc.id);
//           document.update({
//            verify: 'assets/verification/verified.png'
//           })
//           .then(function() {
//             console.log('Document successfully written!');
//           })
//           .catch(function(error) {
//               console.error('Error writing document: ', error);
//           });
//     });
// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });


//     var collection = db.collection('posts').where('email', "==", email);
//       collection.get().then(snapshot =>{
//         snapshot.forEach(doc =>{

//               const document = db.doc('posts/'+doc.id);
//               document.update({
//               verify: 'assets/verification/verified.png'
//               })
//               .then(function() {
//                 console.log('Document successfully written!');
//               })
//               .catch(function(error) {
//                   console.error('Error writing document: ', error);
//               });
//         });
//     }).catch(err =>{
//         res.status(500).json('Error getting document: '+ err);
//     });

// })

// // addClassDetails-institute
// app.post('/uploadClasses/institute', bodyParser.json(), (req, res) => {

//   const email = req.body['email'];
//   var collection = db.collection('users').where('email', "==", email);
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//      var name = doc.data().firstname;
  
//             id = req.body['id'];
//             const document = db.doc('InstituteClasses/'+id);
//             document.set({
//               email: req.body['email'],
//               registerItem: req.body['registerItem'],
//               content: req.body['content'],
//               name: name
//             })
//             .then(function() {
//               console.log('Document successfully written!');
//               res.json({status:200});

//             })
//             .catch(function(error) {
//               res.json({status:400}); 
//               console.error('Error writing document: ', error);
//             });

//       });
//     })
//   })

// // getClassDetails-institute
// app.post('/getClasses/institute', bodyParser.json(), (req, res) => {
//   const email = req.body['email'];
//   console.log(":asdfasdf email "+ email);
//   let userDetails=[];
//   var collection = db.collection('InstituteClasses').where('email','==',email);
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })


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
	
// //get all users for person search
// app.get('/getAllClasses/persons', (req, res) => {
//   let userDetails=[];
//   var collection = db.collection('PersonClasses');
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })
	

// //get all users for institute search
// app.get('/getAllClasses/institute', (req, res) => {
//   let userDetails=[];
//   var collection = db.collection('InstituteClasses');
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

// }).catch(err =>{
//     res.status(500).json('Error getting document: '+ err);
// });
// })
//   //delete Post
// app.post('/deletePosts', bodyParser.json(), (req, res) => {
//   let deleteDoc = db.collection('posts').doc(req.body['idValue']).delete()
//   .then(function() {
//     console.log('Document successfully Deleted!');
//     res.json({status:200});

//   })
//   .catch(function(error) {
//     res.json({status:400}); 
//     console.error('Error writing document: ', error);
//   });
// })
  
//   //Update Post
//   app.post('/uploadposts/update', bodyParser.json(), (req, res) => {
//   id = req.body['id'];
//   // console.log('afdsf '+req.body);
//   const document = db.doc('posts/'+id);
//   document.update({
//     title: req.body['title'],
//     description: req.body['description'],
//     city: req.body['city'],
//     district: req.body['district'],
//     contact: req.body['contact']
//   },{merge:true})
//   .then(function() {
//     res.json({status:200});
//     console.log('Document successfully written!');
//   })
//   .catch(function(error) {
//       console.error('Error writing document: ', error);
//       res.json({status:400});
//   });

// })


// app.post('/uploadFiles',bodyParser.json(),(req,res) =>{
//   id = req.body['id'];
//   email = req.body['email'];
  
//   var collection = db.collection('users');
//   collection.where('email', "==", email).get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//       firstname = doc.data().firstname;
//       lastname = doc.data().lastname;
//       let vale = `${firstname} ${lastname}`;
//       let proPic = doc.data().img_url;
//       let verify = doc.data().verify;

//       const document = db.doc('notes/'+id);
//       document.set({
//         title: req.body['title'],
//         email: req.body['email'],
//         grade: req.body['grade'],
//         subject: req.body['subject'],
//         name: vale,
//         verify: verify,
//         proPic: proPic,
//         description: req.body['description'],
//         path: req.body['path'],
//         create: admin.firestore.FieldValue.serverTimestamp()
        
//       })
//       .then(function() {
//         console.log('Document successfully written!');
//         res.json({status:200})
//       })
//       .catch(function(error) {
//         res.json({status:400});
//         console.error('Error writing document: ', error);
//       });
//     });               
//     res.json({status:200});
//   }).catch(err =>{
//       res.json({status:400});
//       res.status(500).json('Error getting document: '+ err);
//   });  
// });


// //get all users for person search
// app.get('/getNotes', (req, res) => {
//   let userDetails=[];
//   var collection = db.collection('notes');
//   collection.get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//         userDetails.push({id: doc.id, data: doc.data()});
//     });                        
//     res.status(200).json(userDetails);  

//   }).catch(err =>{
//       res.status(500).json('Error getting document: '+ err);
//   });
// })


// //Request an appointment
// app.post('/makeAppointment', bodyParser.json(), (req, res) => {
//   studentEmail = req.body['studentEmail'];
//   instructorEmail = req.body['instructorEmail']
//   let userd = [];
//   var collection = db.collection('users');
//   collection.where('email', "==", studentEmail).get().then(snapshot =>{
//     snapshot.forEach(doc1 =>{
//       id = doc1.id;

//       var collection = db.collection('users');
//       collection.where('email', "==", instructorEmail).get().then(snapshot =>{
//         snapshot.forEach(doc3 =>{

//         firstname = doc3.data().firstname;
//         lastname = doc3.data().lastname;
//         let vale = `${firstname} ${lastname}`;
//         let proPic = doc3.data().img_url;

//         let cityRef = db.collection('appointments').doc(id);
//         let getDoc = cityRef.get()
//           .then(doc2 => {
//             if (!doc2.exists) {
//               this.userd = [{ 
//                 name: vale,
//                 img_url: proPic,
//                 topic: req.body['topic'],
//                 description: req.body['description'],
//                 email: req.body['instructorEmail'],
//                 create: admin.firestore.FieldValue.serverTimestamp()
//               },
//             ];

//             } else {
//               this.userd = doc2.data().content;          
//               this.userd.push({
//                   name: vale,
//                   img_url: proPic,
//                   topic:req.body['topic'],
//                   description:req.body['description'],
//                   email: req.body['instructorEmail'],
//                   create: admin.firestore.FieldValue.serverTimestamp()
//                 });
//               }
//               const document = db.doc('appointments/'+id);
//               document.set({
//                 content: this.userd              
//               },{merge:true})
              
//               .then(function() {
//                 console.log('Document successfully Updated!');
//                 res.json({status:200});
        
//               })
//               .catch(function(error) {
//                 res.json({status:400}); 
//                 console.error('Error writing document: ', error);
//               });          
//           })
//           .catch(err => {
//             console.log('Error getting document', err);
//           });
//         })
//       });   
//     })
//   });
// });  

// app.post('/getAppointments', bodyParser.json(), (req, res) => {
//   let userDetails=[];
//   email = req.body['email'];
//   var collection = db.collection('users');
//   collection.where('email', "==", email).get().then(snapshot =>{
//     snapshot.forEach(doc =>{
//       id = doc.id;
//       console.log(id);
//       let cityRef = db.collection('appointments').doc(id);
//       let getDoc = cityRef.get()
//         .then(doc2 => {
//           userDetails.push({id: doc2.id, data: doc2.data()});
//           res.status(200).json(userDetails);  
//         })
//         .catch(err => {
//           console.log('Error getting document', err);
//         });



//     });                        
//     // res.status(200).json(userDetails);  

//   }).catch(err =>{
//       res.status(500).json('Error getting document: '+ err);
//   });
// })


// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

// // app.use("/dev", devRouter); // This router will be used only for development process
// app.use("/papers", paperRouter);
// app.use("/questions", questionRouter);
// app.use("/users", userRouter);
// app.use("/subjects", subjectRouter);
// app.use("/attempts", attemptRouter);

// app.use('/appointments', appointmentRouter); 

// app.use('/admin/images', adminImageRouter);
// // app.use('/roles', rolesRouter);

// app.use('/notes', notesRouter);

// app.use('/posts', postsRouter);

// app.use('/classes/instructor', instructorClassesRouter);
// app.use('/classes/institute', instituteClassesRouter);


