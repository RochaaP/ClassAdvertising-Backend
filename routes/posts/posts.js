const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();

//upload a new post
router.post('/add',bodyParser.json(), (req, res) => {
    const email = req.body.postDetails.email;
    const registerItem = req.body.postDetails.registerItem;
    const id = req.body.id;
    let userDetails=[];
  
    if(registerItem == 'instructor'){
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
                  title: req.body.postDetails.title,
                  email: req.body.postDetails.email,
                  verify: verify,
                  contact: req.body.postDetails.contact,
                  city: req.body.postDetails.city,
                  district: req.body.postDetails.district,
                  name: vale,
                  proPic: proPic,
                  description: req.body.postDetails.description,
                  path: req.body.postDetails.contentURL,
                  metadata: req.body.postDetails.metaData,
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
        // res.json({status:200});
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
                  title: req.body.postDetails.title,
                  email: req.body.postDetails.email,
                  verify: verify,
                  contact: req.body.postDetails.contact,
                  city: req.body.postDetails.city,
                  district: req.body.postDetails.district,
                  name: name,
                  proPic: proPic,
                  description: req.body.postDetails.description,
                  path: req.body.postDetails.contentURL,
                  metadata: req.body.postDetails.metaData,
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
router.get('/all/:pageLimit', (req, res) => {
    let userDetails=[];
    let pageLimit = parseInt(req.params.pageLimit);
    let pageCount = parseInt(req.params.pageCount);
    
    console.log('all/posts',pageLimit,pageCount);
    var collection = db.collection('posts').orderBy('create', 'desc').limit(pageLimit);
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.status(200).json(userDetails);  
  
  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
      console.log(err);
  });
  
  })

//get more postss and go back (for both)
router.get('/more/:pageCount/:pageLimit', (req, res) => {
  let userDetails=[];
  
  let pageLimit = parseInt(req.params.pageLimit);
  let pageCount = parseInt(req.params.pageCount);
  console.log('count',pageCount,'limit',pageLimit)
    
  if (pageCount == 0) {
    pageCount = pageLimit;
  }

    var collection2 = db.collection('posts').orderBy('create', 'desc').limit(pageCount);
    let paginate = collection2.get()
    .then((snapshot) => {
     
      // ...

      // Get the last document
      let last = snapshot.docs[snapshot.docs.length - 1];

      // Construct a new query starting at this document.
      // Note: this will not have the desired effect if multiple
      // cities have the exact same population value.
      let next = db.collection('posts').orderBy('create','desc').startAfter(last.data().create).limit(pageLimit);

      next.get().then(snapshot =>{
        if (snapshot.empty) {
          console.log('posts empty');
          res.json({status:404});
        }
        else{
          snapshot.forEach(doc =>{
            userDetails.push({id: doc.id, data: doc.data()});
          });                        
          res.status(200).json(userDetails);  
        }
         
      
      }).catch(err =>{
          res.status(500).json('Error getting document: '+ err);
          console.log(err);
      });

    }).catch(err =>{
      console.log(err)
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