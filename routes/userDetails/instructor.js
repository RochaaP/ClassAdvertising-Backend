const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')
const admin = require('firebase-admin');

let db = admin.firestore();


// Get all users
router.get('/getAll', (req, res) => {
    let userDetails=[];
    var collection = db.collection('users').where('role', '==', 'instructor');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.status(200).json(userDetails);  
  
  }).catch(err =>{
      res.status(500).json('Error getting document: '+ err);
  });
  })
  


//get details  individuals
router.post('/get',bodyParser.json(), (req, res) => {
    const email = req.body['email'];
    let userDetails = [];
    var collection = db.collection('users');
   
    collection.where('email', '==', email).get().then(snapshot =>{
        snapshot.forEach(doc => {
            const id = doc.id;

            let collection2 = db.collection('instructor').doc(id);
            collection2.get().then(doc2=> {
                console.log(id);
                userDetails.push({id:doc.id,data:doc.data(),more:doc2.data()});
                res.json({status:200, userDetails}); 
            })
            .catch(err => {
                res.json({status:400, err}); 
                console.log('Error getting document', err);
            });
        });
    });        
});


//update details
router.post('/update', bodyParser.json(), (req, res) => {
    console.log(req.body)
    id = req.body['id'];
    const document = db.doc('users/'+id);
    document.update({
        email: req.body['email'],
        // title: req.body['title'],
        firstname: req.body['firstName'],
        lastname: req.body['lastName'],
        contact: req.body['contact'],
        img_url: req.body['img_url'],
        metaData: req.body['metaData'],
        units: req.body['units'],
        grade_level: req.body['grade_level']
    },{merge:true});
    
    const document2  = db.doc('instructor/'+id);
    document2.update({
        email: req.body['email'],
        degree: req.body['degree'],
        university: req.body['university'],
        grad: req.body['grad'],
        degreeYear: req.body['degreeYear'],
        backgroundImagePath: req.body['backgroundImagePath'],
        backgroundMetaData: req.body['backgroundMetaData'],
        yearExperiences: req.body['yearExperiences'],
        teachingSchool: req.body['teachingSchool'],

        universityMSc: req.body['universityMSc'],
        degreeMSc: req.body['degreeMSc'],
        yearMSc: req.body['yearMSc'],

        universityPhD: req.body['universityPhD'],
        degreePhd: req.body['degreePhD'],
        yearPhD: req.body['yearPhD'],

        subject: req.body['subject'],
        gradeA: req.body['gradeA'],
        gradeB: req.body['gradeB'],
        gradeC: req.body['gradeC'],
        gradeS: req.body['gradeS'],

        achievement: req.body['achievement'],
        personalAchievement: req.body['personalAchievement']
      
    },{merge:true})
    .then(function() {
        res.json({status:200});
        console.log('Document successfully written!');
    })
    .catch(function(error) {
        res.json({status:400})
        console.error('Error writing document: ', error);
    });
});
  




module.exports = router;
// router.post('/makeAppointment',bodyParser.json(),(req,res) =>{
//     console.log('yes')
//     userDetails = [req.body['content']];
//     studentEmail =  req.body['studentEmail'],
//     instructorEmail = req.body['instructorEmail']    
//     let addDoc = db.collection('temp')
//         .where('instructorEmail', '==', instructorEmail)
//         .where('studentEmail', '==', studentEmail).get().then(snapshot =>{
//             snapshot.forEach(doc =>{
//                 console.log('ues');
//                 if(!doc.exists){
//                     // userDetails = [req.body['content']];
//                     console.log('user doc does not extit');
//                     let addDoc = db.collection('temp').add({
//                         content: userDetails,
//                         studentEmail: req.body['studentEmail'],
//                         instructorEmail: req.body['instructorEmail']    
//                     }).then(ref => {
//                         console.log('Added document with ID: ', ref.id);
//                     }).catch(err => {
//                         res.status(500).json(err);
//                     })
//                 }
//                 else {
//                     console.log('user doc extit');
//                     this.userd = doc.data().content;
//                     console.log(this.userd);          
//                     this.userd.push(req.body['content']);
//                     let updateRef = db.collection('temp').doc(doc.id);
//                     console.log(doc.id);
//                     // Set the 'capital' field of the city
//                     updateRef.set({
//                         content: this.userd
//                     },{merge:true})
//                     .then(
//                         console.log('documetn updated')
//                     )
//                 }
//                 });                        
//                 // res.status(200).json(userDetails);   
//             }).catch(err =>{
//                 res.status(500).json('Error getting document: '+ err);
//             })
//         // content: userDetails,
//         // studentEmail: req.body['studentEmail'],
//     //     // instructorEmail: req.body['instructorEmail']    
//     //   }).then(ref => {
//     //     // console.log('Added document with ID: ', ref.id);
//     //   });
// });