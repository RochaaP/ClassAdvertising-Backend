const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
let storage = admin.storage();

var userRef = db.collection("users");
var paperRef = db.collection("papers");
var questionRef = db.collection("questions");
var noteRef = db.collection("notes");
var newsfeedRef = db.collection("newsfeeds");
var attemptsRef = db.collection("attempts");
var instructorRef = db.collection("instructor");
var instituteRef = db.collection("institute");
var studentRef = db.collection("student");
var paymentsRef = db.collection("payments");
var postsRef = db.collection("posts");
var tempRef = db.collection("temp");


const remoteUserId = "vhW15gAUqTYAw0VjZ2HD";

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
    let userId = req.params.id;
    console.log("Mtute-User " + userId);
    userRef.doc(userId).get().then(userSnapshot=>{
        let user = userSnapshot.data();

        userRef.doc(userId).delete().then(() =>{
    
            // remove the pic
            if(user.metadata != "" ){                
                storage.bucket("mtute-sl.appspot.com").file(JSON.parse(user.metadata).fullPath).delete().then(()=>{})
                .catch(err =>{
                    const error = new Error('Error deleting images/files: '+ err);
                    error.status = 500;
                    next(error);
                });
            }
            else{
                // nothing to do
            }

            if(user.role=="instructor"){
                instructorRef.doc(userId).get().then(instructorSnapshot=>{
                    let instructor = instructorSnapshot.data();
    
                    // remove the pic
                    if(instructor.backgroundMetaData != "" ){                
                        storage.bucket("mtute-sl.appspot.com").file(JSON.parse(instructor.backgroundMetaData).fullPath).delete().then(()=>{})
                        .catch(err =>{
                            const error = new Error('Error deleting images/files: '+ err);
                            error.status = 500;
                            next(error);
                        });
                    }
                    else{
                        // nothing to do
                    }
                })
                instructorRef.doc(userId).delete().then(() =>{},
                onRejected =>{
                    const error = new Error(onRejected);
                    error.status = 500;
                    next(error);
                });

                paperRef.where('instructor', '==', userId).get().then(paperSnapshot =>{
                    paperSnapshot.forEach(doc1 =>{
                        let paperId = doc1.id;
                        let data1 = doc1.data();
                        if(data1.published){
                            data1.instructor = remoteUserId;
                            paperRef.doc(paperId).update(data1).then(() => {
                                questionRef.where('paper', '==', paperId).get().then(questionSnapshot =>{
                                    questionSnapshot.forEach(doc2 =>{
                                        let questionId = doc2.id;
                                        let data2 = doc2.data();
                                        data2.instructor = remoteUserId;
                                        questionRef.doc(questionId).update(data2).then(() => {},
                                            onRejected =>{
                                            const error = new Error(onRejected);
                                            error.status = 500;
                                            next(error);
                                        });
                                    });
                                }).catch(err =>{
                                    const error = new Error('Error getting question documents: '+ err);
                                    error.status = 500;
                                    next(error);
                                });
                            },
                              onRejected =>{
                                const error = new Error(onRejected);
                                error.status = 500;
                                next(error);
                            });
                        }
                        else{
                            paperRef.doc(paperId).delete().then(() => {
                                questionRef.where('paper', '==', paperId).get().then(questionSnapshot =>{
                                    questionSnapshot.forEach(doc3 =>{
                                        let questionId = doc3.id;
                                        questionRef.doc(questionId).delete.then(() => {},
                                            onRejected =>{
                                            const error = new Error(onRejected);
                                            error.status = 500;
                                            next(error);
                                        });
                                    });
                                }).catch(err =>{
                                    const error = new Error('Error getting question documents: '+ err);
                                    error.status = 500;
                                    next(error);
                                });
                            },
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                        }
                    });
                }).catch(err =>{
                    const error = new Error('Error getting paper documents: '+ err);
                    error.status = 500;
                    next(error);
                });
        
                // add remote user and transfer all the notes to the remote user
                noteRef.where("instructor", "==", userId).get().then(noteSnapshot=>{
                    noteSnapshot.forEach(doc=>{
                        let noteId = doc.id;
                        let data = doc.data();
                        data.instructor = remoteUserId;
                        noteRef.doc(noteId).update(data).then(() => {},
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                    });
                }).catch(err =>{
                    const error = new Error('Error getting notes documents: '+ err);
                    error.status = 500;
                    next(error);
                });
        
                newsfeedRef.where("userId", "==", userId).get().then(newsfeedSnapshot=>{
                    newsfeedSnapshot.forEach(doc=>{
                        let newsfeedId = doc.id;
                        newsfeedRef.doc(newsfeedId).delete().then(() => {},
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                    });
                }).catch(err =>{
                    const error = new Error('Error getting newsfeed documents: '+ err);
                    error.status = 500;
                    next(error);
                });

                tempRef.where("instructorEmail", "==", user.email).get().then(tempSnapshot=>{
                    tempSnapshot.forEach(doc=>{
                        let tempId = doc.id;
                        tempRef.doc(tempId).delete().then(() => {},
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                    });
                }).catch(err =>{
                    const error = new Error('Error getting temp documents: '+ err);
                    error.status = 500;
                    next(error);
                });
            }
            else if (user.role=="institute"){
                instituteRef.doc(userId).get().then(instituteSnapshot=>{
                    let institute = instituteSnapshot.data();
    
                    // remove the pic
                    if(institute.backgroundMetaData != "" ){                
                        storage.bucket("mtute-sl.appspot.com").file(JSON.parse(institute.backgroundMetaData).fullPath).delete().then(()=>{})
                        .catch(err =>{
                            const error = new Error('Error deleting images/files: '+ err);
                            error.status = 500;
                            next(error);
                        });
                    }
                    else{
                        // nothing to do
                    }
                });
                instituteRef.doc(userId).delete().then(() =>{},
                onRejected =>{
                    const error = new Error(onRejected);
                    error.status = 500;
                    next(error);
                });
            }
            else{
                studentRef.doc(userId).get().then(studentSnapshot=>{
                    let student = studentSnapshot.data();
                });
                studentRef.doc(userId).delete().then(() =>{},
                onRejected =>{
                    const error = new Error(onRejected);
                    error.status = 500;
                    next(error);
                });
    
                // remove the pic
                if(institute.backgroundMetaData != "" ){                
                    storage.bucket("mtute-sl.appspot.com").file(JSON.parse(institute.backgroundMetaData).fullPath).delete().then(()=>{})
                    .catch(err =>{
                        const error = new Error('Error deleting images/files: '+ err);
                        error.status = 500;
                        next(error);
                    });
                }
                else{
                    // nothing to do
                }
    
                attemptsRef.where("user", "==", userId).get().then(attemptSnapshot=>{
                    attemptSnapshot.forEach(doc=>{
                        let attemptId = doc.id;
                        attemptsRef.doc(attemptId).delete().then(() => {},
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                    });
                }).catch(err =>{
                    const error = new Error('Error getting attempt documents: '+ err);
                    error.status = 500;
                    next(error);
                });

                tempRef.where("studentEmail", "==", user.email).get().then(tempSnapshot=>{
                    tempSnapshot.forEach(doc=>{
                        let tempId = doc.id;
                        tempRef.doc(tempId).delete().then(() => {},
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                    });
                }).catch(err =>{
                    const error = new Error('Error getting temp documents: '+ err);
                    error.status = 500;
                    next(error);
                });
            }

            paymentsRef.where("order_id", "==", userId).get().then(paymentSnapshot=>{
                paymentSnapshot.forEach(doc=>{
                        let paymentId = doc.id;
                        paymentsRef.doc(paymentId).delete().then(() => {},
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                    });
                }).catch(err =>{
                    const error = new Error('Error getting payment documents: '+ err);
                    error.status = 500;
                    next(error);
                });

            postsRef.where("email", "==", user.email).get().then(postSnapshot=>{
                postSnapshot.forEach(doc=>{
                        let postId = doc.id;
                        postsRef.doc(postId).delete().then(() => {},
                            onRejected =>{
                            const error = new Error(onRejected);
                            error.status = 500;
                            next(error);
                        });
                    });
                }).catch(err =>{
                    const error = new Error('Error getting post documents: '+ err);
                    error.status = 500;
                    next(error);
                });

            res.status(200).json({status: true})
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