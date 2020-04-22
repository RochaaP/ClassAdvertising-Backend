const express = require("express");
const router = express.Router();
const http = require("http");
const https = require("https");
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

// POST attempts
router.post("/", (req, res, next) =>{    
    console.log("Mtute-Zoom");
    console.log(req.body);
    res.status(200).json({
        "Message": "Connected to mtute.lk ZOOM"
    });
});

// This will be called by the UI
router.get("/zoomLogin", (req, res, next) =>{
    console.log("Mtute-Zoom LOGIN");
    http.get("http://zoom.us/oauth/authorize?response_type=code&client_id=" + ZOOM_CLIENT_ID + "&redirect_uri=" + redirect_URL);
    res.status(200).json({"message": "Authorizing..."});
});

// This will be called by the zoom server
router.get("/accessToken/:code", (req, res, next) =>{ 
    console.log("Mtute-Zoom LOGIN Code"); 
    res.header("Authorization", authorizationCode);
    let code = req.params.code;
    axios.get("http://zoom.us/oauth/token?grant_type=authorization_code&code=" + code + "&redirect_uri=" + redirect_URL);
    res.status(200).json({"message": "Requesting access token..."});
});

// This will be called by the zoom server
router.post("/accessToken/", (req, res, next) =>{ 
    console.log("Mtute-Zoom LOGIN Token"); 
    token = req.body["access_token"];
    axios.post("http://localhost:4200/", req.body);    
    res.status(200).json({"message": "Sending access token..."});
});

module.exports = router;