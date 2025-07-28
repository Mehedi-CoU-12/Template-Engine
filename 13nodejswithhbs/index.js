const express=require('express');
const dotenv=require('dotenv');

dotenv.config();


const app=express();
const PORT=process.env.PORT || 5000;

app.get('/',(req,res)=>{
    return res.send('sumon')
})

app.listen(PORT,()=>{
    console.log(`server listen on: http://localhost:${PORT}`);
})