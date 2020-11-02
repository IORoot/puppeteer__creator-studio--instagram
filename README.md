# Javascript / Puppeteer Instagram Scheduler

## IMPORTANT

IMPORTANT - This puppeteer script will not run without a version of chromium that
has been compiled with the video/audio codecs. Chrome comes with them as standard
but Chromium does not.

You can download a copy of Chromium with those codecs here:
https://chromium.woolyss.com/#mac-stable-ungoogled-marmaduke

You can then set the `executablePath` of puppeteer-core in the puppeteer settings
to point to this version of chromium.

Warning - If you do not do this, then chromium will not upload any videos to the
creator studio because it will not recognise those file formats.

## Description

This puppeteer script will automatically open up a new page, visit (or login) to 
facebook creator studio and create a new post with all of your supplied details.

This is a bare-bones example to make it as understandable as possible. It's meant
for readability and help to understand the process.

## Requirements

- Instagram 'business' account
- Facebook 'creator studio' account.
- Instagram account connected to the creator studio account.
- Puppeteer-Core (without chromium installed - we do that manually)

## Intricacies

Instagram will obfuscate and randomise all of the classnames on the page. This will
make it difficult to target the correct part of the page. All of the current
selectors and XPaths are in the `selector` object.

## Usage

Create a new `run.js` file and include the following:

```js
// Import the creator_studio module.
const cs  = require ('.r/creator_studio.js');

// Set your facebook username and password
cs.creator_studio.user('me@gmail.com');
cs.creator_studio.pass('myhardpass');

// Update the IG_Post object to customise the post.
cs.creator_studio.IG_post.caption       = 'This is the new Caption!';
cs.creator_studio.IG_post.video         = '/Users/me/Downloads/output.mov';
cs.creator_studio.IG_post.cover         = '/Users/me/Downloads/photo.jpg';

// Update the puppeteer launch settings.
// Use to update the executablePath of the Chromium location you downloaded
// with the media codecs included.
cs.creator_studio.puppeteer_settings    = { 
    headless: true, 
    devtools: false,
    executablePath: "/Users/me/Chromium.app/Contents/MacOS/Chromium"
};

// Run, you fools!
cs.creator_studio.run();
```


