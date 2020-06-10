const express = require("express");
const router = express.Router();

const admin = require('firebase-admin');

let db = admin.firestore();
var paymentRef = db.collection("payments");

router.post("/", (req, res, next) =>{
  console.log("Mtute-Payements");
  paymentRef.add(req.body).then(onfulfilled => {
      console.log('Added payment document with ID: ', onfulfilled.id);
      res.status(201).json(onfulfilled.id);
    },
    onRejected =>{
      const error = new Error(onRejected);
      error.status = 500;
      next(error);
    });
});

router.post("/", (req, res, next) =>{
    console.log("Mtute-Payements");
    paymentRef.add(req.body).then(onfulfilled => {
        console.log('Added payment document with ID: ', onfulfilled.id);
        res.status(201).json(onfulfilled.id);
      },
      onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
      });
});

module.exports = router;