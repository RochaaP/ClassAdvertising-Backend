const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const admin = require('firebase-admin');

let db = admin.firestore();


router.post('/', bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    var collection = db.collection('users').where('email', "==", email);
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
  
            const document = db.doc('users/'+doc.id);
            document.update({
             verify: 'assets/verification/verified.png'
            })
            .then(function() {
              console.log('user successfully verified!');
            })
            .catch(function(error) {
                console.error('Error writing document: ', error);
            });
      });
  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });
  
  
      var collection = db.collection('posts').where('email', "==", email);
        collection.get().then(snapshot =>{
          snapshot.forEach(doc =>{
  
                const document = db.doc('posts/'+doc.id);
                document.update({
                verify: 'assets/verification/verified.png'
                })
                .then(function() {
                  console.log('users posts successfully verified');
                })
                .catch(function(error) {
                    console.error('Error writing document: ', error);
                });
          });
      }).catch(err =>{
          res.status(500).json('Error getting document: '+ err);
      });
  
});


module.exports = router;