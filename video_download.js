var video_downloader = (function () {

    const fs = require('fs');
    const http = require('http');
    const https = require('https');

    /**
     * Downloads file from remote HTTP[S] host and puts its contents to the
     * specified location.
     */
    async function download(url, filePath) {

        const proto = !url.charAt(4).localeCompare('s') ? https : http;

        return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let fileInfo = null;

        const request = proto.get(url, response => {
            if (response.statusCode !== 200) {
            reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            return;
            }

            fileInfo = {
            mime: response.headers['content-type'],
            size: parseInt(response.headers['content-length'], 10),
            };

            response.pipe(file);
        });

        // The destination stream is ended by the time it's called
        file.on('finish', () => resolve(fileInfo));

        request.on('error', err => {
            fs.unlink(filePath, () => reject(err));
        });

        file.on('error', err => {
            fs.unlink(filePath, () => reject(err));
        });

        request.end();
        });
    }


    // ┌─────────────────────────────────────────────────────────────────────────────┐
    // │                                                                             │
    // │ Make these things public:                                                   │
    // │                                                                             │
    // └─────────────────────────────────────────────────────────────────────────────┘
    return {
        download: download
    };

})();


// ┌─────────────────────────────────────────────────────────┐
// │                                                         │
// │           Export the video_downloader variable.         │
// │        Use the require() function to import it.         │
// │                                                         │
// │ https://stackoverflow.com/questions/950087/how-do-i-inc │
// │    lude-a-javascript-file-in-another-javascript-file    │
// │                                                         │
// └─────────────────────────────────────────────────────────┘
module.exports = { video_downloader };

// video_downloader.download("https://londonparkour.com/wp-content/uploads/2020/10/output.mp4", "./test_puphpeteer/output.mp4");