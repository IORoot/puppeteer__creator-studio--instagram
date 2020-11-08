'use strict';

const express = require('express');
const body_parser = require('body-parser');

// Import the creator_studio module.
const cs  = require ('./creator_studio.js');
const vd  = require ('./video_download.js');



// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(body_parser.json());

// Routes
app.post('/', (req, res) => {   

    cs.creator_studio.settings({ 
        headless: true, 
        devtools: false,    
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox']
    });
    
    // Set your facebook username
    cs.creator_studio.user(req.user);
    res.write(req.body.user);
    
    // Set your facebook password
    cs.creator_studio.pass(req.pass);
    res.write(req.body.pass);
    
    // Set the cookie file locations
    cs.creator_studio.cookies('/usr/src/app/cookie.json');
    

    // Required Args
    cs.creator_studio.IG_post.video = '/usr/src/app/output.mp4';

    // Run, you fools!  
    cs.creator_studio.run();

    res.send('Puppeteer Ran. User:' + req.body.user + '. Pass:' + req.body.pass);

});


app.post('/vd', (req, res) => {   

    // Run, you fools!  
    vd.video_downloader.download(req.body.url, req.body.file);

    res.send('Video Downloader Ran. URL: ' + req.body.url + '. To File: ' + req.body.file);

});

app.listen(PORT, HOST);

// console.log(`Running on http://${HOST}:${PORT}`);