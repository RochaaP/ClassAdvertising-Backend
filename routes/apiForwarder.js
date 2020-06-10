const express = require('express');
const router = express.Router();

// Routin Imports
const zoomRouter = require("./zoom/zoom");
const supportRouter = require("./support/support");
const commonRouter = require("./common/common");
const paperRouter = require("./papers/papers");
const questionRouter = require("./questions/questions");
const userRouter = require("./users/users");
const subjectRouter = require("./subjects/subjects");
const attemptRouter = require("./attempts/attempts");
const paymentRouter = require("./payments/payments");

const appointmentRouter = require("./appointments/appointments");
const appointmentTempRouter = require("./appointments/temp");


const adminImageRouter = require('./admin/images');
const adminVerifyRouter = require('./admin/verify');
const adminPanelRouter = require('./admin/panel');



const userDetailsRouter = require('./userDetails/navigate');

const instructorClassesRouter = require('./classes/instructors');
const instituteClassesRouter = require('./classes/institutes');

const notesRouter = require('./notes/files');
const postsRouter = require('./posts/posts');


// Routes
router.use("/zoom", zoomRouter);
router.use("/support", supportRouter);
router.use("/common", commonRouter);
router.use("/papers", paperRouter);
router.use("/questions", questionRouter);
router.use("/users", userRouter);
router.use("/subjects", subjectRouter);
router.use("/attempts", attemptRouter);
router.use("/payments", paymentRouter);

router.use('/admin/images', adminImageRouter);
router.use('/admin/verify', adminVerifyRouter);
router.use('/admin/panel', adminPanelRouter);

router.use('/userDetails', userDetailsRouter);

router.use('/appointments', appointmentRouter); 
router.use('/temp/appointments', appointmentTempRouter); 


router.use('/notes', notesRouter);
router.use('/posts', postsRouter);

router.use('/classes/instructor', instructorClassesRouter);
router.use('/classes/institute', instituteClassesRouter);

// Handling routing if no matching url is not found
router.use((req, res, next) =>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

module.exports = router;