# A minimal Docker image with Node and Puppeteer
#
# Initially based upon:
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

FROM node:buster-slim
    

# Install VIM, WGET, GNUPG, ca-certificates, CHROME, wait-for-it.sh
RUN  apt-get update \
        && apt-get install -y vim wget gnupg ca-certificates \
        && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
        && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
        && apt-get update \
        # We install Chrome to get all the OS level dependencies, but Chrome itself
        # is not actually used as it's packaged in the node puppeteer library.
        # Alternatively, we could could include the entire dep list ourselves
        # (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
        # but that seems too easy to get out of date.
        && apt-get install -y google-chrome-stable \
        # Cleanup packages
        && rm -rf /var/lib/apt/lists/* \
        # https://github.com/vishnubob/wait-for-it
        && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
        # Make executable
        && chmod +x /usr/sbin/wait-for-it.sh


WORKDIR /usr/src/app

COPY . ./

# # Install Puppeteer under /node_modules so it's available system-wide
# ADD package.json package-lock.json cli.js server.js creator_studio.js /usr/src/

# Install all node dependencies
# Add user so we don't need --no-sandbox.
# same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN cd /usr/src/app \ 
    && npm install \
    && npm install -g \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser \
    && echo "[]" > /usr/src/app/cookie.json \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src

EXPOSE 8080

CMD [ "node", "server.js" ]