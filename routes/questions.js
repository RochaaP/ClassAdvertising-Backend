const express = require("express");
const router = express.Router();

const fastcsv = require('fast-csv');
const fs = require('fs');

const admin = require('firebase-admin');

let db = admin.firestore();
var questionRef = db.collection("questions");
var paperRef = db.collection("papers");

// Get all the questions
router.get("/", (req, res, next) =>{
    console.log("Mtute-Questions");
    let questions = [];
    questionRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            questions.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(questions);
    }).catch(err =>{
        res.status(500).json('Error getting question documents by Paper Id: ', err);
    });
});

// Get questions by paperId
router.get("/paper/:paperId", (req, res, next) =>{    
    console.log("Mtute-Questions Filter By Paper Id");
    let paperId = req.params.paperId;
    let questions = [];
    questionRef.where('paper', "==", paperId).orderBy("number","asc").get().then(snapshot =>{
        snapshot.forEach(doc =>{
            questions.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(questions);   
    }).catch(err =>{
        res.status(500).json('Error getting question document by Paper Id: '+ err);
    });
});

// Get question by id
router.get("/id/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-Question " + id);
    questionRef.doc(id).get().then(doc =>{    
        if(doc.data()==undefined){
            console.log("Not available");
            const error = new Error("There is no question with " + id);
            error.status = 500;
            next(error);
        }
        else{
            res.status(200).json({id: doc.id, data: doc.data()});
        }     
    }).catch(err =>{
        res.status(500).json('Error getting question document: '+ err);
    });
});

// Delete question by id
router.delete("/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-Question " + id);
    questionRef.doc(id).delete().then(onfulfilled =>{
        res.status(200).json({data: onfulfilled, status: true})
    },
    onRejected =>{
        res.status(500).json({data: onRejected, status: false})
    }).catch(err =>{
        res.status(500).json('Error getting question document: '+ err);
    });
});

// Create question
router.post("/", (req, res, next) =>{
    questionRef.add(req.body).then(onfulfilled => {
        console.log('Added question document with ID: ', onfulfilled.id);
        res.status(201).json(onfulfilled.id);
      },
      onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
      });
});

// Update question
router.put("/", (req, res, next) =>{
    console.log("Mtute-Question Updated");
    questionRef.doc(req.body.id).update(req.body.data).then(onfulfilled=>{
        console.log('Updated question document with ID: ', onfulfilled.id);
        res.status(201).json(onfulfilled.id);
    },
    onRejected =>{
      const error = new Error(onRejected);
      error.status = 500;
      next(error);
    });
});

// Write questions to CSV files
router.get("/write/", async (req, res, next) => {
    console.log("Mtute Questions to CSV");
    let papers = [];
    await paperRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            papers.push({id: doc.id, data: doc.data()});
        });
    }).catch(err =>{
        console.log('Error getting paper documents', err);
        next(error);
    });
    papers.forEach(async (element, index, array) => {
        console.log("Paper Id: " + element.id);
        let questions = [];
        await questionRef.where("paper", "==", element.id).get().then(snapshot => {
            snapshot.forEach(doc => {
                questions.push(doc.data());
            });
        }).catch(err => {
            const error = new Error('Error getting paper documents: ' + err);
            error.status = 500;
            next(error);
        });
        if(questions.length!=0){
            let filepath = "Questions/" + element.id + ".csv";
            const ws = fs.createWriteStream(filepath);
            fastcsv.write(questions, { headers: true }).pipe(ws);
            console.log("Created " + filepath);
        }
        else{
            // nothing to do
        }
        if(index === array.length-1) res.status(200).json({"message": "Done"})
    });
});

module.exports = router;