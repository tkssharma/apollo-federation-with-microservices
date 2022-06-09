## Home-manager APIs [NestJS APIs]

### Installation and Setup

```bash
# install from package-lock.json (quicker)
npm ci
# install and update deps at package-lock.json (slower)
npm i
```

##### Copy files

populate .env file correctly
```
NODE_ENV=local
LOG_LEVEL=http
PORT=5009
DATABASE_URL=postgres://api:development_pass@localhost:5439/file-manager-api
NODE_ENV=local
JWT_SECRET=HELLODEMO
JWT_EXPIRE_IN=3600*24
AWS_BUCKET_NAME=atlas-fractional-home-ownership
AWS_ACCESS_KEY=BBBBBBBBBBBBBBB
AWS_SECRET_ACCESS=BBBBBBBBBBBB
AWS_REGION=us-east-1
```


```
cp env.example .env
```

## starting application

```
npm run start:dev
```
## Testing Application 

```
curl --location --request POST 'https://file-manager-api-dev.herokuapp.com/graphql' \
-H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMyZWE2MC02MzcwLTRlMDMtYTBlMy1lOGFlM2ZlZjYyYjgiLCJlbWFpbCI6ImFkbWluLmFkbWluQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbImFkbWluIl0sImV4cGlyYXRpb24iOiIyMDIyLTA2LTEwVDAzOjUyOjI2LjEwNFoiLCJpYXQiOjE2NTQ1NjUxNDYsImV4cCI6MTY1NDgzMzE0Nn0.DJZQ8svrd6HgChzdw0IVNTpXpzPCSZaAoleLwaWfX9I' \
--form 'operations="{\"query\": \"mutation uploadFile($id: String!, $file: Upload!) {  uploadFile(id: $id, file: $file){    reference_id url success name mimetype id storage_unique_name}} \", \"variables\": {\"file\": null, \"id\": \"d23d24dc-e1f1-11ec-8fea-0242ac120002\"}}"' \
--form 'map="{\"0\": [\"variables.file\"]}"' \
--form 'map="{\"1\": [\"variables.id\"]}"' \
--form '0=@"./mocha.jpg"'
--form '1=@"d23d24dc-e1f1-11ec-8fea-0242ac120002"'
{"data":{"uploadFile":{"reference_id":"d23d24dc-e1f1-11ec-8fea-0242ac120002","url":"https://atlas-fractional-home-ownership.s3.amazonaws.com/f71f30f8-d327-4394-97cd-c0d50afb183e-mocha.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZGLBBDEH7JMRHCWI%2F20220607%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220607T070037Z&X-Amz-Expires=604800&X-Amz-Signature=bf65c6ecd65c202fdd784a2d3d51d60c62e0d64e6d755dab46b418a21436592d&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%20%3D%22mocha.jpg%22","success":true,"name":"mocha.jpg","mimetype":null,"id":"4cf0f28b-0d9f-4d8d-af82-0d374bd4c2a1","storage_unique_name":"f71f30f8-d327-4394-97cd-c0d50afb183e-mocha.jpg"}}}

```
