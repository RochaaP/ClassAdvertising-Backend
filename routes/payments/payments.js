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

router.get("/byPaymentId/:id", (req, res, next) =>{
    console.log("Mtute-Payements");    
    let id = req.params.id;
    let payments = [];
    paymentRef.where("payment_id", "==", id).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            payments.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(payments);
    }).catch(err =>{
        console.log('Error getting payment documents', err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

router.get("/byUser/:id", (req, res, next) =>{
    console.log("Mtute-Payements");    
    let id = req.params.id;
    let payments = [];
    paymentRef.where("order_id", "==", id).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            payments.push({id: doc.id, data: doc.data()});
        });                        
        res.status(200).json(payments);
    }).catch(err =>{
        console.log('Error getting payment documents', err);
        const error = new Error(err);
        error.status = 500;
        next(error);
    });
});

// Delete payment by Id
router.delete("/:id", (req, res, next) =>{
    console.log("Mtute-Payements");    
    let id = req.params.id;
    paymentRef.doc(id).delete().then(onfulfilled =>{
        res.status(200).json({data: onfulfilled, status: true})
    },
    onRejected =>{
        const error = new Error(onRejected);
        error.status = 500;
        next(error);
    }).catch(err =>{
        const error = new Error('Error getting payment document: '+ err);
        error.status = 500;
        next(error);
    });
});

module.exports = router;