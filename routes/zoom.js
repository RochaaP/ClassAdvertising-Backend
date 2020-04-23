const express = require("express");
const router = express.Router();
const http = require("http");
const axios = require('axios');

const ZOOM_CLIENT_ID = "w5mE3K3KQdC5ib7ZVDy4Tw"; //iLcPUG6S9iCPDJPxelsnA
const redirect_URL = "https://mtute.herokuapp.com/zoom";
const authorizationCode = "Basic dzVtRTNLM0tRZEM1aWI3WlZEeTRUdzpFdTN3OGZ0R0dSYWVJWDFJSnI2Z3M4a1RUS3dhbk41Rg==";
//Basic dzVtRTNLM0tRZEM1aWI3WlZEeTRUdzpFdTN3OGZ0R0dSYWVJWDFJSnI2Z3M4a1RUS3dhbk41Rg==
var token = null;

// Get attempts
router.get("/index", (req, res, next) =>{    
    console.log("Mtute-Zoom");
    res.status(200).json({
        "Message": "Connected to mtute.lk ZOOM"
    });
});

// This will be called by the zoom server
router.get("/accessToken/:code", (req, res, next) =>{ 
    console.log("Mtute-Zoom accessToken"); 
    const options = {
        headers: {"Authorization": `Basic dzVtRTNLM0tRZEM1aWI3WlZEeTRUdzpFdTN3OGZ0R0dSYWVJWDFJSnI2Z3M4a1RUS3dhbk41Rg==`}
      }
    let code = req.params.code;
    axios.post(`https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_URL}`, {}, options)
      .then(function (response) {
        console.log("Success accessToken");
        console.log(response);
        res.status(200).json(response.data);
      })
      .catch(function (err) {
        console.log(err);
        const error = new Error(err);
        next(error);
      });
});

// This will be called by the zoom server
router.get("/refreshToken/:token", (req, res, next) =>{ 
  console.log("Mtute-Zoom accessToken"); 
  const options = {
      headers: {"Authorization": `Basic dzVtRTNLM0tRZEM1aWI3WlZEeTRUdzpFdTN3OGZ0R0dSYWVJWDFJSnI2Z3M4a1RUS3dhbk41Rg==`}
    }
  let token = req.params.token;
  axios.post(`https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${token}`, {}, options)
    .then(function (response) {
      console.log("Success accessToken");
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (err) {
      console.log(err);
      const error = new Error(err);
      next(error);
    });
});

// This will be called by the zoom server
router.get("/userDetails/:token", (req, res, next) =>{ 
    console.log("Mtute-Zoom userDetails"); 
    let token = req.params.token;
    const options = {
        headers: {"Authorization": `Bearer ${token}`}
      }
      
    axios.get("https://api.zoom.us/v2/users/me", options)
      .then(function (response) {
        console.log(response);
        res.status(200).json(response.data);
      })
      .catch(function (err) {
        console.log(err);
        const error = new Error(err);
        if(err.response.data.message="Access token is expired."){
          console.log("Please refresh the zoom token");
        }
        next(error);
      });
});

// This will be called by the zoom server
router.get("/getMeetingList/:token", (req, res, next) =>{ 
    console.log("Mtute-Zoom getMeetingList"); 
    let token = req.params.token;
    const options = {
        headers: {"Authorization": `Bearer ${token}`}
      }
    axios.get("https://api.zoom.us/v2/users/me/meetings", options)
      .then(function (response) {
        console.log(response);
        res.status(200).json(response.data);
      })
      .catch(function (err) {
        console.log(err);
        const error = new Error(err);
        if(err.response.data.message="Access token is expired."){
          console.log("Please refresh the zoom token");
        }
        next(error);
      });
});

module.exports = router;