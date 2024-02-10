const express=require('express');
const router=express.Router();
const User=require("../models/userModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

router.get('/signup',(req,res)=>{
    res.render('signup',{title:"Signup"});
});

router.get('/login',(req,res)=>{
    res.render('login',{title:"Login"});
});

router.post('/signup',async (req,res)=>{
    const salt=await bcrypt.genSalt(10);
    pass=await bcrypt.hash(req.body.pass,salt);
    try{
        const user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:pass
        });
        const token=createToken(user._id);
        res.cookie('JWT',token,{maxAge: 1000*60*60*24,httpOnly: true});
        res.redirect('/');
    }
    catch(err){
        res.redirect('/404');
    }
});

function createToken(id){
    return jwt.sign({ id },process.env.SECRET,{expiresIn: 1000*60*60*24});
}

router.post('/login',async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        if(user){
            const pass=await bcrypt.compare(req.body.pass,user.password);
            if(pass){
                const token=createToken(user._id);
                res.cookie('JWT',token,{maxAge: 1000*60*60*24,httpOnly: true});
                res.redirect('/');
            }
        }
        else{
            throw Error("error");
        }
    }
    catch(err){
        res.redirect('/404');
    }
});

router.get('/logout',(req,res)=>{
    res.cookie("JWT",'',{maxAge:1});
    res.redirect('/');
});

function userOnly(req,res,next){
    if(res.locals.user){
        next();
    }
    else{
        res.redirect('/auth/login');
    }
}

function protectRoutes(req,res,next){
    const token=req.cookies.JWT;
    if(token){
        jwt.verify(token,process.env.SECRET,(err,{id})=>{
            if(err){
                res.locals.user=null;
                next(); 
            }
            else{
                User.findById(id).then(user=>{
                    res.locals.user=user;
                    next(); 
                }).catch(err => {
                    res.redirect('/404');
                });
            }
        });
    }
    else{
        res.locals.user=null;
        next();
    }
}

module.exports={
    auth:router,
    protectRoutes,
    userOnly
};