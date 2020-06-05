const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const admin = require('firebase-admin');

let db = admin.firestore();


// Get all users
router.get('/getAll', (req, res) => {
    let userDetails=[];
    var collection = db.collection('users').where('role', '==', 'student');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.status(200).json(userDetails);  
  
  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });
  })
  


//get details  individuals
router.post('/get',bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    let userDetails = [];
    var collection = db.collection('users');
   
    collection.where('email', '==', email).get().then(snapshot =>{
        snapshot.forEach(doc => {
            userDetails.push({id:doc.id,data:doc.data()});
            res.json({status:200, userDetails}); 
        });
    });        
});


//update details
router.post('/update', bodyParser.json(), (req, res) => {
    console.log(req.body)
    id = req.body['id'];
    const document = db.doc('users/'+id);
    document.update({
        email: req.body['email'],
        firstname: req.body['firstName'],
        lastname: req.body['lastName'],
        contact: req.body['contact'],
        img_url: req.body['img_url'],
        metadata: req.body['metadata'],
        units: req.body['units'],
        grade_level: req.body['grade_level']
    },{merge:true})
    .then(function() {
        res.json({status:200});
        console.log('Document successfully written!');
    })
    .catch(function(error) {
        res.json({status:400})
        console.error('Error writing document: ', error);
    });
});

module.exports = router;