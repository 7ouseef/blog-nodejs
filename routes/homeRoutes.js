const express=require('express');
const router=express.Router();
const Blog=require('../models/blogModel');

router.get('/',async (req,res)=>{
    blogs=await Blog.find().limit(3).sort({date:-1});
    res.render('home',{title:'Home',blogs});
});

module.exports=router;