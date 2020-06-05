const express = require("express");
const router = express.Router();


// const adminRouter = require('./admin');
const commonRouter = require('./common');
const instituteRouter = require('./institute');
const instructorRouter = require('./instructor');
const studentRouter = require('./student');

// router.use('./admin', adminRouter);
router.use('/common', commonRouter);
router.use('/institute', instituteRouter);
router.use('/instructor', instructorRouter);
router.use('/student', studentRouter);

module.exports = router;