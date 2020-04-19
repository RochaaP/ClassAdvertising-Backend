const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();

//upload a new post
router.post('/add',bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    const registerItem = req.body['registerItem'];
    const id = req.body['id']
    let userDetails=[];
  
    if(registerItem == 'person'){
      var collection = db.collection('users');
      collection.where('email', "==", email).get().then(snapshot =>{
        snapshot.forEach(doc =>{
          firstname = doc.data().firstname;
          lastname = doc.data().lastname;
          let vale = `${firstname} ${lastname}`;
          let proPic = doc.data().img_url;
          let verify = doc.data().verify;
  
          const document = db.doc('posts/'+id);
                document.set({
                  title: req.body['title'],
                  email: req.body['email'],
                  verify: verify,
                  contact: req.body['contact'],
                  city: req.body['city'],
                  district: req.body['district'],
                  name: vale,
                  proPic: proPic,
                  description: req.body['description'],
                  path: req.body['path'],
                  registerItem: registerItem,
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
    }
  
    if(registerItem == 'institute'){
      var collection = db.collection('users');
      collection.where('email', "==", email).get().then(snapshot =>{
        snapshot.forEach(doc =>{
          name = doc.data().firstname;
          let proPic = doc.data().img_url;
          let verify = doc.data().verify;
          
          const document = db.doc('posts/'+id);
                document.set({
                  email: req.body['email'],
                  name: name,
                  verify: verify,
                  proPic: proPic,
                  title: req.body['title'],
                  contact: req.body['contact'],
                  city: req.body['city'],
                  district: req.body['district'],
                  description: req.body['description'],
                  path: req.body['path'],
                  registerItem: registerItem,
                  create: admin.firestore.FieldValue.serverTimestamp()
                })
                .then(function() {
                  console.log('Document successfully written!');
                  res.json({status:200});
                })
                .catch(function(error) {
                  res.json({status:400});
                  console.error('Error writing document: ', error);
                });
        });                        
        res.json({status:200}) 
      }).catch(err =>{
        res.json({status:400});
          res.status(500).json('Error getting document: '+ err);
      });  
    }
  })






// post on  newsfeed
router.get('/all', (req, res) => {
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
router.post('/get/individual', bodyParser.json(), (req, res) => {
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
  

  //delete Post
router.post('/deletePosts', bodyParser.json(), (req, res) => {
    let deleteDoc = db.collection('posts').doc(req.body['idValue']).delete()
    .then(function() {
      console.log('Document successfully Deleted!');
      res.json({status:200});
  
    })
    .catch(function(error) {
      res.json({status:400}); 
      console.error('Error writing document: ', error);
    });
 })
    
//Update Post
router.post('/update', bodyParser.json(), (req, res) => {
    id = req.body['id'];
    const document = db.doc('posts/'+id);
    document.update({
      title: req.body['title'],
      description: req.body['description'],
      city: req.body['city'],
      district: req.body['district'],
      contact: req.body['contact']
    },{merge:true})
    .then(function() {
      res.json({status:200});
      console.log('Document successfully written!');
    })
    .catch(function(error) {
        console.error('Error writing document: ', error);
        res.json({status:400});
    });
});

module.exports = router;