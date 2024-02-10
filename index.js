const express=require("express");
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const cookie=require('cookie-parser');
const app=express();
const port=8080;
const home=require('./routes/homeRoutes');
const blogs=require('./routes/blogsRoutes');
const about=require('./routes/aboutRoutes');
const contact=require('./routes/contactRoutes');
const {auth,protectRoutes,userOnly}=require("./routes/authRoutes");
require('dotenv').config();

mongoose.connect(process.env.DB_KEY).then(()=>console.log("Success")).catch((err)=>console.log("Error"));

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(cookie());
app.use((req,res,next)=>{
    if(req.query._method=="DELETE"){
        req.method="DELETE";
        req.url=req.path;
    }
    next();
})

app.use('/',protectRoutes,home);
app.use('/blogs',userOnly,protectRoutes,blogs);
app.use('/about',protectRoutes,about);
app.use('/contact',protectRoutes,contact);
app.use('/auth',auth);

app.use((req,res)=>res.status(404).render('404',{title:'404'})); 

app.listen(port);
