const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const admin = require('firebase-admin');

let db = admin.firestore();

// get all users
router.get('/getAll', (req, res) => {
    let userDetails=[];
    var collection = db.collection('users').where('role', '==', 'institute');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.status(200).json(userDetails);  
  
  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });
  })
  

// get details individual
router.post('/get',bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    let userDetails = [];
    var collection = db.collection('users');
    
    collection.where('email', '==', email).get().then(snapshot =>{
        snapshot.forEach(doc => {
            console.log(doc.data());
            const id = doc.id;
    
            let collection2 = db.collection('institute').doc(id);
            collection2.get().then(doc2=> {
                console.log('Document data:', doc2.data());
                userDetails.push({id:doc.id,data:doc.data(),more:doc2.data()});
                res.status(200).json(userDetails); 
            
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
        });
    });        
});
  

//update details
router.post('/update', bodyParser.json(), (req, res) => {
    id = req.body['id'];
    const document = db.doc('users/'+id);
    document.update({
      // email: req.body['email'],
        firstname: req.body['firstname'],
        contact: req.body['contact'],
        img_url: req.body['img_url'],
    
    },{merge:true});
  
    const document2  = db.doc('institute/'+id);
    document2.update({
        streetNo1: req.body['streetNo1'],
        streetNo2: req.body['streetNo2'],
        city: req.body['city'],
        district: req.body['district'],
        province: req.body['province'],
        backgroundImagePath: req.body['backgroundImagePath']
  
    },{merge:true})
    .then(function() {
        res.json({status:200});
        console.log('Document successfully written!');
    })
    .catch(function(error) {
        console.error('Error writing document: ', error);
        res.status(500).json('Error getting document: '+ err);
    });
  
});
  






module.exports = router;