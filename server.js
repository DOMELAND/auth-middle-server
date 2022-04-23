const express = require('express');
const dotenv = require('dotenv');

const Web3Token = require('web3-token');
const fetch = require('node-fetch');

dotenv.config();

// Define MiddleWare to verify Web3-token
let tokenVerify = async (req, res, next) => {
    const token = req.headers['Authorization']
    const { address, body } = await Web3Token.verify(token);
    //  throw new Error('Web3-oken verify failed !')
    console.log('Verified by Middleware! Address Recovered', address, body);
    next();
};


//注：3xx-5xx响应为不是异常
//通常创建一个helper函数来检查响应是否有（4xx）或服务器（5xx）错误响应
let checkfunction  = function (res) {
  if (res.ok) { // res.status >= 200 && res.status < 300
     // console.log(res.ok);
     // console.log(res.status);
     // console.log(res.statusText);
     return res;
  } else {
      res.status(400).json({ message: res.statusText });
     // throw new Error(res.statusText);
  }
};


// Create express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// install tokenVerify middleware
app.use(tokenVerify);

// Routes
app.get('/', async (req, res) => {
  res.json({ message: 'DOMELAND API, please sign in at /v1/auth/register' });
});


// Domeland user register api
app.post('/web3/register', async (req, res) => {
    let address =  req.body.ethaddr;
    let passwd = req.body.password;
    let usernm = req.body.username;

      
    const body = {
        ethaddr : address,
        password : passwd,
        username : usernm
    };

  fetch('http://localhost:8081/register', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(checkStatus)
    .then(res => console.log('will not get here...'));

});

// Web3-token verify api
app.post('/web3/verify', async (req, res) => {
    const token = req.headers['Authorization']
    const { address, body } = await Web3Token.verify(token);
    console.log('Verify OK, Address Recovered', address, body);
    res.json({ message: 'Verify OK!' + address });
});


// User change password
// need the ethaddr and password passed as a JSON object: {“ethaddr":”0x8C.......34b", “password": “123456789"}
app.post('/web3/changepass', async (req, res) => {
    let address =  req.body.ethaddr;
    let passwd = req.body.password;
    
    const body = {
       ethaddr : address,
       password : passwd
    };

    fetch('http://localhost:8081/change_pass', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(checkStatus)
    .then(res => console.log('will not get here...'));

});


// Error Process Middleware
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message })
})



// Starting server
app.listen(
  process.env.PORT,
  console.log('Auth-Middle-Server Listening on port ', process.env.PORT)
);
