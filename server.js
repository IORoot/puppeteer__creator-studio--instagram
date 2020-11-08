'use strict';

const express = require('express');
const body_parser = require('body-parser');
const fs = require('fs');

// Import the creator_studio module.
const cs = require ('./creator_studio.js');
const vd = require ('./video_download.js');
const au = require ('./auth.json');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();


/**
 * Open folders
 */
app.use('/logs', express.static('logs'))
app.use('/videos', express.static('videos'))
app.use('/images', express.static('images'))

app.use(body_parser.json());


/**
 * Main route - run puppeteer
 */
app.post('/', (req, res) => {   

    /**
     * Check that the APIKEY is set and equal
     * to the configured one in auth.json file.
     */
    if (req.query.apikey != au[0].apikey){
        res.send('Please supply a correct apikey query parameter');
        return;
    }

    if (!req.body.user){
        res.send('Please supply a username');
        return;
    }

    if (!req.body.pass){
        res.send('Please supply a password');
        return;
    }

    if (!req.body.video){
        res.send('Please supply a video file');
        return;
    }

    if (!req.body.cookies){
        res.send('Please supply a cookie file');
        return;
    }

    cs.creator_studio.settings({ 
        headless: true, 
        devtools: false,    
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox']
    });
    
    // Set your facebook username
    cs.creator_studio.user(req.body.user);
    
    // Set your facebook password   
    cs.creator_studio.pass(req.body.pass);
    
    // Set the cookie file locations
    cs.creator_studio.cookies('/usr/src/app/cookies/' + req.body.cookies);
    
    // Required Args
    cs.creator_studio.IG_post.video = '/usr/src/app/videos/' + req.body.video;

    // Run, you fools!  
    cs.creator_studio.run();

    res.send('Puppeteer Started. Please check log file for status.');

});


/**
 * Downloader
 */
app.post('/vd', (req, res) => {   

    if (req.query.apikey != au[0].apikey){
        res.send('Please supply a correct apikey query parameter');
        return;
    }

    if (!req.body.url){
        res.send('Please supply a URL');
        return;
    }
    if (!req.body.file){
        res.send('Please supply a Filename');
        return;
    }

    // Run, you fools!  
    vd.video_downloader.download(req.body.url, req.body.file);

    res.send('Video Downloader Ran. URL: ' + req.body.url + '. To File: ' + req.body.file);

});





app.listen(PORT, HOST); 