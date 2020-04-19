const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var subjectRef = db.collection("subjects");
var userRef = db.collection("users");

// Get all the subjects
router.get("/", (req, res, next) =>{
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
        }).catch(err =>{
            console.log('Error getting user documents', err);
            const error = new Error('Error getting user documents', err);
            error.status = 500;
            next(error);
        });                       
        res.status(200).json({
            "subjects": subjects, 
            "instructors": instructors
        });
    }).catch(err =>{
        console.log('Error getting subject documents', err);
        const error = new Error('Error getting subject documents', err);
        error.status = 500;
        next(error);
    });
});

// Get subject details by id
router.get("/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-Subject " + id);
    subjectRef.doc(id).get().then(doc =>{    
        if(doc.data()==undefined){
            console.log("Not available");
            const error = new Error("There is no subject with " + id);
            error.status = 500;
            next(error);
        }
        else{
            res.status(200).json({id: doc.id, data: doc.data()});
        }     
    }).catch(err =>{        
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

// Delete subject by id
router.delete("/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-Subject " + id);
    subjectRef.doc(id).delete().then(onfulfilled =>{
        res.status(200).json({data: onfulfilled, status: true})
    },
    onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
    }).catch(err =>{
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});


// Update subject details
router.post("/", (req, res, next) =>{
    subjectRef.add(req.body).then(onfulfilled => {
        console.log('Added subject document with ID: ', onfulfilled.id);
        res.status(201).json(onfulfilled.id);
      },
      onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
      });
});

module.exports = router;