
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();


//get all images
router.get('/getImages', (req, res) => {
    let userDetails=[];
    var collection = db.collection('adminImages');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.status(200).json(userDetails);  
  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });
  })


// update images
router.post('/uploadImages', bodyParser.json(), (req, res) => {
   // Add a new document with a generated id.
    let addDoc = db.collection('adminImages').add({
        url: req.body['content']
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
    });
  
  })

module.exports = router;