const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();


//get all users for instructor search
router.get('/all', (req, res) => {
    let userDetails=[];
    var collection = db.collection('PersonClasses');
    collection.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            userDetails.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(userDetails);  
  
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });
});

// get individual class details
router.post('/individual', bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    console.log(":asdfasdf email "+ email);
    let userDetails=[];
    var collection = db.collection('PersonClasses').where('email','==',email);
    collection.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            userDetails.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(userDetails);  

    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });
});
  
// add class details
router.post('/add', bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    var collection = db.collection('users').where('email', "==", email);
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
        var name = doc.data().firstname + ' '+doc.data().lastname;;
        
            id = req.body['id'];
            const document = db.doc('PersonClasses/'+id);
            document.set({
                email: req.body['email'],
                registerItem: req.body['registerItem'],
                content: req.body['content'],
                name: name 
            })
            .then(function() {
                console.log('Document successfully written!');
                res.json({status:200});
            })
            .catch(function(error) {
                res.json({status:400});
                console.error('Error writing document: ', error);
            });
        })
    })  
});

module.exports = router;