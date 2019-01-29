# dojot-emu
Emulate behaviors needed but not yet implemented on [dojot platform](https://github.com/dojot).

# Installation

## Build
This module should be packed into a docker image. On the project directory, run the following command:

`docker build -t dojot-emu .`

And wait until the image is created.

## Deploy
The recommended way of using this module is through the [dojot's docker-compose](https://github.com/dojot/docker-compose) deploy.

`git clone https://github.com/dojot/docker-compose.git`

### Add the built image into compose configuration

On `docker-compose.yml` file, add the following.

```yml
  emulator:
    image: dojot-emu
    restart: always
    depends_on:
      - data-broker
    environment:
      IOTA_PORT: 8083
    logging:
      driver: json-file
      options:
        max-size: 100m
```

### Add its endpoint to kong
After cloning the compose repository, add the following to the bottom of `kong.config.sh`

```bash
# Configure emu endpoints
(curl -o /dev/null ${kong}/apis -sS -X POST \
    --header "Content-Type: application/json" \
    -d @- ) <<PAYLOAD
{
     "name": "emulator",
     "uris": "/emu",
     "strip_uri": true,
     "upstream_url": "http://emulator:8083/"
 }
PAYLOAD
```

### Start the module

The docker-compose command can be used to apply the changes:

`docker-compose up -d`

## Validate
The deployment can be checked by hitting the /emu endpoint on your dojot server.

`curl localhost:8000/emu`
