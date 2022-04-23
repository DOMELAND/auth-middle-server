# Middle-server

This is the implementation of the  auth-middle-server  for Domeland 

#### Topology

![](https://s3.bmp.ovh/imgs/2022/04/23/01a5780c227c88f9.png)


#### Nginx Config

```
server {

    listen 19253;
    server_name gw.test.com;    #your domain name
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
      
    # auth-server for DomeLand/Veloren Game-server
    location  / {
                proxy_redirect off;
                proxy_pass http://127.0.0.1:8081;   
                proxy_http_version 1.1;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
    }

    # /change_pass API can be called only for middle-server.  !!!
    location  /change_pass {
            break;   
    }   

    # auth-middle-server for Domeland Web3-Dapp
    location  /web3 {
                proxy_redirect off;
                proxy_pass http://127.0.0.1:8082;
                proxy_http_version 1.1;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
   }

}

```

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

##### API: Web3 Hello Test

```
 URL:  http://localhost:19253/web3
 Method: GET
```

##### API: account register

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

##### API: verify web3-token 
```
 URL: http://localhost:19253/web3/verify
 Method: GET
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