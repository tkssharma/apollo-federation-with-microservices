## notification [NestJS APIs]

### prerequisite

- Node JS installed on system 
- Docker latest version
- Any editor of your choice [vscode]

### Installation and Setup
##### Cloning code
```
git clone <repo>
```
#### create .env file

```sh
NODE_ENV=local
PORT=3010
AUTH_PROVIDER=auth0
AUTH_SECRET=HELLODEMO
DATABASE_URL= postgres://api:development_pass@localhost:5435/notification-manager-api
ROLLBAR_TOKEN=
NEW_RELIC_LICENSE_KEY=
LOG_LEVEL=debug
SWAGGER_USERNAME=money-moves
SWAGGER_PASSWORD=money-moves
```

# Running tests
```
docker-compose exec node npm run test


> contract-repository@1.0.0 pretest /app
> npm run test:migration


> contract-repository@1.0.0 test:migration /app
> dotenv -e env.test --  typeorm migration:run
```

# Running tests (only unit or e2e)

```
docker-compose exec node npm run test:unit
docker-compose exec node npm run test:e2e
```

Please ensure to set the right environment variables in the .env file.

## Debugging:
For debugging support, copy the provided docker compose override

```
cp docker-compose.override.debug.yml docker-compose.override.yml
```
This will expose debugger port 5858, rest you just need to have launch.json file in root of pr project

Just configure your inspector to attach to port 5858
add launch.json in .vscode folder [vscode editor] for docker container debugging 

```
{
  "configurations": [
    {
      "name": "Docker: Attach to Node",
      "type": "node",
      "request": "attach",
      "port": 5858,
      "address": "0.0.0.0",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/",
      "protocol": "inspector"
    }
  ]
}
```
