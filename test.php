<?php



// ┌─────────────────────────────────────────────────────────────────────────┐
// │                         Use composer autoloader                         │
// └─────────────────────────────────────────────────────────────────────────┘
require __DIR__.'/vendor/autoload.php';


use Nesk\Puphpeteer\Puppeteer;
use Nesk\Rialto\Data\JsFunction;


class creator_studio {



    /**
     * Puppeteer Options
     * https://github.com/puppeteer/puppeteer/blob/v1.1.1/docs/api.md#puppeteerlaunchoptions
     */
    private $options = [
        'headless' => false,
        'devtools' => true,
        'read_timeout' => 90000,
        'idle_timeout' => 90000,
        'executablePath' => "/Users/andrewpearson/Storage/Code/_Small_Experiments/test_puphpeteer/Chromium.app/Contents/MacOS/Chromium",
    ];





    /**
     * Location of the cookie file
     */
    private $cookie_file = "/Users/andrewpearson/Storage/Code/_Small_Experiments/test_puphpeteer/cookies.json";





    /**
     * Account Details
     */
    private $user = '';
    private $pass = '';




    
    /**
     * Instagram Post Data
     * 
     * [
     *      caption => "Caption",
     *      
     * 
     * ]
     */
    private $IG_post = [
        'caption'  => 'Testing Puppeteer',
        'location' => 'London',
        'file'     => '/Users/andrewpearson/video.mp4',
        // 'file'     => '/Users/andrewpearson/image.jpg',
    ];





    /**
     * Set Debug on / off
     */
    private $debug = false;






    /**
     * Set any new options for puppeteer.
     * Array of values.
     */
    public function set_options($options)
    {
        $this->options = $options;
    }




    /**
     * Update the absolute path to the cookie file.
     */
    public function set_cookie_file($cookie_file)
    {
        $this->cookie_file = $cookie_file;
    }





    /**
     * Update the absolute path to the cookie file.
     */
    public function set_ig_post($ig_post)
    {
        $this->ig_post = $ig_post;
    }





    /**
     * Set the account username / email
     */
    public function set_user($user)
    {
        $this->user = $user;
    }





    /**
     * Set the account password
     */
    public function set_pass($pass)
    {
        $this->pass = $pass;
    }






    /**
     * Set debug on / off
     */
    public function set_debug($debug)
    {
        $this->debug = $debug;
    }

    



    public function run()
    {
        $this->launch();
        $this->check_cookies();
        $this->check_login();
        $this->wait(4000);
        $this->visit_creator_studio();
        $this->click_new_post();
        $this->select_instagram_feed();
        $this->wait(2000);
        $this->enter_caption();
        $this->enter_location();
        $this->click_add_content_link();
        $this->wait(1000);
        // $this->click_file_upload_link();
        // $this->wait(4000);
        $this->select_file_upload();


        // $this->screenshot('example.png');
        $this->wait(10000000);
    }




    /**
     * Create a new instance of puppeteer,
     * set the custom options for it and
     * launch a new page.
     * 
     * Additional - set a new timeout.
     */
    private function launch()
    {

        if ($this->debug){ echo '<p>Launching</p>'; }


        $this->puppeteer = new Puppeteer();


        $this->browser = $this->puppeteer->launch($this->options);


        $this->page = $this->browser->newPage();


        $this->page->setDefaultNavigationTimeout(1000000);

    }





    /**
     * Check for existance of cookie file.
     * If exists, set the cookies on the page.
     */
    private function check_cookies()
    {

        if ($this->debug){ echo '<p>Checking Cookies</p>'; }


        if (0 != filesize($this->cookie_file))
        {

            $cookies = json_decode(file_get_contents($this->cookie_file));


            if ($this->debug){ echo '<pre>' . print_r($cookie_file, true) . '</pre>'; }


            foreach ($cookies as $cookie)
            {

                $this->page->setCookie($cookie);

            }

        }

    }





    /**
     * Check Cookie file doesn't exist - login instead.
     */
    private function check_login()
    {

        if ($this->debug){ echo '<p>Checking Login Page</p>'; }


        if (0 == filesize($this->cookie_file)) {

            /**
             * Login Page
             */
            $this->page->goto("https://www.facebook.com/login", [ 'waitUntil' => 'networkidle2' ]);

            /**
             * IF there is a cookie banner, click it.
             */
            $this->page->tryCatch->click('[data-cookiebanner="accept_button"]');

            /**
             * Login details
             * 
             * Use 'evaluate' with some Javascript because it will
             * remove any existing text in the input box. (supplied by
             * the cookies)
             */
            $this->page->evaluate(JsFunction::createWithBody("
                document.getElementById('email').value = '".$this->user."';
                document.getElementById('pass').value = '".$this->pass."';
            "));

            /**
             * Click login button
             */
            $this->page->waitFor(1000);
            $this->page->tryCatch->click('#loginbutton', [ 'waitUntil' => 'networkidle2' ]);

        }
    }




    /**
     * Visit Creator Studio page
     */
    private function visit_creator_studio()
    {

        if ($this->debug){ echo '<p>Visiting Creator Studio page</p>'; }

        $this->page->tryCatch->goto('https://business.facebook.com/creatorstudio/?tab=instagram_content_posts&collection_id=free_form_collection&content_table=INSTAGRAM_POSTS');


    }





    /**
     * Once creator studio is loaded, save any cookies
     * so that we don't need to keep logging in.
     */
    private function save_cookies()
    {

        if ($this->debug){ echo '<p>Saving Cookies</p>'; }


        $cookies = $this->page->tryCatch->cookies();


        file_put_contents($this->cookie_file, print_r(json_encode($cookies), true));


    }




    /**
     * Click on the new post button
     */
    private function click_new_post()
    {

        if ($this->debug){ echo '<p>Clicking "new post" button</p>'; }


        $this->page->tryCatch->click('#mediaManagerLeftNavigation [role="button"]', [ 'waitUntil' => 'networkidle2' ]);


    }




    /**
     * Select the "instagram feed" button
     */
    private function select_instagram_feed()
    {

        if ($this->debug){ echo '<p>Selecting "Instagram Feed" link</p>'; }


        $this->page->tryCatch->click('[data-testid="ContextualLayerRoot"] [role="menuitem"]:first-of-type', [ 'waitUntil' => 'networkidle2' ]);


    }




    /**
     * Type in the caption of the new Instagram posts
     */
    private function enter_caption()
    {

        if ($this->debug){ echo '<p>Entering a Caption</p>'; }


        $this->page->tryCatch->type('[contenteditable="true"]', $this->IG_post['caption']);


    }




    /**
     * TAB into the location textbox and enter the location
     */
    private function enter_location()
    {

        if ($this->debug){ echo '<p>Entering a location</p>'; }


        $this->page->tryCatch->keyboard->press('Tab');
        $this->page->tryCatch->keyboard->press('Tab');


        $this->page->tryCatch->keyboard->type($this->IG_post['location']);


    }




    /**
     * Click on the +Add Content link
     */
    private function click_add_content_link()
    {

        if ($this->debug){ echo '<p>Clicking on the "+Add Content" link</p>'; }


        $this->page->tryCatch->click('#creator_studio_sliding_tray_root [aria-haspopup="true"]:first-of-type', [ 'waitUntil' => 'networkidle2' ]);


    }



    /**
     * Click on the "from file upload" link
     */
    private function click_file_upload_link()
    {

        if ($this->debug){ echo '<p>Clicking the "from File Upload" link</p>'; }


        $this->page->tryCatch->click('[rel="ignore"]', [ 'waitUntil' => 'networkidle2' ]);


    }





    /**
     * Select the correct file in the filesystem 
     * file upload dialog.
     */
    private function select_file_upload()
    {

        if ($this->debug){ echo '<p>Uploading file from filesystem</p>'; }
        

        $this->page->tryCatch->querySelector('input[type="file"]')->uploadFile($this->IG_post['file']); // Images work.


        $fileChooser = $this->page->tryCatch->Promise->all();
    }




    /**
     * Wait for specific amount of milliseconds.
     */
    private function wait($ms)
    {

        if ($this->debug){ echo '<p>Waiting for '.$ms.'ms</p>'; }


        $this->page->waitFor($ms);


    }




    /**
     * Take a screenshot and save it as the filename.
     */
    private function screenshot($filename)
    {

        if ($this->debug){ echo '<p>Taking a screenshot</p>'; }


        $this->page->screenshot(['path' => $filename]);


    }


}



require __DIR__.'/vendor/autoload.php';

$CS = new creator_studio();
$CS->set_debug(true);
$CS->set_user('andy.n.p@gmail.com');
$CS->set_pass('6WiseWomen');
$CS->run();
