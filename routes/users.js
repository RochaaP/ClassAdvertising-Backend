const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var userRef = db.collection("users");
var studentRef = db.collection("student");
var instructorRef = db.collection("instructor");

// Get all the users
router.get("/", (req, res, next) =>{
    console.log("Mtute-Users");
    let users = [];
    userRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            users.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(users);
    }).catch(err =>{
        console.log('Error getting user documents', err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

// Get user by email
router.post("/byEmail/", (req, res, next) =>{
    console.log("Mtute-User byEmail");
    console.log(req.body.email);
    userRef.where("email", "==", req.body.email).get().then(docs =>{
        let users = [];
        docs.forEach(doc=>{
            users.push({id: doc.id, data: doc.data()})
        })
        console.log(users.length);
        if(users.length==0){
            const error = new Error("No registered user with corresponding email");
            error.status = 500;
            next(error);
        }
        else if(users.length == 1){
            res.status(200).json(users[0]);
        }   
        else{
            const error = new Error("There should be only one doc for an email");
            error.status = 500;
            next(error);
        }  
    }).catch(err =>{
        console.log('Error getting user documents', err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

// Get user details by id
router.get("/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-User " + id);
    userRef.doc(id).get().then(doc =>{    
        if(doc.data()==undefined){
            console.log("Not available");
            const error = new Error("There is no user with " + id);
            error.status = 500;
            next(error);
        }
        else{
            res.status(200).json({id: doc.id, data: doc.data()});
        }     
    }).catch(err =>{
        console.log('Error getting user document: '+ err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

// Delete user by id
router.delete("/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-User " + id);
    userRef.doc(id).delete().then(onfulfilled =>{
        res.status(200).json({data: onfulfilled, status: true})
    },
    onRejected =>{        
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
    }).catch(err =>{
        console.log('Error getting user document: '+ err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

// Update user details
router.post("/", (req, res, next) =>{
    userRef.add(req.body).then(onfulfilled => {
        console.log('Added user document with ID: ', onfulfilled.id);
        res.status(201).json(onfulfilled.id);
      },
      onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
      });
});

module.exports = router;