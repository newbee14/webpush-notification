# Web-Push Service

#### Dependencies
1.web-push
2.express
3.body-parser
4.path
5.firebase

********

# Features!

  - Send custom notfication.
  - Redirectes to specific urls.

# API sepcs

| Title | Specification |
| ------ | ------ |
| Endpoint | ***http://localhost:8085/*** send-push-msg |
| Request Method |  ***POST***| 
|Request Content-Type| JSON(application/Json)|
|Request data| {"data":{"msg":"hello world","url":"https://xyz.com","title":"Push Msg"}}|
| Response | Status Code(200), Status Code(400) and error message|


### Installation

Web-Push requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and start the server.

```sh
$ npm install
$ node aapp.js ||  start
```

### Important points

 - Change the firebase json key when migrating to prod.
 - By default the port is 8085 change it if required

