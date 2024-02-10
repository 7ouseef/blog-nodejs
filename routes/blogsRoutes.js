const express=require('express');
const router=express.Router();
const Blog=require('../models/blogModel');

router.get('/',async(req,res)=>{
    blogs=await Blog.find().sort({date:-1});
    res.render('blogs',{title:"Blogs",blogs});
});

router.get('/create',(req,res)=>{
    res.render('createBlog',{title:'Create'});
});

router.post('/create',(req,res)=>{
    const doc=new Blog({
        heading: req.body.name,
        content: req.body.text,
        author: res.locals.user.name,
        owner: res.locals.user._id,
        date: new Date()
    });
    doc.save().then(()=>res.redirect('/blogs')).catch((err)=>{
        console.log(err);
        res.redirect('/404')
    });
});

router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id);
    res.render('blog',{title:blog.heading,blog});
})

router.get('/:id/update',async (req,res)=>{
    const blog=await Blog.findById(req.params.id);
    res.render('updateBlog',{title:blog.heading,blog});
});

router.put('/:id/update', protectBlogs , (req,res)=>{
    Blog.findByIdAndUpdate(req.params.id.trim(),{heading:req.body.name,content:req.body.text})
        .then(()=>res.redirect('/blogs'))
        .catch(()=>res.redirect('/404'));
});

router.delete('/:id', protectBlogs , (req,res)=>{
    Blog.findByIdAndDelete(req.params.id.trim())
        .then(()=>res.redirect('/blogs'))
        .catch(()=>res.redirect('/404'));
});

async function protectBlogs(req,res,next){
    const blog=await Blog.findById(req.params.id);
    if(res.locals.user._id.toString() ==blog.owner.toString() ){
        next();
    }
    else{
        res.redirect('/404');
    }
}

module.exports=router;
