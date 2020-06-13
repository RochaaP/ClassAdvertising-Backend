const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var paperRef = db.collection("papers");
var subjectRef = db.collection("subjects");
var userRef = db.collection("users");

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
        const error = new Error(err);
        error.status = 500;
        next(error);
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
    console.log(req.auth);
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

// Get papers by instructor email
router.get("/instructoremail/:email", (req, res, next) =>{
    let email = req.params.email;
    console.log("Mtute-Papers by InstructorEmail " + email);   
    let subjects = [];
    let papers = [];
    userRef.where('email', "==", email).limit(1).get().then(snapshot =>{
        snapshot.forEach(user =>{            
            paperRef.where('instructor', '==', user.id).where('published', '==', true).get().then(snapshot =>{
                snapshot.forEach(doc =>{
                    papers.push({id: doc.id, data: doc.data()});
                });  
                console.log(papers);
                subjectRef.get().then(s_snapshot=>{
                    s_snapshot.forEach(subject=>{
                        subjects.push({id: subject.id, data: subject.data()});
                    });                    
                    res.status(200).json({"papers":papers, "subjects":subjects});
                }).catch(err =>{
                    const error = new Error('Error getting subjects documents: '+ err);
                    error.status = 500;
                    next(error);
                });
            }).catch(err =>{
                const error = new Error('Error getting paper documents: '+ err);
                error.status = 500;
                next(error);
            });
        });
    }).catch(err =>{
        const error = new Error('Error getting user documents: '+ err);
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

router.post("/subject/",async (req, res, next) =>{    
    console.log("Mtute-Paper Filter by Subject");
    let subject = req.body["subject"]; 
    console.log(subject);
    let papers = [];    
    let sub_papers = [];             
    let index_paperSnapshot = 0;           
    await paperRef.where("subject", "==", subject).where("published", "==", true).get().then(snapshot =>{
        if(snapshot.empty){
            papers.push({subject: subject, papers: []});
            res.status(200).json(papers);
        }
        else{
            snapshot.forEach((doc) =>{
                sub_papers.push({id: doc.id, data: doc.data()});
                index_paperSnapshot++;
                if(index_paperSnapshot === snapshot.size){
                    papers.push({subject: subject, papers: sub_papers});
                    res.status(200).json(papers);
                }
            });
        }
    }).catch(err =>{
        const error = new Error('Error getting paper documents: '+ err);
        error.status = 500;
        next(error);
    });
});

router.post("/subjects/",async (req, res, next) =>{
    let subjectArray = req.body["subjectArray"];  
    let subjectArrayLength = subjectArray.length;
    let index = 0;
    console.log(subjectArray);
    let papers = [];
    const waitForPapers = new Promise(async (resolve, reject)=>{
        await subjectArray.forEach(async (element) => {
            console.log("Index: " + index);
            console.log("Subject Id: " + element);
            let sub_papers = [];            
            let index_paperSnapshot = 0;
            await paperRef.where("subject", "==", element).where("published", "==", true).get().then(snapshot =>{
                if(snapshot.empty){
                    papers.push({subject: element, papers: sub_papers});
                    if(index === subjectArrayLength) resolve()
                }
                else{
                    snapshot.forEach((doc, ) =>{
                        sub_papers.push({id: doc.id, data: doc.data()});
                        console.log(index_paperSnapshot);
                        index_paperSnapshot++;
                        if(index_paperSnapshot === snapshot.size){
                            papers.push({subject: element, papers: sub_papers});
                            index++;
                            if(index === subjectArrayLength) resolve()
                        }
                    });
                    console.log(sub_papers);
                }
            }).catch(err =>{
                const error = new Error('Error getting paper documents: '+ err);
                error.status = 500;
                next(error);
            });
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