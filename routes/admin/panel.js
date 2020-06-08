const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();


// Get all users' count
router.get('/usersCount', (req, res) => {
    let userCount = [];

    var collectionInstc = db.collection('instructor');
    collectionInstc.get().then(instructorCount =>{

        var collectionInsti = db.collection('institute');
        collectionInsti.get().then(instituteCount =>{

            var collectionStu = db.collection('student');
            collectionStu.get().then(studentCount =>{

                var collectionStu = db.collection('notes');
                collectionStu.get().then(notesCount =>{

                    var collectionStu = db.collection('posts');
                    collectionStu.get().then(postsCount =>{

                        var collectionStu = db.collection('papers');
                        collectionStu.get().then(papersCount =>{

                        userCount.push({
                        instructor: instructorCount,
                        institute: instituteCount,
                        student: studentCount,
                        notes: notesCount,
                        posts: postsCount,
                        papers: papersCount
                        }); 
                        res.json({status:200,userCount});

                        }).catch(err =>{
                            res.json({status:400,err});
                            console.log(err);                       
                        });

                    }).catch(err =>{
                        res.json({status:400,err});
                        console.log(err);
                    });

                }).catch(err =>{
                        res.json({status:400,err});
                        console.log(err);
                });

            }).catch(err =>{
                res.json({status:400,err});
                console.log(err);
            });

        }).catch(err =>{
            res.json({status:400,err});
            console.log(err);
        });

    }).catch(err =>{
        res.json({status:400,err});
        console.log(err);
    });    
});



///// get Subjects /////
router.get('/subjects',(req, res) => {
    let userDetails=[];
    var collection = db.collection('subjects');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.json({status:200,userDetails});  
  }).catch(err =>{
      res.json({status: 400, err});
  });
})


///////// Add new Subject /////
router.post('/setSubject',bodyParser.json(),(req,res) =>{
    db.collection('subjects').add({
        name: req.body.subject
      }).then(ref => {
        res.json({status:200});
      }).catch(err => {
          res.json({status: 400});
      });
  })

//// Update Subject ///////
router.put('/updateSubject',bodyParser.json(),(req, res) => {
    let updateRef = db.collection('subjects').doc(req.body.id);
    updateRef.set({
        name: req.body.subject
    },{merge:true})
    .then(
      res.json({status:200})  
    ).catch(err => {
        console.log(err);
        res.json({status:500, err});
    });
})

/////// Delete Subject /////
router.delete('/deleteSubject/:id',(req, res) => {
    db.collection('subjects').doc(req.params.id).delete()
    .then(
        res.json({status:200})
    ).catch(err => {
        console.log(err);
        res.json({status:400});
    });
})


////////// get all faqs /////
router.get('/faq',(req, res) => {
    let userDetails=[];
    var collection = db.collection('faq');
    collection.get().then(snapshot =>{
      snapshot.forEach(doc =>{
          userDetails.push({id: doc.id, data: doc.data()});
      });                        
      res.json({status:200,userDetails});  
  }).catch(err =>{
      res.json({status: 400, err});
  });
})

///////// Add new FAQ /////
router.post('/setFAQ',bodyParser.json(),(req,res) =>{
    db.collection('faq').add({
        question: req.body.question,
        answer: req.body.answer
      }).then(ref => {
        res.json({status:200});
      }).catch(err => {
          res.json({status: 400});
      });
  })

//// Update Subject ///////
router.put('/updateFaq',bodyParser.json(),(req, res) => {
    let updateRef = db.collection('faq').doc(req.body.id);
    updateRef.set({
        question: req.body.question,
        answer: req.body.answer
    },{merge:true})
    .then(
      res.json({status:200})  
    ).catch(err => {
        console.log(err);
        res.json({status:500, err});
    });
})

/////// Delete Subject /////
router.delete('/deleteFaq/:id',(req, res) => {
    db.collection('faq').doc(req.params.id).delete()
    .then(
        res.json({status:200})
    ).catch(err => {
        console.log(err);
        res.json({status:400});
    });
})

//// Make Admin /////
router.put('/makeAdmin',bodyParser.json(),(req, res) => {
    let updateRef = db.collection('users').doc(req.body.id);
    updateRef.set({
        adminFeatures : true
    },{merge:true})
    .then(
      res.json({status:200})  
    ).catch(err => {
        console.log(err);
        res.json({status:500, err});
    });
})


///// Revoke Admin ////////
router.put('/removeAdmin',bodyParser.json(),(req, res) => {
    let updateRef = db.collection('users').doc(req.body.id);
    updateRef.set({
        adminFeatures : false
    },{merge:true})
    .then(
      res.json({status:200})  
    ).catch(err => {
        console.log(err);
        res.json({status:500, err});
    });
})


module.exports = router;
