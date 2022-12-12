const express =  require('express');
const {connection} = require('./config/db');
const {UserModel} = require('./models/UserModel.js');
const {CrudModel}= require('./models/CrudModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PORT = process.env.PORT || 8000
const app = express();
app.use(express.json());
const { authentication } = require('./middlewares/authentication.js');
app.get('/', (req,res) => {
    res.send('welcome to this page');
})

/* Started Signup here */
app.post("/signup", async(req,res) => {
    const {ip, email, password} = req.body;
    const isUser = await UserModel.findOne({email});
    if(isUser){
        res.send({"msg": "User already exits, try to log in"})
    }
    else{
        bcrypt.hash(password,4, async(err,hash)=>{
            if(err){
                res.send({"msg":"something went wrong , pleas try again"})
            }
            const new_user = new UserModel({
                ip,
                email,
                password: hash,
            })
            try{
                await new_user.save();
                res.send({"msg": "Signup Successfull"})
            }
            catch(err){
                console.log(err);
                res.send({"msg":"something went wrong"})
            }
        })
    }
})
/* Ended Signup here */

/* Started Login here */
app.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const user=await UserModel.findOne({email})
    console.log(user)
    const hashed_password=user.password;
    const user_id=user.id;
    bcrypt.compare(password,hashed_password,function(err,output){
        if(err)
        {
            res.send({"msg":"Something went wrong"})
        }
        if(output)
        {
            const token=jwt.sign({user_id},process.env.SECRET_KEY);
            res.send({"msg":"Login Successfull",token})
        }
        else{
            res.send({"msg":"Login Failed"})
        }
    })
})
/* Ended Login here */

// Create todos here

app.post("/create",authentication, async(req,res)=>{
    const {taskname,status,tag}=req.body;
    const new_crud= new CrudModel({taskname,status,tag})
    await new_crud.save()
    res.send({"msg":"Todo Data add Successfully "})
})

/*
"taskname": "HTML",
  "status": "pending",
  "tag": "personal"
*/ 

// update todo data

app.patch("/edit/:todos",authentication ,async(req,res)=>{
    const {crud_Id}=req.params;
    await CrudModel.findOneAndUpdate({_id:crud_Id},req.body,{new:true})
    return res.send ({"msg":"Todo Data Upadted Successfully"})
})

// delete todo data

app.delete("/edit/:todos",authentication ,async(req,res)=>{
    const {crud_Id}=req.params;
    await CrudModel.findByIdAndDelete({_id:crud_Id});
    return res.send ({"msg":"Todo Data deleted Successfully"})
})

// showing all data

app.get("/",async(req,res)=>{
    
    const data= await CrudModel.find()
    return res.send({"msg" : "All  data",data})
})


app.listen(PORT, async()=> {
    try{
      await connection;
      console.log("Connected to db Successfully")
    }
    catch(err){
        console.log(err);
        console.log({"msg":"Error connecting to DB"})
    }
    console.log(`Listening to the port ${PORT}`);
})










