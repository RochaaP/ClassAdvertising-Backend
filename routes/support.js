const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var contactRef = db.collection("contactus");

router.get("/contactUs", (req, res, next) =>{
    console.log("Mtute-ContactUs");
    let contactUsReqs = [];    
    contactRef.get().then(async (snapshot) =>{
        snapshot.forEach(doc =>{
            contactUsReqs.push({id: doc.id, data: doc.data()});
        });                     
        res.status(200).json(contactUsReqs);  
    }).catch(err =>{
        console.log('Error getting ContactUs documents', err);
        const error = new Error('Error getting ContactUs documents', err);
        error.status = 500;
        next(error);
    });
});

router.post("/contactUs", (req, res, next) =>{
    console.log("Mtute-Contact Us");
    contactRef.add(req.body).then(()=>{
        res.status(200).send({"status": "OK"});
    },
    ()=>{
        const err = new Error("Failed to update the DB");
        err.status = 500;
        next(err);
    })
});

module.exports = router;