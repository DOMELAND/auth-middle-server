const express = require('express');
const dotenv = require('dotenv');

const fetch = require('node-fetch');

dotenv.config();



// Create express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// install tokenVerify middleware
// app.use(tokenVerify);

// Routes
app.get('/test', async (req, res) => {

console.log(' hello ');

  const body =  {
    "username":"max169",
    "password":"123456",
    "ethaddr":"0x4c5Eb6Cc232e5513c2641cdaf37b55d44A25615b"
  } ;

  console.log('hello1 ');

let  resp = await fetch('http://gw.321.io:19253/register', {
    method: 'post',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
});


  console.log( resp.ok );
     let text = await resp.text();
     console.log( "bad",text);
     res.json({ message: text });



});


// Starting server
app.listen(
  process.env.PORT,
  console.log(' Listening on port ', process.env.PORT)
);
