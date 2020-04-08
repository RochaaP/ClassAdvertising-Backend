const express = require("express");
const router = express.Router();
const http = require("http");

const ZOOM_CLIENT_ID = "mqTlZUVUTS6hpZWFal_SzQ";
const redirect_URL = "http://mtute.lk/accessToken";

// Get attempts by userId
router.get("/", (req, res, next) =>{    
    console.log("Mtute-Zoom");
    res.status(200).json({
        "Message": "Connected to mtute.lk"
    });
});

router.get("/getCode", (req, res, next) =>{
    console.log("Mtute-Zoom LOGIN");
    http.get("https://zoom.us/oauth/authorize?response_type=code&client_id=" + ZOOM_CLIENT_ID + "&redirect_uri=" + redirect_URL);
});

module.exports = router;