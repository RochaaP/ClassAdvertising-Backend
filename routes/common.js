const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var subjectRef = db.collection("subjects");
var userRef = db.collection("users");

// Get all the subjects with instructors
router.get("/subjects_instructors", (req, res, next) =>{
    console.log("Mtute-Subjects");
    let subjects = [];    
    let instructors = [];
    subjectRef.get().then(async (snapshot) =>{
        snapshot.forEach(doc =>{
            subjects.push({id: doc.id, data: doc.data()});
        }); 
        await userRef.where("role", "==", "instructor").get().then(snapshot =>{
            snapshot.forEach(doc =>{
                let name = doc.data().firstname + " " + doc.data().lastname;
                instructors.push({id: doc.id, name: name});
            });                    
            res.status(200).json({
                "subjects": subjects, 
                "instructors": instructors
            });
        }).catch(err =>{
            console.log('Error getting user documents', err);
            const error = new Error('Error getting user documents', err);
            error.status = 500;
            next(error);
        });     
    }).catch(err =>{
        console.log('Error getting subject documents', err);
        const error = new Error('Error getting subject documents', err);
        error.status = 500;
        next(error);
    });
});

module.exports = router;