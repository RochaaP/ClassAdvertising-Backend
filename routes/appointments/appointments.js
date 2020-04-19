const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();

//get all appointments
router.post('/getAppointments/student', bodyParser.json(), (req, res) => {
  let userDetails=[];
  email = req.body['email'];
  var collection = db.collection('users');
  collection.where('email', "==", email).get().then(snapshot =>{
    snapshot.forEach(doc =>{
      id = doc.id;
      let cityRef = db.collection('appointments').doc(id);
      let getDoc = cityRef.get()
        .then(doc2 => {
          userDetails.push({id: doc2.id, data: doc2.data()});
          res.status(200).json(userDetails);  
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    });                        
    // res.status(200).json(userDetails);  

  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });
})


//place an appointment
router.post('/makeAppointment', bodyParser.json(), (req, res) => {
    placeOnInstructors(req);

    studentEmail = req.body['studentEmail'];
    instructorEmail = req.body['instructorEmail']
    // let userd = [];
    var collection = db.collection('users');
    collection.where('email', "==", studentEmail).get().then(snapshot =>{
      snapshot.forEach(doc1 =>{
        id = doc1.id;
  
        var collection = db.collection('users');
        collection.where('email', "==", instructorEmail).get().then(snapshot =>{
          snapshot.forEach(doc3 =>{
  
          firstname = doc3.data().firstname;
          lastname = doc3.data().lastname;
          let vale = `${firstname} ${lastname}`;
          let proPic = doc3.data().img_url;
  
          let cityRef = db.collection('appointments').doc(id);
          let getDoc = cityRef.get()
            .then(doc2 => {
              if (!doc2.exists) {
                this.userd = [{ 
                  name: vale,
                  img_url: proPic,
                  topic: req.body['topic'],
                  description: req.body['description'],
                  email: req.body['instructorEmail'],
                },
              ];
  
              } else {
                this.userd = doc2.data().content;          
                this.userd.push({
                    name: vale,
                    img_url: proPic,
                    topic:req.body['topic'],
                    description:req.body['description'],
                    email: req.body['instructorEmail'],
                  });
                }
                const document = db.doc('appointments/'+id);
                document.set({
                  content: this.userd              
                },{merge:true})
                
                .then(function() {
                  console.log('Appointment successfully Updated!');
                  res.json({status:200});
          
                })
                .catch(function(error) {
                  res.json({status:400}); 
                  console.error('Error writing document: ', error);
                });          
            })
            .catch(err => {
              console.log('Error getting document', err);
            });
          })
        });   
      })
    });
  });  


 function placeOnInstructors(req,res) {
    studentEmail = req.body['studentEmail'];
    instructorEmail = req.body['instructorEmail']
    console.log(studentEmail);
    // let userd = [];
    var collection = db.collection('users');
    collection.where('email', "==", instructorEmail).get().then(snapshot =>{
      snapshot.forEach(doc1 =>{
        id = doc1.id;
  
        var collection = db.collection('users');
        collection.where('email', "==", studentEmail).get().then(snapshot =>{
          snapshot.forEach(doc3 =>{
  
          firstname = doc3.data().firstname;
          lastname = doc3.data().lastname;
          let vale = `${firstname} ${lastname}`;
          let proPic = doc3.data().img_url;
  
          let cityRef = db.collection('appointmentsista').doc(id);
          let getDoc = cityRef.get()
            .then(doc2 => {
              if (!doc2.exists) {
                this.userd = [{ 
                  name: vale,
                  img_url: proPic,
                  topic: req.body['topic'],
                  description: req.body['description'],
                  email: req.body['instructorEmail'],
                },
              ];
  
              } else {
                this.userd = doc2.data().content;          
                this.userd.push({
                    name: vale,
                    img_url: proPic,
                    topic:req.body['topic'],
                    description:req.body['description'],
                    email: req.body['instructorEmail'],
                  });
                }
                const document = db.doc('appointmentsista/'+id);
                document.set({
                  content: this.userd              
                },{merge:true})
                
                // .then(function() {
                //   console.log('Document successfully Updated!');
                //   res.json({status:200});
          
                // })
                // .catch(function(error) {
                //   res.json({status:400}); 
                //   console.error('Error writing document: ', error);
                // });          
            })
            .catch(err => {
              console.log('Error getting document', err);
            });
          })
        });   
      })
    });
  }

//get all appointments
router.post('/getAppointments/instructor', bodyParser.json(), (req, res) => {
  let userDetails=[];
  email = req.body['email'];
  var collection = db.collection('users');
  collection.where('email', "==", email).get().then(snapshot =>{
    snapshot.forEach(doc =>{
      id = doc.id;
      let cityRef = db.collection('appointmentsista').doc(id);
      let getDoc = cityRef.get()
        .then(doc2 => {
          userDetails.push({id: doc2.id, data: doc2.data()});
          res.status(200).json(userDetails);  
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    });                        
    // res.status(200).json(userDetails);  

  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });
})
 



module.exports = router;