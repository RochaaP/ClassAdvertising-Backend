const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var paperRef = db.collection("papers");

// Get all papers
router.get("/", (req, res, next) =>{
    console.log("Mtute-Papers");
    let papers = [];
    paperRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            papers.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(papers);
    }).catch(err =>{
        console.log('Error getting paper documents', err);
        res.status(500).json('Error getting paper documents', err);
    });
});

// Get papers by subjectId
router.get("/subject/:subjectId", (req, res, next) =>{
    let subjectId = req.params.subjectId;
    console.log("Mtute-Papers by SubjectId " + subjectId);   
    let papers = [];
    paperRef.where('subject', '==', subjectId).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            papers.push({id: doc.id, data: doc.data()});
        });   
        console.log(papers);
        res.status(200).json(papers);
    }).catch(err =>{
        const error = new Error('Error getting paper documents: '+ err);
        error.status = 500;
        next(error);
    });
});

// Get papers by instructorId
router.get("/instructor/:instructorId", (req, res, next) =>{
    let instructorId = req.params.instructorId;
    console.log("Mtute-Papers by InstructorId " + instructorId);   
    let papers = [];
    paperRef.where('instructor', '==', instructorId).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            papers.push({id: doc.id, data: doc.data()});
        });   
        console.log(papers);
        res.status(200).json(papers);
    }).catch(err =>{
        const error = new Error('Error getting paper documents: '+ err);
        error.status = 500;
        next(error);
    });
});

// Get papers by paperId
router.get("id/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-Paper " + id);
    paperRef.doc(id).get().then(doc =>{    
        if(doc.data()==undefined){
            console.log("Not available");
            const error = new Error("There is no paper with " + id);
            error.status = 500;
            next(error);
        }
        else{
            res.status(200).json({id: doc.id, data: doc.data()});
        }     
    }).catch(err =>{
        const error = new Error('Error getting paper document: '+ err);
        error.status = 500;
        next(error);
    });
});

// Delete paper by Id
router.delete("/:id", (req, res, next) =>{
    let id = req.params.id;
    console.log("Mtute-Paper " + id);
    paperRef.doc(id).delete().then(onfulfilled =>{
        res.status(200).json({data: onfulfilled, status: true})
    },
    onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
    }).catch(err =>{
        const error = new Error('Error getting paper document: '+ err);
        error.status = 500;
        next(error);
    });
});

// Create paper
router.post("/", (req, res, next) =>{
    paperRef.add(req.body).then(onfulfilled => {
        console.log('Added paper document with ID: ', onfulfilled.id);
        res.status(201).json(onfulfilled.id);
      },
      onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
      });
});

router.post("/subjects/",async (req, res, next) =>{
    let subjectArray = req.body["subjectArray"];  
    console.log(subjectArray);
    let papers = [];
    const waitForPapers = new Promise(async (resolve, reject)=>{
        await subjectArray.forEach(async (element,index, array) => {
            console.log("Subject Id: " + element);
            let sub_papers = [];
            await paperRef.where("subject", "==", element).get().then(snapshot =>{
                snapshot.forEach(doc =>{
                    sub_papers.push({id: doc.id, data: doc.data()});
                });
                console.log(sub_papers);
            }).catch(err =>{
                const error = new Error('Error getting paper documents: '+ err);
                error.status = 500;
                next(error);
            });
            papers.push({subject: element, papers: sub_papers});
            if(index === array.length-1) resolve()
        });
    })
    waitForPapers.then(()=>{
        console.log(papers);
        res.status(200).json(papers);
    });
});

// Update paper details
router.put("/", (req, res, next) =>{
    console.log("Mtute-Paper Updated");
    paperRef.doc(req.body.id).update(req.body.data).then(onfulfilled => {
        console.log('Added paper document with ID: ', onfulfilled.id);
        res.status(201).json(onfulfilled.id);
      },
      onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
      });
});

module.exports = router;