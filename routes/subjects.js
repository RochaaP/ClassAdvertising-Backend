const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var subjectRef = db.collection("subjects");

// Get all the subjects
router.get("/", (req, res, next) =>{
    console.log("Mtute-Subjects");
    let subjects = [];
    subjectRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            subjects.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(subjects);
    }).catch(err =>{
        console.log('Error getting subject documents', err);
        res.status(500).json('Error getting subject documents', err);
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
        res.status(500).json('Error getting subject document: '+ err);
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
        res.status(500).json({data: onRejected, status: false})
    }).catch(err =>{
        res.status(500).json('Error getting subject document: '+ err);
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