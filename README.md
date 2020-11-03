# Javascript / Puppeteer Instagram Scheduler

## IMPORTANT

IMPORTANT - This puppeteer script will not run without a version of chromium that
has NOT been compiled with the video/audio codecs. Chrome comes with them as standard
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
const cs  = require ('./creator_studio.js');

// Set your facebook username and password
cs.creator_studio.user('me@gmail.com');
cs.creator_studio.pass('facebook_password');

// Set the cookie file locations
cs.creator_studio.cookiefile('./cookies.json');

// Update the puppeteer launch settings.
// Use to update the executablePath of the Chromium location you downloaded
// with the media codecs included.
cs.creator_studio.settings({ 
    headless: true, 
    devtools: false,
    executablePath: "./Chromium.app/Contents/MacOS/Chromium"
});

// Update the IG_Post object to customise the post.
cs.creator_studio.IG_post.caption       = 'This is the new Caption!';
cs.creator_studio.IG_post.video         = './output.mov';
cs.creator_studio.IG_post.cover         = './photo.jpg';

// Run, you fools!
cs.creator_studio.run();
```

## Usage CLI

You can run the command through the command line (without installing), like this:

```
node . -u me@gmail.com -p PASSWORD -f /Users/me/cookies.json -v ./output.mov -c "Crosspost" -d 05/11/2020 -t 02:00 -x yes
```

Run the help file with:

```
node . --help
```

Install the commandline tool with: (while in the directory)
```
npm install -g .
```

Uninstall with:
```
npm uninstall -g ig-scheduler
```

Run an installed veersion with `cs`
```
cs -u me@gmail.com -p PASSWORD -f /Users/me/cookies.json -v ./output.mov -c "Crosspost" -d 05/11/2020 -t 02:00 -x yes
```
