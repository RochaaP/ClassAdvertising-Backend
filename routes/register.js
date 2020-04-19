const express = require('express');
const http = require('http');
const path = require('path'); 
const logger = require('morgan');
const bodyParser = require('body-parser')
const app = express();
var router = express.Router();



 
// register
app.post('/postRegData', bodyParser.json(), (req, res) => {

   id = req.body['id'];
   registerItem = req.body['registerItem'];

   if (registerItem == 'person'){

   const regDocument = db.doc('users/'+id) 
   regDocument.set({
     email: req.body['email'],
     registerItem: req.body['registerItem'],
     name: req.body['firstName'],
     lastName: req.body['lastName'],
     create: admin.firestore.FieldValue.serverTimestamp().toString(),
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

    const regDocument = db.doc('users/'+id) 
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
      district: '',
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

   if (registerItem == 'student'){

    const regDocument = db.doc('users/'+id) 
    regDocument.set({
      email: req.body['email'],
      registerItem: req.body['registerItem'],
      name: req.body['firstName'],
      lastName: req.body['lastName'],
      create: admin.firestore.FieldValue.serverTimestamp().toString(),
      verify: 'assets/verification/not_verified.png'
    });
     const document = db.doc('student/'+id);
     document.set({
       verify: 'assets/verification/not_verified.png',
       email: req.body['email'],
       firstName: req.body['firstName'],
       lastName: req.body['lastName'],
       contact: req.body['contact'],
       registerItem: req.body['registerItem'],
       subject: ''
 
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


module.exports = router;