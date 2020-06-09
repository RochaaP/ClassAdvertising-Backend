const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser')


const admin = require('firebase-admin');

let db = admin.firestore();


router.post('/makeAppointment',bodyParser.json(),(req,res) =>{
    studentEmail =  req.body['studentEmail'],
    instructorEmail = req.body['instructorEmail']    

    var collectionInst = db.collection('users');
    collectionInst.where('email', "==", instructorEmail).get().then(snapshot =>{
        snapshot.forEach(docInst =>{
            console.log('inst' + docInst.id);

            firstnameInst = docInst.data().firstname;
            lastnameInst = docInst.data().lastname;
            let valeInst = `${firstnameInst} ${lastnameInst}`;
            let proPicInst = docInst.data().img_url;

            var collectionStu = db.collection('users');
            collectionStu.where('email', "==", studentEmail).get().then(snapshot =>{
                snapshot.forEach(docStu=>{
                console.log('stu' + docStu.id);


                firstnameStu = docStu.data().firstname;
                lastnameStu = docStu.data().lastname;
                let valeStu = `${firstnameStu} ${lastnameStu}`;
                let proPicStu = docStu.data().img_url;
            
            let addDoc = db.collection('temp')
                .where('instructorEmail', '==', instructorEmail)
                .where('studentEmail', '==', studentEmail).get().then(snapshot =>{
                    if (snapshot.empty) {
                        userDetails = [req.body['content']];
                        console.log('user doc does not exist');
                        let addDoc = db.collection('temp').add({
                            content: userDetails,
                            studentEmail: req.body['studentEmail'],
                            nameStu: valeStu,
                            img_urlStu: proPicStu,
                            instructorEmail: req.body['instructorEmail'], 
                            nameInst: valeInst,
                            img_urlInst: proPicInst,
                        }).then(ref => {
                            console.log('Added document with ID: ', ref.id);
                        }).catch(err => {
                            res.status(500).json(err);
                        })
                    }  
                    snapshot.forEach(doc =>{
                        console.log('user doc exist');
                        this.userd = doc.data().content;
                        this.userd.push(req.body['content']);

                        let updateRef = db.collection('temp').doc(doc.id);
                        console.log(doc.id);
                        updateRef.set({
                            content: this.userd,
                            nameStu: valeStu,
                            img_urlStu: proPicStu,
                            nameInst: valeInst,
                            img_urlInst: proPicInst,
                        },{merge:true})
                        .then(
                            console.log('documetn updated')
                        ).catch(err => {
                            res.status(500).json(err);
                        })
                        
                        });                        
                    }).catch(err =>{
                        res.status(500).json('Error getting document: '+ err);
                    });
                });                        
        
            }).catch(err =>{
                res.status(500).json('Error getting document: '+ err);
            }); 
        }); 
    });              
});


//get all appointments - for instructor
router.post('/getAppointments/instructor',bodyParser.json(), (req, res) => {
    let email = req.body['email'];
    let messages=[];
    var collection = db.collection('temp');
   
    collection.where('instructorEmail', "==", email).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            messages.push({id:doc.id, data: doc.data()});
        });            
        res.json({status: 200, messages});            
    }).catch(err =>{
        res.json({status: 500, err});
    });
});



//get all appointments - for student
router.post('/getAppointments/student',bodyParser.json(), (req, res) => {
    let email = req.body['email'];
    let userDetails=[];
    var collection = db.collection('temp');
   
    collection.where('studentEmail', "==", email).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            userDetails.push({id:doc.id, data: doc.data()});
        });                        
        res.status(200).json(userDetails);   
    }).catch(err =>{
        res.status(500).json('Error getting document: '+ err);
    });
});

router.post('/makeAppointment/instructor/reply', bodyParser.json(), (req, res) => {
    console.log(req.body);
    id = req.body['id'];
    console.log(id);
    let tempRef = db.collection('temp').doc(id);
    let query = tempRef.get().then(doc => {
        console.log('user doc exist');
        this.userd = doc.data().content;
        this.userd.push(req.body['content']);

        let updateRef = db.collection('temp').doc(id);
        updateRef.set({
            content: this.userd
        },{merge:true})
        .then(
            console.log('documetn updated')
        ).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });    
  }); 


  module.exports = router;