const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();


router.post('/uploadFiles',bodyParser.json(),(req,res) =>{
    id = req.body['id'];
    email = req.body.notesDetails.email;
    
    var collection = db.collection('users');
    collection.where('email', "==", email).get().then(snapshot =>{
      snapshot.forEach(doc =>{
        let instructorId = doc.id;
    //     firstname = doc.data().firstname;
    //     lastname = doc.data().lastname;
    //     let vale = `${firstname} ${lastname}`;
    //     let proPic = doc.data().img_url;
    //     let verify = doc.data().verify;
  
        const document = db.doc('notes/'+id);
        document.set({
          instructor: instructorId,
          name: req.body.notesDetails.name,
          grade_level: req.body.notesDetails.gradeLevel,
          subject: req.body.notesDetails.subject,
          // name: vale,
          // verify: verify,
          // proPic: proPic,
          description: req.body.notesDetails.description,
          contentURL: req.body.notesDetails.contentURL,
          metaData: req.body.notesDetails.metaData,
          year: req.body.notesDetails.year,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
          
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
      console.log(err)
        res.json({status:400});
        res.status(500).json('Error getting document: '+ err);
    });  
  });
  
  
  //get all users for instructor search
  router.get('/getNotes', (req, res) => {
    let userDetails=[];
    var collection = db.collection('notes');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });
      res.json({status:200},userDetails)                        
      // res.status(200).json(userDetails);  
  
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });
  })


    //get all users for instructor search
    router.get('/viewNotes', (req, res) => {
      let subject = req.query.subject;
      let grade = req.query.grade;
      console.log(subject, grade);
    let userDetails=[];

      // let userDetails=[];
      var collection = db.collection('notes')
            .where('grade_level','==',grade)
            .where('subject','==',subject)
            // .orderBy('timestamp','desc');

      collection.get().then(snapshot =>{
        if (snapshot.empty) {
          // res.status(404).json('no details available');
          res.json({status:404})                        

        }
        else{
          snapshot.forEach(doc =>{
            // userDetails.push({id: doc.id, data: doc.data()});
            let id = doc.data().instructor;
            let more = [];
           
              let collection2 = db.collection('users').doc(id);
              collection2.get().then(doc2=> {
                console.log(doc2.id)
                more.push({
                  propic: doc2.data().img_url,
                  verify: doc2.data().verify,
                  firstname: doc2.data().firstname,
                  lastname:doc2.data().lastname,
                  email: doc2.data().email
                });
                userDetails.push({id:doc.id,data:doc.data(),more:more[0]});                       
                res.json({status:200,userDetails})                        
            })
          });
        }
        
      }).catch(err =>{
          res.status(500).json('Error getting document: '+ err);
      });
    })

    
  module.exports = router;