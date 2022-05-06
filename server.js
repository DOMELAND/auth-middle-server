const express = require('express');
const dotenv = require('dotenv');

const Web3Token = require('web3-token');
const fetch = require('node-fetch');


dotenv.config();

const authhead = 'authorization';

// Define MiddleWare to verify Web3-token
let tokenVerify = async (req, res, next) => {
    const token = req.headers[ authhead ];
    console.log('Auth-head ', token);
    const { address, body } = await Web3Token.verify(token);
    //  throw new Error('Web3-oken verify failed !')
    console.log('Verified by Middleware! Address Recovered', address, body);
    next();
};


// Create express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// install tokenVerify middleware
// app.use(tokenVerify);

// Routes
app.get('/web3', async (req, res) => {
  res.json({ message: 'Hello DOMELAND Web3 API, Verify token by access /web3/verify' });
});


app.get('/web3/verify', async (req, res) => {
  const token = req.headers[ authhead ];
  const { address, body } = await Web3Token.verify(token);
  console.log('Verify OK, Address Recovered', address, body);
  res.json({ message: ' Verify token ' });
});



// Domeland user register api
 app.post('/web3/register', tokenVerify, async (req, res) => {
// app.post('/web3/register',  async (req, res) => {
    let address =  req.body.ethaddr;
    let passwd = req.body.password;
    let usernm = req.body.username;

    const body = {
        ethaddr : address,
        password : passwd,
        username : usernm
    };

  let resp = await fetch('http://localhost:8081/register', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });

     console.log( resp.ok );
     let status = resp.status;
     let text = await resp.text();
//     res.json({ message: text });  
     res.status(status).json({ message: text });
         
});


// User change password
// need the ethaddr and password passed as a JSON object: {“ethaddr":”0x8C.......34b", “password": “123456789"}
app.post('/web3/changepass', tokenVerify, async (req, res) => {
//app.post('/web3/changepass',  async (req, res) => {
    let address =  req.body.ethaddr;
    let passwd = req.body.password;
    
    const body = {
       ethaddr : address,
       password : passwd
    };

    let resp = await fetch('http://localhost:8081/change_pass', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
    
    console.log( resp.ok );
    let status = resp.status;
    let text = await resp.text();
  //  res.json({ message: text });  
    res.status(status).json({ message: text });
        
});



// Error Process Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})



// Starting server
app.listen(
  process.env.PORT,
  console.log('Auth-Middle-Server Listening on port ', process.env.PORT)
);
