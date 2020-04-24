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
        idStu = doc1.id;
        // firstnameStu = doc1.data().firstname;
        // lastnameStu = doc1.data().lastname;
        // let valeStu = `${firstnameStu} ${lastnameStu}`;
        // let proPicStu = doc1.data().img_url;
  
        var collection = db.collection('users');
        collection.where('email', "==", instructorEmail).get().then(snapshot =>{
          snapshot.forEach(doc3 =>{
          idInst = doc3.id;
          firstnameInst = doc3.data().firstname;
          lastnameInst = doc3.data().lastname;
          let valeInst = `${firstnameInst} ${lastnameInst}`;
          let proPicInst = doc3.data().img_url;
  
          let cityRef = db.collection('appointments').doc(idStu);
          let getDoc = cityRef.get()
            .then(doc2 => {
              if (!doc2.exists) {
                this.userd = [{ 
                  name: valeInst,
                  img_url: proPicInst,
                  topic: req.body['topic'],
                  description: req.body['description'],
                  email: req.body['instructorEmail'],
                },
              ];
  
              } else {
                this.userd = doc2.data().content;          
                this.userd.push({
                    name: valeInst,
                    img_url: proPicInst,
                    topic:req.body['topic'],
                    description:req.body['description'],
                    email: req.body['instructorEmail'],
                  });
                }
                const document = db.doc('appointments/'+idStu);
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
  
          let cityRef = db.collection('appointmentsista').doc(doc1.id);
          let getDoc = cityRef.get()
            .then(doc2 => {
              if (!doc2.exists) {
                this.userd = [{ 
                  name: vale,
                  img_url: proPic,
                  topic: req.body['topic'],
                  description: req.body['description'],
                  email: req.body['studentEmail'],
                },
              ];
  
              } else {
                this.userd = doc2.data().content;          
                this.userd.push({
                    name: vale,
                    img_url: proPic,
                    topic:req.body['topic'],
                    description:req.body['description'],
                    email: req.body['studentEmail'],
                  });
                }
                const document = db.doc('appointmentsista/'+doc1.id);
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
      console.log(id);
      let cityRef = db.collection('appointmentsista').doc(id);
      let getDoc = cityRef.get()
        .then(doc2 => {
          if(doc == undefined){
            console.log("Not available");
            const error = new Error("There is no user with " + id);
            error.status = 500;
            res.status(200).json('no such doc '+error);
            next(error);
          }  
          else{
            userDetails.push({id: doc2.id, data: doc2.data()});
            res.status(200).json(userDetails);  
          }  
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
 


//update details
router.post('/makeAppointment/instructor/reply', bodyParser.json(), (req, res) => {
  console.log(req.body);
  studentEmail = req.body['studentEmail'];
  instructorEmail = req.body['instructorEmail']
  // let userd = [];
  var collection = db.collection('users');
  collection.where('email', "==", instructorEmail).get().then(snapshot =>{
    snapshot.forEach(doc1 =>{
      idInst = doc1.id;
  

      // let cityRef = db.collection('appointmentsista').doc('sdlfjgsdfj');
      // let getDoc = cityRef.set()
      //   .then(doc2 => {
      //       this.userd = doc2.data().content;          
      //       this.userd.push({
      //         conte: req.body['content']
      //       },{merge:true})
            
            const document = db.doc('appoi/'+idInst);
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
        // })
        // .catch(err => {
        //   console.log('Error getting document', err);
        // });
    });
  });  
});











module.exports = router;