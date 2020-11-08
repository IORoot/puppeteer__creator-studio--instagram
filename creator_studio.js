
/**
 * ISSUE - CHROMIUM NOT ABLE TO UPLOAD VIDEO
 * 
 * https://github.com/puppeteer/puppeteer/issues/291
 * 
 * Chromium cannot upload video, however, Chrome can. This is 
 * because chromium is compiled without any codec support. Therefore,
 * use a chromium version WITH support or use Chrome.
 * 
 * You can download a chromium version here:
 * https://chromium.woolyss.com/#mac-stable-ungoogled-marmaduke
 * 
 * Change the executablePath to a google chrome instance
 * executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
 */

var creator_studio = (function () {



    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                       Requirements                       │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘
    const puppeteer = require('puppeteer-core');
    const fs = require('fs');
    const util = require('util');





    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                     Global Variables                     │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘
    
    let browser;

    let page;

    let cookieFilename;

    let cookiefile;

    let new_cookies;



    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                   Username / Password                    │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘

    let user;

    let pass;



    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                    Puppeteer Settings                    │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘

    let puppeteer_settings = { 
        headless: true, 
        devtools: false,
        args: ['--no-sandbox']
    }


    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                 Instagram Post Variables                 │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘


    let IG_post = {
        caption:   "Test Puppeteer",
        location:  "London",
        date:      "",
        time:      "",
        video:     "",
        cover:     "",
        crosspost: "",
    };


    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                        Page URLS                         │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘

    const pages = {
        facebook:               'https://www.facebook.com',
        facebook_login:         'https://www.facebook.com/login',
        IG_creator_studio:      'https://business.facebook.com/creatorstudio/?tab=instagram_content_posts&collection_id=free_form_collection&content_table=INSTAGRAM_POSTS',
    };



    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                    Selectors / XPaths                    │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘
    
    const selector = {
        cookie_banner:          '[data-cookiebanner="accept_button"]',
        login_button:           '#loginbutton',
        new_post_button:        '#mediaManagerLeftNavigation [role="button"]',
        instagram_feed_link:    '[data-testid="ContextualLayerRoot"] [role="menuitem"]:first-of-type',
        tray_side:              '#creator_studio_sliding_tray_root',
        textarea_caption:       '[contenteditable="true"]',
        link_add_content:       '#creator_studio_sliding_tray_root [aria-haspopup="true"]:first-of-type',
        filebrowser_open:       '[rel="ignore"]',
        xpath_cover_image:      '//*[@id="creator_studio_sliding_tray_root"]/div/div/div[2]/div[2]/div[2]',
        xpath_custom_upload:    '//*[@id="creator_studio_sliding_tray_root"]/div/div/div[2]/div[1]/div/div/div/div[2]',
        input_add_image:        'input[type="file"]',
        publish_chooser:        '//div[@id="creator_studio_sliding_tray_root"]/div/div/div[3]/div[2]/div/button',
        schedule_checkbox:      'body > div:nth-last-child(1) div[aria-checked="false"]',
        crosspost_checkbox:     '#creator_studio_sliding_tray_root button[role="checkbox"]',
        crosspost_chooser:      '#creator_studio_sliding_tray_root button[aria-haspopup="true"]',
        crosspost_schedule:     '.uiContextualLayerAboveRight div div div div:nth-of-type(3)',
        publish_button:         '#creator_studio_sliding_tray_root div div div:nth-of-type(3) button[aria-disabled]',
    };





    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                Custom Debugger / Logger                  │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘
    var log_file = fs.createWriteStream(__dirname + '/logs/debug.log', {flags : 'w'});
    var log_stdout = process.stdout;

    console.log = function(d) { //
        log_file.write(Date() + ' ' + util.format(d) + '\n');
        log_stdout.write(Date() + ' ' + util.format(d) + '\n');
    };




    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                Set the Facebook Username                 │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘

    function publicSetUsername(username){
        user = username;
    }




    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                Set the Facebook Password                 │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘
    function publicSetPassword(password){
        pass = password;
    }




    
    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                 Set Cookie Storage File                  │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘
    function publicSetCookieFile(cookieFile){
        cookieFilename = cookieFile;
        cookiefile = require(cookieFilename);
    }





    // ┌─────────────────────────────────────────────────────────┐
    // │                                                         │
    // │                Update Puppeteer Settings                │
    // │                                                         │
    // └─────────────────────────────────────────────────────────┘
    function publicSetPuppeteerSettings(settings){
        puppeteer_settings = settings;
    }

    


    // ┌──────────────────────────────────────────────────────────┐
    // │                                                          │
    // │                       Run Function                       │
    // │                                                          │
    // └──────────────────────────────────────────────────────────┘
    function publicRun(){


        (async () => {
        

            /**
             * New puppeteer
             */
            try {
                console.log('Launch Puppeteer');
                browser = await puppeteer.launch(puppeteer_settings);
            } catch (err) {
                console.log('Error launching puppeteer : ' + err);
            } 





            /**
             * New Browser
             */
            try {
                console.log('create browser');
                const context = browser.defaultBrowserContext();
                context.overridePermissions(pages.facebook, []);
            } catch (err) {
                console.log('Error creating browser : ' + err);
            } 



            
            /**
             * New Page
             */
            try {
            console.log('create page');
                page = await browser.newPage();
                await page.setDefaultNavigationTimeout(100000);
                await page.setViewport({ width: 1200, height: 800 });
            } catch (err) {
                console.log('Error creating page : ' + err);
            } 



            /**
             * Cookie File exists
             */
            if (Object.keys(cookiefile).length) {


                /**
                 * Read file.
                 */
                try {
                    console.log('load cookies');
                    await page.setCookie(...cookiefile); // ... spread all cookies.
                } catch (err) {
                    console.log('Error loading cookies : ' + err);
                } 

            }





            /**
             * No cookies, Login instead
             */
            if (!Object.keys(cookiefile).length) {
            

                console.log('login page');




                /**
                 * Goto Facebook Page
                 */
                try {
                    await page.goto(pages.facebook_login, { waitUntil: "networkidle2" });
                } catch (err) {
                    console.log('Error Visiting Facebook login page : ' + err);
                } 




                /**
                 * Click on Cookie Banner
                 */
                try {
                    await page.click(selector.cookie_banner);
                } catch (err) {
                    console.log('Error Clicking on cookie banner : ' + err);
                } 




                /**
                 * Run a javascript function in puppeteer.
                 * This passes in 'user' and sets the value.
                 */
                try {
                    await page.evaluate(x => {
                        document.getElementById('email').value = x
                    }, user);
                } catch (err) {
                    console.log('Error Setting User email in textbox : ' + err);
                } 





                /**
                 * Run a javascript function in puppeteer.
                 * This passes in 'pass' and sets the value.
                 */
                try {
                    await page.evaluate(x => {
                        document.getElementById('pass').value = x
                    }, pass);
                } catch (err) {
                    console.log('Error Setting User Password in textbox : ' + err);
                } 





                /**
                 * Wait
                 */
                try {
                    await page.waitForTimeout(1000);
                } catch (err) {
                    console.log('Error waiting : ' + err);
                } 





                /**
                 * Click the login button
                 */
                try {
                    await page.click(selector.login_button, { waitUntil: "networkidle2" });
                } catch (err) {
                    console.log('Error Clicking on Login button : ' + err);
                } 
            }




            /**
             * Visit Creator Studio.
             */
            try {
                await page.waitForTimeout(4000);
                page.goto(pages.IG_creator_studio);
            } catch (err) {
                console.log('Error visiting Creator Studio : ' + err);
            } 
            




            /**
             * Save Cookies
             */
            try {
                await page.waitForTimeout(4000);
                new_cookies = await page.cookies();
            } catch (err) {
                console.log('Error Saving Cookies : ' + err);
            } 





            /**
             * Write to file.
             * 
             * Note : needs a callback function as 3rd parameter to run once
             * complete. This canbe a simple error catcher console.log
             */
            try {
                await fs.writeFile(cookieFilename, JSON.stringify(new_cookies, null, 2), (err, data) => {
                    if (err) throw err;
                        console.log(data);
                    }
                ); 
            } catch (err) {
                console.log('Error writing cookies to file : ' + err);
            } 




            /**
             * Click "New Post" Button
             */
            try {
                console.log('click "new post" button');
                await page.waitForSelector(selector.new_post_button);
                await page.click(selector.new_post_button, { waitUntil: "networkidle2" });
            } catch (err) {
                console.log('Error clicking the "new post" button : ' + err);
            } 





            /**
             * Select the "instagram feed" button
             */
            try {
                console.log('Selecting "Instagram Feed" link');
                await page.waitForSelector(selector.instagram_feed_link);
                await page.click(selector.instagram_feed_link, { waitUntil: "networkidle2" });
            } catch (err) {
                console.log('Error clicking the "instagram feed" link : ' + err);
            } 
            




            /**
             * Wait for side tray
             */
            try {
                console.log('Wait for side tray');
                await page.waitForSelector(selector.tray_side);
            } catch (err) {
                console.log('Error waiting for the side tray : ' + err);
            }





            /**
             * Type in the caption of the new Instagram posts
             */
            try {
                console.log('Entering a Caption');
                await page.type(selector.textarea_caption, IG_post.caption);
            } catch (err) {
                console.log('Error filling in the caption into the textarea : ' + err);
            }
            




            /**
             * Enter a Location
             */
            try {
                console.log('Entering a Location');
                page.keyboard.press('Tab');
                page.keyboard.press('Tab');
                page.keyboard.type( IG_post.location );
            } catch (err) {
                console.log('Error filling in the location textbox : ' + err);
            }





            /**
             * Click on the +Add Content link
             */
            try {
                console.log('Clicking on the "+Add Content" link');
                await page.click(selector.link_add_content, { waitUntil: "networkidle2" });
                await page.waitForTimeout(1000);
            } catch (err) {
                console.log('Error clicking on the "+add content" link : ' + err);
            }


            


            /**
             *  Upload Video WITHOUT filebrowser
             */
            try {
                console.log('Selecting File');
                await page.waitForSelector('.uiContextualLayerPositioner input[type="file"]');
                const inputUploadHandle = await page.$('.uiContextualLayerPositioner input[type="file"]'); 
                inputUploadHandle.uploadFile(IG_post.video);


            } catch (err) {
                console.log('Error using the filebrowser and accepting input file : ' + err);
            }




            /**
             * Cross-post to facebook page
             */
            if ('' !== IG_post.crosspost ){
                try {
                    console.log('Click Facebook Page checkbox');
                    await page.waitForTimeout(500);
                    await page.click(selector.crosspost_checkbox, { waitUntil: "networkidle2" });
                } catch (err) {
                    console.log('Error clicking the facebook crosspost checkbox : ' + err);
                }
            }


            

            /**
             * Schedule the facebook crossposts
             */
            if ('' !== IG_post.crosspost && '' !== IG_post.date && '' !== IG_post.time){
                

                /**
                 * Click down arrow next to crosspost 'publish'
                 */
                try {
                    console.log('Click crosspost down-arrow');
                    await page.waitForTimeout(500);
                    await page.click(selector.crosspost_chooser, { waitUntil: "networkidle2" });
                } catch (err) {
                    console.log('Error clicking crosspost options down-arrow : ' + err);
                }


                /**
                 * Click down arrow next to crosspost 'publish'
                 */
                try {
                    console.log('Click crosspost schedule checkbox');
                    await page.waitForTimeout(1000);
                    await page.click(selector.crosspost_schedule, { waitUntil: "networkidle2" });
                } catch (err) {
                    console.log('Error clicking crosspost schedule checkbox : ' + err);
                }


                /**
                 * Add date
                 */
                try {
                    console.log('Add crosspost date');
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.type( IG_post.date,  { waitUntil: "networkidle2" } );
                } catch (err) {
                    console.log('Error typing in the crosspost date : ' + err);
                }


                /**
                 * Add Time
                 */
                try {
                    console.log('Add time');
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.type( IG_post.time, { waitUntil: "networkidle2" } );
                } catch (err) {
                    console.log('Error typing in the crosspost time : ' + err);
                }


            }




            /**
             * Skip if Cover image is empty.
             */
            if ('' !== IG_post.cover){


                /**
                 * Change Cover Image
                 */
                try {
                    console.log('Selecting Cover Image');
                    await page.waitForXPath(selector.xpath_cover_image);
                    const [cover_image] = await page.$x(selector.xpath_cover_image);
                    await cover_image.click();
                } catch (err) {
                    console.log('Error selecting the "cover image" sidebar : ' + err);
                }




                /**
                 * Custom upload box
                 */
            
                try {
                    console.log('Click custom upload box');
                    await page.waitForXPath(selector.xpath_custom_upload);
                    const [custom_upload] = await page.$x(selector.xpath_custom_upload);
                    await custom_upload.click();
                } catch (err) {
                    console.log('Error clicking the "custom upload" box : ' + err);
                }




                /**
                 * Click "Add Image" within custom upload.
                 */
            
                try {
                    console.log('Click "add image"');
                    await page.waitForSelector(selector.input_add_image);
                    const fileInput = await page.$(selector.input_add_image);
                    await fileInput.uploadFile(IG_post.cover);
                } catch (err) {
                    console.log('Error clicking the "Add Image" button : ' + err);
                }
            }






            /**
             * Publish immediately if no date or time supplied.
             */
            if ('' !== IG_post.date && '' !== IG_post.time ){

                /**
                 * Click down arrow next to 'publish'
                 */
                try {
                    console.log('Click down-arrow');
                    const [down_arrow] = await page.$x(selector.publish_chooser);
                    await down_arrow.click();
                } catch (err) {
                    console.log('Error clicking publish options down-arrow : ' + err);
                }




                /**
                 * Click schedule checkbox
                 */
                try {
                    console.log('Click schedule checkbox');
                    await page.waitForTimeout(500);
                    await page.click(selector.schedule_checkbox, { waitUntil: "networkidle2" });

                } catch (err) {
                    console.log('Error clicking the schedule checkbox : ' + err);
                }



                /**
                 * Add date
                 */
                try {
                    console.log('Add date');
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.type( IG_post.date,  { waitUntil: "networkidle2" } );
                } catch (err) {
                    console.log('Error typing in the date : ' + err);
                }





                /**
                 * Add Time
                 */
                try {
                    console.log('Add time');
                    await page.keyboard.press('Tab', {delay: 100});
                    await page.keyboard.type( IG_post.time, { waitUntil: "networkidle2" } );
                } catch (err) {
                    console.log('Error typing in the time : ' + err);
                }

            }


            /**
             * PUBLISH 
             */
            try {
                console.log('Click Publish');
                await page.waitForTimeout(1000);
                await page.click(selector.publish_button, { waitUntil: "networkidle2" });
            } catch (err) {
                console.log('Error clicking the publish button : ' + err);
            }


            /**
             * Done
             */
            try {
                console.log('Done');
                await page.screenshot({path: 'screenshot-done.png'})
                await page.waitForTimeout(20000);
                await browser.close();
            } catch (err) {
                console.log('Error closing the browser : ' + err);
            }
        
        })();

    }


    // ┌─────────────────────────────────────────────────────────────────────────────┐
    // │                                                                             │
    // │ Make these things public:                                                   │
    // │                                                                             │
    // │ 1. puppeteer_settings object So you can update and change the defaults.     │
    // │                                                                             │
    // │ 2. IG_post object to update the default post values.                        │
    // │                                                                             │
    // │ 3. user() method to set the facebook username to login with.                │
    // │                                                                             │
    // │ 4. pass() method to login with.                                             │
    // │                                                                             │
    // │ 5. run() method to kick everything off.                                     │
    // │                                                                             │
    // │ 6. cookiefile is the path to the json file to store all cookies.            │
    // │                                                                             │
    // └─────────────────────────────────────────────────────────────────────────────┘
    return {
        puppeteer_settings,     
        IG_post,
        run: publicRun,
        user: publicSetUsername,
        pass: publicSetPassword,
        cookies: publicSetCookieFile,
        settings: publicSetPuppeteerSettings,
    };

})();


// ┌─────────────────────────────────────────────────────────┐
// │                                                         │
// │           Export the creator_studio variable.           │
// │        Use the require() function to import it.         │
// │                                                         │
// │ https://stackoverflow.com/questions/950087/how-do-i-inc │
// │    lude-a-javascript-file-in-another-javascript-file    │
// │                                                         │
// └─────────────────────────────────────────────────────────┘
module.exports = { creator_studio };
