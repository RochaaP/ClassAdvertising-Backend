const express = require("express");
const router = express.Router();
const http = require("http");
const axios = require('axios');

const ZOOM_CLIENT_ID = "iLcPUG6S9iCPDJPxelsnA";
const redirect_URL = "http://mtute.lk/";
const authorizationCode = "Basic dzVtRTNLM0tRZEM1aWI3WlZEeTRUdzpFdTN3OGZ0R0dSYWVJWDFJSnI2Z3M4a1RUS3dhbk41Rg==";
var token = null;

// Get attempts
router.get("/", (req, res, next) =>{    
    console.log("Mtute-Zoom");
    res.status(200).json({
        "Message": "Connected to mtute.lk ZOOM"
    });
});

// This will be called by the zoom server
router.get("/accessToken/:code", (req, res, next) =>{ 
    console.log("Mtute-Zoom accessToken"); 
    const headers = {
        "Authorization": authorizationCode,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    let code = req.params.code;
    axios.post("http://zoom.us/oauth/token?grant_type=authorization_code&code=" + code + "&redirect_uri=" + redirect_URL, {}, headers)
      .then(function (response) {
        console.log(response);
        res.status(200).json(response);
      })
      .catch(function (err) {
        console.log(error);
        const error = new Error(err);
        next(error);
      });
});

// This will be called by the zoom server
router.get("/userDetails/:token", (req, res, next) =>{ 
    console.log("Mtute-Zoom userDetails"); 
    let token = req.params.token;
    const headers = {
        "Authorization": `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    axios.get("https://api.zoom.us/v2/users/me", headers)
      .then(function (response) {
        console.log(response);
        res.status(200).json(response);
      })
      .catch(function (err) {
        console.log(error);
        const error = new Error(err);
        next(error);
      });
});

// This will be called by the zoom server
router.get("/getMeetingList/:token", (req, res, next) =>{ 
    console.log("Mtute-Zoom getMeetingList"); 
    let token = req.params.token;
    const headers = {
        "Authorization": `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    axios.get("https://api.zoom.us/v2/users/me/meetings", headers)
      .then(function (response) {
        console.log(response);
        res.status(200).json(response);
      })
      .catch(function (err) {
        console.log(error);
        const error = new Error(err);
        next(error);
      });
});

module.exports = router;