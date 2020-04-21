const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var questionRef = db.collection("questions");
var userRef = db.collection("users");
var studentRef = db.collection("student");
var instructorRef = db.collection("instructor");

// Devolpement usages
router.get("/questions", (req, res, next) =>{
    console.log("Mtute-Users Development Mode");
    let questions = [];
    questionRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            questions.push({id: doc.id, data: doc.data()});
        });     
        questions.forEach(question=>{
            let uQuestion = {
                "subject": question.data.subject,
                "instructor": question.data.instructor,
                "question": question.data.question,
                "a": question.data.a,
                "b": question.data.b,
                "c": question.data.c,
                "d": question.data.d,
                "e": question.data.e,
                "answer": question.data.answer,
                "paper": question.data.paper,
                "number": question.data.number,
                "image": question.data.image,
                "image_url": question.data.image_url,
                "metadata": question.data.metadata,
                "image_A": false,
                "imageA": "",
                "image_B": false,
                "imageB": "",
                "image_C": false,
                "imageC": "",
                "image_D": false,
                "imageD": "",
                "image_E": false,
                "imageE": "",
                "a_metadata": "",
                "b_metadata": "",
                "c_metadata": "",
                "d_metadata": "",
                "e_metadata": ""
            }
            questionRef.doc(question.id).update(uQuestion);
        });                 
        res.status(200).json("Updated questions");;
    }).catch(err =>{
        console.log('Error getting user documents', err);
        res.status(500).json('Error getting user documents', err);
    });
});

// Devolpement usages
router.get("/role", (req, res, next) =>{
    console.log("Mtute-Users Development Mode");
    let users = [];
    userRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            users.push({id: doc.id, data: doc.data()});
        });     
        users.forEach(user=>{
            if(user.data.role!=undefined){
                if(user.data.role=="i"){
                    user.data.role = "instructor";
                    userRef.doc(user.id).update(user.data);
                }
                else if(user.data.role=="s"){
                    user.data.role = "student";
                    userRef.doc(user.id).update(user.data);
                }
                else{
                    // nothing to do
                }
            }
            else{
                // nothing to do
            }
        });                 
        res.status(200).json("Updated roles in all docs");;
    }).catch(err =>{
        console.log('Error getting user documents', err);
        res.status(500).json('Error getting user documents', err);
    });
});

// Devolpement usages
router.get("/subject", (req, res, next) =>{
    console.log("Mtute-Users Development Mode");
    let users = [];
    userRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            users.push({id: doc.id, data: doc.data()});
        });     
        users.forEach(user=>{
            if(user.data.units!=undefined && typeof(user.data.units) == "string"){
                user.data.units = JSON.parse(user.data.units);
                userRef.doc(user.id).update(user.data);
            }
        });                 
        res.status(200).json("Updated units in all docs");;
    }).catch(err =>{
        console.log('Error getting user documents', err);
        res.status(500).json('Error getting user documents', err);
    });
});

// Devolpement usages
router.get("/grade_level", (req, res, next) =>{
    console.log("Mtute-Users Development Mode");
    let users = [];
    userRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            users.push({id: doc.id, data: doc.data()});
        });     
        users.forEach(user=>{
            if(user.data.grade_level!=undefined){
                let grade_level = user.data.grade_level;
                if(grade_level=="g6"){
                    user.data.grade_level = "Grade_6";
                }
                else if(grade_level=="g7"){
                    user.data.grade_level = "Grade_7";
                }
                else if(grade_level=="g8"){
                    user.data.grade_level = "Grade_8";
                }
                else if(grade_level=="g9"){
                    user.data.grade_level = "Grade_6";
                }
                else if(grade_level=="ol"){
                    user.data.grade_level = "Ordinary_Level";
                }
                else if(grade_level=="al"){
                    user.data.grade_level = "Advanced_Level";
                }
                else if(grade_level=="other"){
                    user.data.grade_level = "Other";
                }
                else{
                    user.data.grade_level = "Other";
                }
                userRef.doc(user.id).update(user.data);
            }
        });                 
        res.status(200).json("Updated grade_level in all docs");;
    }).catch(err =>{
        console.log('Error getting user documents', err);
        res.status(500).json('Error getting user documents', err);
    });
});

// Devolpement usages
router.get("/student", (req, res, next) =>{
    console.log("Mtute-Users Development Mode");
    let users = [];
    userRef.where('role','==','s').get().then(snapshot =>{
        snapshot.forEach(doc =>{
            users.push({id: doc.id, data: doc.data()});
        });     
        users.forEach(user=>{
            studentRef.doc(user.id).get().then(onfulfilled=>{
                if(onfulfilled.exists){
                    console.log("It already has an student doc");
                }
                else{
                    let student = {
                        "email": user.data.email,
                        "subject": ""
                    }
                    studentRef.doc(user.id).set(student);
                }
            })
            studentRef.doc(user.id).set(student);
        });                 
        res.status(200).json("Created student docs for all user-student");;
    }).catch(err =>{
        console.log('Error getting user documents', err);
        res.status(500).json('Error getting user documents', err);
    });
});

// Devolpement usages
router.get("/instructor", (req, res, next) =>{
    console.log("Mtute-Users Development Mode");
    let users = [];
    userRef.where('role','==','i').get().then(snapshot =>{
        snapshot.forEach(doc =>{
            users.push({id: doc.id, data: doc.data()});
        });     
        users.forEach(user=>{
            instructorRef.doc(user.id).get().then(onfulfilled=>{
                if(onfulfilled.exists){
                    console.log("It already has an instructor doc");
                }
                else{
                    let verify = "assets/verification/not_verified.png";
                    if(user.data.verify!=undefined){
                        verify = user.data.verify;
                    }
                    else{
                        //nothing to do
                    }
                    let instructor = {
                        "achievement": [],
                        "backgroundImagePath": "",
                        "degree": "",
                        "degreeMSc": "",
                        "degreePhd": "",
                        "degreeYear": "",
                        "email": user.data.email,
                        "grad": "",
                        "gradeA": "",
                        "gradeB": "",
                        "gradeC": "",
                        "gradeS": "",
                        "personalAchievement": [],
                        "profileImagePath": "",
                        "subject": "",
                        "teachingSchool": "",
                        "university": "",
                        "universityMSc": "",
                        "universityPhD": "",
                        "verify": verify,
                        "yearExperiences": "",
                        "yearMSc": "",
                        "yearPhD": ""
                      }
                    instructorRef.doc(user.id).set(instructor);
                }
            })
        });                 
        res.status(200).json("Created instructor docs for all user-instructor");;
    }).catch(err =>{
        console.log('Error getting user documents', err);
        res.status(500).json('Error getting user documents', err);
    });
});

module.exports = router;