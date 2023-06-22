FROM ubuntu:22.04

# Disable all user inputs while installing
ENV DEBIAN_FRONTEND=noninteractive

# Disable caching from previous layers
ARG CACHEBUST=1

# Install dependencies
RUN apt-get update -y && apt-get install -y curl gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Copy local code to the container image
WORKDIR /usr/local/app
COPY . .
RUN chmod +x ./entrypoint.sh

# Install project dependencies
RUN npm install

# Execute entrypoint commands
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
