const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var attemptRef = db.collection("attempts");

// Get attempts by userId
router.get("/byuser/:userId", (req, res, next) =>{    
    console.log("Mtute-Attempts Filter By User Id");
    let userId = req.params.userId;
    let attempts = [];
    attemptRef.where('user', "==", userId).get().then(snapshot =>{
        snapshot.forEach(docs =>{
            attempts.push({id: docs.id, data: docs.data()});
        });                        
        res.status(200).json(attempts);   
    }).catch(err =>{
        console.log(err);
        const error = new Error(err);
        error.status = 500;
        next(error)
    });
});

// Get question by id
router.get("/byuserpaper/:userId/:paperId", (req, res, next) =>{
    console.log("Mtute-Attempt Filter By User Id and Paper Id" + id);
    let userId = req.params.userId;
    let paperId = req.params.paperId;
    attemptRef.where('user', '==', userId).where('paper', '==', paperId).get().then(docs =>{    
        if(docs.data()==undefined){
            console.log("Not available");
            const error = new Error("There is no attempt with " + id);
            error.status = 500;
            next(error);
        }
        else{
            res.status(200).json({id: docs.id, data: docs.data()});
        }     
    }).catch(err =>{
        console.log(err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

// Delete question by id
router.delete("/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-Attempt " + id);
    attemptRef.docs(id).delete().then(onfulfilled =>{
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

// Create/Update attempt
router.post("/", (req, res, next) =>{
    console.log("Mtute-Attempt POST")
    attemptRef.where('user', '==', req.body.user).where('paper', '==', req.body.paper).get().then(docs =>{ 
        let attempts = [];
        docs.forEach(doc=>{
            attempts.push({id: doc.id, data: doc.data()})
        })
        console.log(attempts.length);
        if(attempts.length==0){
            attemptRef.add(req.body).then(onfulfilled => {
                console.log('Added attempt document with ID: ', onfulfilled.id);
                res.status(201).json(onfulfilled.id);
              },
              onRejected =>{
                const error = new Error(onRejected);
                error.status = 500;
                next(error);
              });
        }
        else if(attempts.length == 1){
            let previousAttempt = attempts[0].data;
            console.log(previousAttempt);
            let prev_avg = Number(previousAttempt["average"]);
            let prev_highest = Number(previousAttempt["highest"]);
            let prev_lowest = Number(previousAttempt["lowest"]);
            let prev_no_of_attempts = Number(previousAttempt["no_of_attempts"]);

            let attempt = req.body;
            let no_of_attempts = Number(previousAttempt["no_of_attempts"]) + 1;
            let average = Number((((prev_avg * prev_no_of_attempts) + Number(attempt["average"])) / (no_of_attempts)).toFixed(2));
            let highest;
            if(prev_highest > attempt["highest"]){
                highest = prev_highest;
            }
            else{
                highest = attempt["highest"];
            }
            let lowest;
            if(prev_lowest < attempt["lowest"]){
                lowest = prev_lowest;
            }
            else{
                lowest = attempt["lowest"];
            }
            let updatedAttempt = {
                "average": average,
                "highest": highest,
                "lowest": lowest,
                "no_of_attempts": no_of_attempts,
                "timestamp": attempt["timestamp"],
                "user": attempt["user"],
                "paper": attempt["paper"]
            }
            console.log(updatedAttempt);
            attemptRef.doc(attempts[0].id).update(updatedAttempt).then(onfulfilled => {
                console.log('Updated attempt document with ID: ', attempts[0].id);
                res.status(201).json(attempts[0].id);
              },
              onRejected =>{
                const error = new Error(onRejected);
                error.status = 500;
                next(error);
              });
        }   
        else{
            const error = new Error("There should be only one docs for a user for a paper");
            error.status = 500;
            next(error);
        }  
    }).catch(err =>{
        console.log(err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

module.exports = router;