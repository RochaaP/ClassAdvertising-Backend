const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();


router.post('/uploadFiles',bodyParser.json(),(req,res) =>{
    id = req.body['id'];
    email = req.body['email'];
    
    var collection = db.collection('users');
    collection.where('email', "==", email).get().then(snapshot =>{
      snapshot.forEach(doc =>{
        firstname = doc.data().firstname;
        lastname = doc.data().lastname;
        let vale = `${firstname} ${lastname}`;
        let proPic = doc.data().img_url;
        let verify = doc.data().verify;
  
        const document = db.doc('notes/'+id);
        document.set({
          title: req.body['title'],
          email: req.body['email'],
          grade: req.body['grade'],
          subject: req.body['subject'],
          name: vale,
          verify: verify,
          proPic: proPic,
          description: req.body['description'],
          path: req.body['path'],
          create: admin.firestore.FieldValue.serverTimestamp()
          
        })
        .then(function() {
          console.log('Document successfully written!');
          res.json({status:200})
        })
        .catch(function(error) {
          res.json({status:400});
          console.error('Error writing document: ', error);
        });
      });               
      res.json({status:200});
    }).catch(err =>{
        res.json({status:400});
        res.status(500).json('Error getting document: '+ err);
    });  
  });
  
  
  //get all users for person search
  router.get('/getNotes', (req, res) => {
    let userDetails=[];
    var collection = db.collection('notes');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.status(200).json(userDetails);  
  
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });
  })


  module.exports = router;