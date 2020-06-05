const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const admin = require('firebase-admin');

let db = admin.firestore();




//register
router.post('/register', bodyParser.json(), (req, res) => {
    console.log(req.body);
    id = req.body['id'];
    console.log(req.body);
    
    registerItem = req.body['registerItem'];
 
    if (registerItem == 'instructor'){
 
    const regDocument = db.doc('users/'+id) 
    regDocument.set({
      email: req.body['email'],
      role: req.body['registerItem'],
      firstname: req.body['firstName'],
      lastname: req.body['lastName'],
      contact: req.body['contact'],
      units: req.body['subjects'],
      create: admin.firestore.FieldValue.serverTimestamp().toString(),
      verify: 'assets/verification/not_verified.png',
      adminFeatures: false,
      img_url:'',
      metadata:'',
    });
     const document = db.doc('instructor/'+id);
     document.set({
       verify: 'assets/verification/not_verified.png',
       email: req.body['email'],
     
       // title: '',
       degree: '',
       university: '', 
       degreeYear: '',
       grad: '',
       backgroundImagePath: '',
       backgroundMetaData: '',
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
        console.log('Instructor successfully registered!');
        res.json({status: 200});                    
     })
     .catch(function(error) {
         console.error('Error writing document: ', error);
         res.json({status: 400,error});                              
     });
    }
    else if(registerItem == 'institute'){
 
     const regDocument = db.doc('users/'+id) 
     regDocument.set({
       email: req.body['email'],
       role: req.body['registerItem'],
       firstname: req.body['name'],
       lastname: '',
       contact: req.body['contact'],
       create: admin.firestore.FieldValue.serverTimestamp(),
       verify: 'assets/verification/not_verified.png',
       adminFeatures: false,
       img_url:'',
       metadata: ''
     });
 
     const document = db.doc('institute/'+id);
     document.set({
       verify: 'assets/verification/not_verified.png',
       email: req.body['email'],
       streetNo1: '',
       streetNo2: '',
       city: '',
       district: '',
       province: '',
       backgroundImagePath: '',
       backgroundMetaData: ''
     })
     .then(function() {
       console.log('Institute successfully registered!');
       res.json({status: 200});
     })
     .catch(function(error) {
         console.error('Error writing document: ', error);
         res.json({status: 400,error});                              
     });
    }
 
    else if (registerItem == 'student'){
 
     const regDocument = db.doc('users/'+id)
     regDocument.set({
       email: req.body['email'],
       role: req.body['registerItem'],
       firstname: req.body['firstName'],
       lastname: req.body['lastName'],
       units: req.body['subjects'],
       create: admin.firestore.FieldValue.serverTimestamp(),
       verify: 'assets/verification/not_verified.png',
       adminFeatures: false,
       img_url:'',
       metadata: '',
       contact: req.body['contact']
     });
      const document = db.doc('student/'+id);
      document.set({
        verify: 'assets/verification/not_verified.png',
        email: req.body['email'],
        subject: ''
  
      })
      .then(function() {
        console.log('Student successfully written!');
        res.json({status: 200});
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
        res.json({status: 400,error});

      });
     }
 });



// get user register data
router.post('/getUserRegData',bodyParser.json(), (req, res) => {
  console.log(req.body.email)
    let email = req.body['email'];
    let userDetails=[];
    var collection = db.collection('users');
   
    collection.where('email', "==", email).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            userDetails.push({name:doc.data().firstname, reg: doc.data().role});
            
        });                        
        res.status(200).json(userDetails);   
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });
});


// Get all users' details
router.get('/getAll', (req, res) => {
    let userDetails=[];
    var collection = db.collection('users').orderBy('firstname');
    // var collection = db.collection('users').limit(5);
    collection.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            userDetails.push({id: doc.id, data: doc.data()});
        });                        
        res.json({status:200,userDetails})     

    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });
})



module.exports = router;