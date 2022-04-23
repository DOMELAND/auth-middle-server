# Middle-server

This is the implementation of the  auth-middle-server  for Domeland 

## Dependencies

The Middle server is implemented using JS.
For more information about Domeland/Veloren development, please refer to: https://yielddao.io/

## Build the server
To build the server, you can simply run the following command: `npm install`

## Setting up your own auth middle server

### Local server

1. you can set server listening PORT in dotenv config file：`vim .env`
2. start server run the command: `npm start`

### Run the auth server as a service using pm2
 You can install PM2 , and use pm2 run the auth-server as a service. <br>
 1. first install PM2 : `npm install pm2@latest -g` <br>
 2. then run auth-server by PM2 : `pm2 start auth-middle-server/server.js`<br>
 3. more PM2 infomation: https://pm2.keymetrics.io/docs/usage/quick-start/ <br>

#### Deployment notice
To keep your data secured, it is essential to setup the server to be connected to through a public network run behind a TLS terminator such as nginx


## Test    
 To test the DOMELAND Account web sevice, following are some cases  <br>
 ( test tools: https://www.apifox.cn/web/  or POSTMAN):

##### API: ping-pong Test
```
 URL:  http://localhost:19253
 with web3-token in header 
 Method: GET
```

#####  API: account register 
```
 URL:  http://localhost:19253/web3/register
 Method: POST
 with web3-token in header
 Body (Json):
 {
   "username":"max123",
   "password":"123456",
   "ethaddr":"0x9c5Eb6CcB92e551ec1671cdafF7b55d44A28615b"
 } 
 ```
 
##### API: generate one-time access token to  game-server
```
 URL: http://localhost:19253/web3/verify
 Method: POST
 with web3-token in header

 ```


###### API change password by eth_address
```
URL: http://localhost:19253/web3/changepass
Method: POST
With web3-token in header
Body (Json):
{
    "ethaddr": "0x8c5Eb6CcB92e551ec1671cdafF7b55d44A28615a"
    "password": "123456789max"
}
```