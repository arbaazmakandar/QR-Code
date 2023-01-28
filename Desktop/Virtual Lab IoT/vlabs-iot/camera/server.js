const express = require('express')
const app = express();
const port = 4000;

app.get('/cam1',(req,res)=>{
    res.sendFile(__dirname+'/index1.html');
})
app.get('/cam2',(req,res)=>{
    res.sendFile(__dirname+'/index2.html');
})
app.get('/cam3',(req,res)=>{
    res.sendFile(__dirname+'/index3.html');
})
app.listen(port,()=>{
    console.log(port + ' working successfully!')
})