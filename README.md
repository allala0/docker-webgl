## About this repo
This repo is trying to achieve running WebGL applications inside of Docker container or Cloud Service with GPU acceleration without forwarding XServer and DISPLAY. In our particullar example we are using three.js with puppeteer.

## Goal
Goal is to run WebGL with GPU acceleration using target run commands below without editing them, we can edit all other files and create new ones. Alternative solution will be finding Cloud Service that supports OpenGL/WebGL rendering or one that gives access to XServer and DISPLAY inside of container or one that allows to pass arguments to "docker run" command by ourselves or any other solution of running WebGL with GPU inside Docker container that we are not aware of right now.

## How to install system dependencies on Ubuntu
```shell
# Install nodejs
sudo apt-get update -y
sudo apt-get install -y curl
sudo curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs

# Install Google Chrome dependencies
sudo apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
```

## How to run GPU acceleration test and three.js rendering test locally
```shell
npm run test
```

## Target method of running using Podman
```shell
podman build -f Dockerfile -t $USER/docker-webgl
podman run -i -t --rm --network=host $USER/docker-webgl:latest
```

## Target method of running using Docker
```shell
sudo docker build -f Dockerfile . -t $USER/docker-webgl
sudo docker run -it --rm --net=host $USER/docker-webgl:latest
```

## Known method of running using Podman with XServer forwarding
```shell
podman build -f Dockerfile -t $USER/docker-webgl
xhost +local:
podman run -i -t --rm --network=host -v /tmp/.X11-unix:/tmp/.X11-unix -v /dev/dri:/dev/dri --security-opt=label=type:container_runtime_t -e DISPLAY=$DISPLAY $USER/docker-webgl:latest

podman run -i -t --rm $USER/docker-webgl:latest
```

## Known method of running using Docker using docker run arguments
```shell
sudo docker build -f Dockerfile . -t $USER/docker-webgl
xhost +local:
sudo docker run -it --rm --net=host -v /tmp/.X11-unix:/tmp/.X11-unix -v="$HOME/.Xauthority:/root/.Xauthority:rw" -v /dev/dri:/dev/dri --security-opt=label=type:container_runtime_t -e DISPLAY=$DISPLAY $USER/docker-webgl:latest
```
